import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Tech from '@/models/Tech';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import cloudinary from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const techs = await Tech.find().sort({ order: 1, createdAt: 1 });
    return NextResponse.json(techs);
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
    
    const name = formData.get('name');
    const order = formData.get('order') || 0;
    let logo = formData.get('logo') || '';
    
    const file = formData.get('logoFile');
    if (file && typeof file === 'object' && file.name) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: 'portfolio/techs' }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }).end(buffer);
      });
      logo = uploadResult.secure_url;
    }

    const tech = await Tech.create({
      name,
      logo,
      order,
    });

    return NextResponse.json(tech, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
