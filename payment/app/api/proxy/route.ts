import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8081';

export async function GET(request: NextRequest) {
  const { pathname, searchParams } = new URL(request.url);
  const path = pathname.replace('/api/proxy', '');
  const url = `${BACKEND_URL}${path}?${searchParams.toString()}`;

  try {
    const response = await fetch(url, {
      headers: request.headers,
    });

    const headers = new Headers(response.headers);
    // Remove 'Set-Cookie' header if it's present, as Next.js handles cookies differently
    headers.delete('Set-Cookie');

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: headers,
    });
  } catch (error: any) {
    console.error('Proxy GET request failed:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { pathname, searchParams } = new URL(request.url);
  const path = pathname.replace('/api/proxy', '');
  const url = `${BACKEND_URL}${path}?${searchParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: request.headers,
      body: request.body,
    });

    const headers = new Headers(response.headers);
    headers.delete('Set-Cookie');

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: headers,
    });
  } catch (error: any) {
    console.error('Proxy POST request failed:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const { pathname, searchParams } = new URL(request.url);
  const path = pathname.replace('/api/proxy', '');
  const url = `${BACKEND_URL}${path}?${searchParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: request.headers,
      body: request.body,
    });

    const headers = new Headers(response.headers);
    headers.delete('Set-Cookie');

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: headers,
    });
  } catch (error: any) {
    console.error('Proxy PUT request failed:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { pathname, searchParams } = new URL(request.url);
  const path = pathname.replace('/api/proxy', '');
  const url = `${BACKEND_URL}${path}?${searchParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: request.headers,
    });

    const headers = new Headers(response.headers);
    headers.delete('Set-Cookie');

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: headers,
    });
  } catch (error: any) {
    console.error('Proxy DELETE request failed:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const { pathname, searchParams } = new URL(request.url);
  const path = pathname.replace('/api/proxy', '');
  const url = `${BACKEND_URL}${path}?${searchParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: request.headers,
      body: request.body,
    });

    const headers = new Headers(response.headers);
    headers.delete('Set-Cookie');

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: headers,
    });
  } catch (error: any) {
    console.error('Proxy PATCH request failed:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function OPTIONS(request: NextRequest) {
  const { pathname, searchParams } = new URL(request.url);
  const path = pathname.replace('/api/proxy', '');
  const url = `${BACKEND_URL}${path}?${searchParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'OPTIONS',
      headers: request.headers,
    });

    const headers = new Headers(response.headers);
    headers.delete('Set-Cookie');

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: headers,
    });
  } catch (error: any) {
    console.error('Proxy OPTIONS request failed:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
