
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const base = process.env.STUDIO_API_URL;
  
  if (!base) {
    return new Response(
      JSON.stringify({ 
        ok: false, 
        error: "STUDIO_API_URL not configured" 
      }), 
      { 
        status: 503,
        headers: { 'content-type': 'application/json' }
      }
    );
  }
  
  const payload = await req.json().catch(() => ({}));
  
  const r = await fetch(`${base}/build`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  const text = await r.text();
  
  return new Response(text, { 
    status: r.status, 
    headers: { 'content-type': 'application/json' }
  });
}
