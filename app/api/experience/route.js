import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Experience from '@/models/Experience';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const experienceLog = await Experience.find().sort({ startDate: -1 });
    return NextResponse.json(experienceLog);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    const data = await req.json();
    const experience = await Experience.create(data);
    return NextResponse.json(experience, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
