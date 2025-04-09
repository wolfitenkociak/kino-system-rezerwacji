import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Create a response first
    const response = NextResponse.json({ message: "Logged out successfully" });
    
    // Then delete the cookie on the response
    response.cookies.delete('session_id');
    
    return response;
  } catch (error) {
    console.error("[AUTH_LOGOUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 