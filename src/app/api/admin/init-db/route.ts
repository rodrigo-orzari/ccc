import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth, initDb } from '@/lib/api-utils';

export async function POST(req: NextRequest) {
  const authResponse = requireAdminAuth(req);
  if (authResponse) return authResponse;

  const success = await initDb();
  if (success) {
    return NextResponse.json({ message: 'Database initialized successfully.' });
  } else {
    return NextResponse.json({ error: 'Failed to initialize database.' }, { status: 500 });
  }
}
