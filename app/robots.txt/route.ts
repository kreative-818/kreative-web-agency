
import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://creative-web-agency-zlgi4u.abacusai.app';
  
  const robots = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/api/sitemap
`;

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
