import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Project from '@/models/Project';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import cloudinary from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const formData = await req.formData();
    
    const title = formData.get('title');
    const description = formData.get('description');
    const content = formData.get('content');
    const demoUrl = formData.get('demoUrl');
    const repoUrl = formData.get('repoUrl');
    const order = formData.get('order') || 0;
    
    const images = [];
    // Process image uploads
    const imageFiles = formData.getAll('images'); // Multiple files
    for (const file of imageFiles) {
      if (file && typeof file === 'object' && file.name) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Upload to Cloudinary using a promise wrapper
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream({ folder: 'portfolio/projects' }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }).end(buffer);
        });
        
        images.push(uploadResult.secure_url);
      }
    }

    const project = await Project.create({
      title,
      description,
      content,
      demoUrl,
      repoUrl,
      order,
      images
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
