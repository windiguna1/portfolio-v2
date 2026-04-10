import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Activity from '@/models/Activity';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import cloudinary from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const activity = await Activity.findById(id);
    if (!activity) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(activity);
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
      date: formData.get('date'),
      type: formData.get('type') || 'EVENT',
      description: formData.get('description'),
      content: formData.get('content'),
      featured: formData.get('featured') === 'true',
      order: formData.get('order') || 0,
    };

    // Check if new image uploaded
    const imageFile = formData.get('image');
    if (imageFile && typeof imageFile === 'object' && imageFile.name) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: 'portfolio/activities' }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }).end(buffer);
      });
      updateData.image = uploadResult.secure_url;
    } else {
      // Keep existing image
      const existingImage = formData.get('existingImage');
      if (existingImage) {
        updateData.image = existingImage;
      }
    }

    const activity = await Activity.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    return NextResponse.json(activity);
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
    await Activity.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
