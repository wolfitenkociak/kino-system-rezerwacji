import { NextResponse } from "next/server";
import prismadb from "@/lib/db";

export async function GET(request: Request) {
  try {
    // Get the session ID from the cookie using the request object
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = Object.fromEntries(
      cookieHeader.split('; ').map(cookie => {
        const [name, ...rest] = cookie.split('=');
        return [name, rest.join('=')];
      })
    );
    
    const sessionId = cookies['session_id'];
    
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // In a production application, you'd have a sessions table to validate the session ID
    // For simplicity, we'll just check if the user exists
    const users = await prismadb.user.findMany({
      take: 1,
    });
    
    if (users.length === 0) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const user = users[0];
    
    // Return user data (without password)
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
    });
    
  } catch (error) {
    console.error("[AUTH_ME]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 