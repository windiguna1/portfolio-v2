import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Activity from '@/models/Activity';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import cloudinary from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const activities = await Activity.find().sort({ date: -1, order: 1 });
    return NextResponse.json(activities);
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
    const date = formData.get('date');
    const type = formData.get('type') || 'EVENT';
    const description = formData.get('description');
    const content = formData.get('content');
    const featured = formData.get('featured') === 'true';
    const order = formData.get('order') || 0;

    let image = '';
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
      image = uploadResult.secure_url;
    }

    const activity = await Activity.create({
      title,
      date,
      type,
      description,
      content,
      image,
      featured,
      order,
    });

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
