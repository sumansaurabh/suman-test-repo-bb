import { NextResponse } from 'next/server';
import { getUserBalance } from '@/lib/mock-db';

export async function GET() {
    // In a real app, you'd get the userId from the session/auth token
    const userId = 'user_123'; 
    const balance = await getUserBalance(userId);
    return NextResponse.json({ balance });
}
