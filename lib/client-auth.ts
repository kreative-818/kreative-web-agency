
import { cookies } from 'next/headers';
import { db } from './db';
import { clientPortalUsers } from './db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createClientPortalUser(data: {
  clientId: number;
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role?: string;
}) {
  const hashedPassword = await hashPassword(data.password);
  
  const [user] = await db.insert(clientPortalUsers).values({
    clientId: data.clientId,
    email: data.email,
    password: hashedPassword,
    fullName: data.fullName,
    phone: data.phone,
    role: data.role || 'client',
  }).returning();
  
  return user;
}

export async function authenticateClientPortalUser(email: string, password: string) {
  const [user] = await db
    .select()
    .from(clientPortalUsers)
    .where(eq(clientPortalUsers.email, email))
    .limit(1);
  
  if (!user) {
    return null;
  }
  
  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    return null;
  }
  
  // Update last login
  await db
    .update(clientPortalUsers)
    .set({ lastLoginAt: new Date() })
    .where(eq(clientPortalUsers.id, user.id));
  
  return user;
}

export async function getClientPortalSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('client_portal_session');
  
  if (!sessionCookie) {
    return null;
  }
  
  try {
    const sessionData = JSON.parse(sessionCookie.value);
    const [user] = await db
      .select()
      .from(clientPortalUsers)
      .where(eq(clientPortalUsers.id, sessionData.userId))
      .limit(1);
    
    return user || null;
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
}

export async function setClientPortalSession(userId: number, clientId: number) {
  const cookieStore = await cookies();
  const sessionData = JSON.stringify({ userId, clientId });
  
  cookieStore.set('client_portal_session', sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function clearClientPortalSession() {
  const cookieStore = await cookies();
  cookieStore.delete('client_portal_session');
}
