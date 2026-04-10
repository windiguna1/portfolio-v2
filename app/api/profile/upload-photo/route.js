import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import connectToDatabase from '@/lib/mongodb';
import Profile from '@/models/Profile';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get('photo');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'images');
    await mkdir(uploadDir, { recursive: true });

    // Save with unique filename
    const ext = file.name.split('.').pop();
    const filename = `profile-${Date.now()}.${ext}`;
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Update profile photo URL in DB
    await connectToDatabase();
    let profile = await Profile.findOne();
    const photoUrl = `/images/${filename}`;

    if (profile) {
      profile.photo = photoUrl;
      await profile.save();
    } else {
      profile = await Profile.create({ photo: photoUrl, name: 'Your Name', title: 'Your Title', bio: 'Your bio' });
    }

    return NextResponse.json({ photoUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
