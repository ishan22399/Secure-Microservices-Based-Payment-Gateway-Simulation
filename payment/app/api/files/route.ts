import { type NextRequest, NextResponse } from "next/server"

// Mock file storage
const files = [
  {
    id: "file_001",
    name: "transaction_report_2024_01.pdf",
    type: "application/pdf",
    size: 2048576,
    uploadedBy: "admin@demo.com",
    uploadedAt: "2024-01-10T10:30:00Z",
    category: "reports",
    url: "/api/files/file_001/download",
  },
  {
    id: "file_002",
    name: "merchant_agreement.pdf",
    type: "application/pdf",
    size: 1024000,
    uploadedBy: "merchant@demo.com",
    uploadedAt: "2024-01-09T15:45:00Z",
    category: "documents",
    url: "/api/files/file_002/download",
  },
  {
    id: "file_003",
    name: "compliance_certificate.pdf",
    type: "application/pdf",
    size: 512000,
    uploadedBy: "admin@demo.com",
    uploadedAt: "2024-01-08T09:15:00Z",
    category: "compliance",
    url: "/api/files/file_003/download",
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const userId = searchParams.get("userId")
  const limit = Number.parseInt(searchParams.get("limit") || "20")
  const offset = Number.parseInt(searchParams.get("offset") || "0")

  try {
    let filteredFiles = [...files]

    if (category) {
      filteredFiles = filteredFiles.filter((file) => file.category === category)
    }

    if (userId) {
      filteredFiles = filteredFiles.filter((file) => file.uploadedBy === userId)
    }

    // Sort by upload date (newest first)
    filteredFiles.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())

    const paginatedFiles = filteredFiles.slice(offset, offset + limit)

    return NextResponse.json({
      files: paginatedFiles,
      total: filteredFiles.length,
      hasMore: offset + limit < filteredFiles.length,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const category = formData.get("category") as string
    const uploadedBy = formData.get("uploadedBy") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "File type not allowed" }, { status: 400 })
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File size too large (max 10MB)" }, { status: 400 })
    }

    // Create file record
    const newFile = {
      id: `file_${Date.now()}`,
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedBy,
      uploadedAt: new Date().toISOString(),
      category: category || "general",
      url: `/api/files/file_${Date.now()}/download`,
    }

    // In a real app, save file to storage (S3, etc.)
    console.log("File uploaded:", newFile)

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      file: newFile,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get("fileId")

    if (!fileId) {
      return NextResponse.json({ error: "File ID required" }, { status: 400 })
    }

    // In a real app, delete from storage and database
    console.log("File deleted:", fileId)

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
}
