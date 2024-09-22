import { db } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { name, prize } = await request.json();

    // Insert new data to spins
    const spin = await db.spin.create({
      data: {
        name: name,
        prize: prize,
      },
    });

    // Return to client
    return NextResponse.json(
      {
        data: spin,
        success: true,
        message: "Spin has been created",
      },
      {
        status: 201,
      }
    );
  } catch (err) {
    console.log(err);
    if (err) {
      console.log("Error Route Spin : ", err);
      return new NextResponse("Internal Server Error", {
        status: 500,
      });
    }
  }
}

export async function GET(request) {
  try {
    // Get all spins
    const spins = await db.spin.findMany();

    return NextResponse.json({
      data: spins,
      success: true,
      message: "Get all categories",
    });
  } catch (err) {
    console.log(err);
    return new NextResponse(err?.message || "Internal Server Error", {
      status: 500,
    });
  }
}
