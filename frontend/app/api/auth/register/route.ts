import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role, companyName } = await request.json()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role: role,
          company_name: companyName
        }
      }
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Insert into profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user?.id,
        full_name: name,
        role: role,
        company_name: companyName,
      })

    if (profileError) {
      console.error("Error creating profile:", profileError)
      // Optionally, handle rollback of user creation if profile creation fails
      return NextResponse.json({ error: "Failed to create user profile" }, { status: 500 })
    }

    const user = {
      ...data.user,
      full_name: name,
      role: role,
      company_name: companyName,
      permissions: ['read', 'write'], // Example permissions, adjust as needed
    }

    return NextResponse.json({ user, token: data.session?.access_token })
  } catch (error) {
    console.error("Register API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
