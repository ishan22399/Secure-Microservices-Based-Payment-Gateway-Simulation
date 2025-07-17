import { type NextRequest, NextResponse } from "next/server"

// Ensure BACKEND_BASE_URL is always a valid URL string
const BACKEND_BASE_URL = (process.env.BACKEND_BASE_URL || "http://localhost:8081").replace(/\/+$/, "")

export async function GET(request: NextRequest, { params }: { params: { slug: string[] } }) {
  return proxyRequest(request, params.slug)
}

export async function POST(request: NextRequest, { params }: { params: { slug: string[] } }) {
  return proxyRequest(request, params.slug)
}

export async function PUT(request: NextRequest, { params }: { params: { slug: string[] } }) {
  return proxyRequest(request, params.slug)
}

export async function DELETE(request: NextRequest, { params }: { params: { slug: string[] } }) {
  return proxyRequest(request, params.slug)
}

export async function PATCH(request: NextRequest, { params: paramsPromise }: { params: Promise<{ slug: string[] }> }) {
  const params = await paramsPromise;
  return proxyRequest(request, params.slug)
}

async function proxyRequest(request: NextRequest, slug: string[]) {
  const path = slug.join("/")
  const url = new URL(path, BACKEND_BASE_URL) // BACKEND_BASE_URL is now guaranteed to be valid

  // Append query parameters from the incoming request
  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.append(key, value)
  })

  const headers = new Headers(request.headers)
  // Remove headers that might cause issues or are handled by the proxy
  headers.delete("host")
  headers.delete("content-length") // Let fetch calculate this

  // Read body only for methods that support it
  let body: ArrayBuffer | undefined = undefined
  if (!["GET", "HEAD"].includes(request.method)) {
    body = await request.arrayBuffer()
  }

  try {
    const init: RequestInit = {
      method: request.method,
      headers,
      redirect: "manual",
    }
    if (body && body.byteLength > 0) {
      // Only attach body if it's not empty
      init.body = body as any
    }

    const backendResponse = await fetch(url.toString(), init)

    // Reconstruct the response to send back to the client
    const responseHeaders = new Headers(backendResponse.headers)
    // Remove any headers that might conflict or are not needed on the client side
    responseHeaders.delete("transfer-encoding")
    responseHeaders.delete("content-length") // Let Next.js calculate this

    // Handle redirects manually if needed, though `redirect: 'manual'` will return an opaque response
    // For 3xx responses, you might want to extract the Location header and redirect the client
    if (backendResponse.status >= 300 && backendResponse.status < 400) {
      const location = backendResponse.headers.get("Location")
      if (location) {
        return NextResponse.redirect(location, backendResponse.status)
      }
    }

    return new NextResponse(backendResponse.body, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: responseHeaders,
    })
  } catch (error) {
    console.error("Proxy request failed:", error)
    // Return a proper error response if the fetch to backend fails
    return NextResponse.json({ error: "Failed to connect to backend" }, { status: 500 })
  }
}
