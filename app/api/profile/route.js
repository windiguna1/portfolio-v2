import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Profile from '@/models/Profile';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const profile = await Profile.findOne();
    return NextResponse.json(profile || {});
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
    
    // We only want ONE profile in the DB for the portfolio
    let profile = await Profile.findOne();
    if (profile) {
      profile.set(data);
      await profile.save();
    } else {
      profile = await Profile.create(data);
    }
    
    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
