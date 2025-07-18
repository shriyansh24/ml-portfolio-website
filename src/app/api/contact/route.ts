import { NextRequest, NextResponse } from "next/server";

// Define the expected request body structure
interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body: ContactFormData = await request.json();
    
    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { message: "Name, email, and message are required fields" },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { message: "Please provide a valid email address" },
        { status: 400 }
      );
    }
    
    // In a real application, you would send an email here
    // For example, using a service like SendGrid, AWS SES, or Nodemailer
    
    // For now, we'll simulate a successful email sending
    console.log("Contact form submission:", {
      name: body.name,
      email: body.email,
      message: body.message,
    });
    
    // Return success response
    return NextResponse.json(
      { message: "Message sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing contact form submission:", error);
    
    // Return error response
    return NextResponse.json(
      { message: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}