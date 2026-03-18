import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Project from '@/models/Project';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import cloudinary from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const project = await Project.findById(id);
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    const formData = await req.formData();
    
    const updateData = {
      title: formData.get('title'),
      description: formData.get('description'),
      content: formData.get('content'),
      demoUrl: formData.get('demoUrl'),
      repoUrl: formData.get('repoUrl'),
      order: formData.get('order') || 0,
    };

    // Keep existing images passed from client
    const existingImages = formData.getAll('existingImages') || [];
    const newImageFiles = formData.getAll('images');
    const uploadedImages = [];
    
    for (const file of newImageFiles) {
      if (file && typeof file === 'object' && file.name) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream({ folder: 'portfolio/projects' }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }).end(buffer);
        });
        uploadedImages.push(uploadResult.secure_url);
      }
    }

    updateData.images = [...existingImages, ...uploadedImages];

    const project = await Project.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    await Project.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
