import { db } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    //Get spin by id
    const spin = await db.spin.findFirst({
      where: {
        id: params.spinwheelId,
      },
    });

    //Check if spin is found
    if (!spin) {
      return new NextResponse("Data User Not Found", { status: 404 });
    }

    //Return spin to client
    return NextResponse.json(spin, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error", {
      status: error.status || 500,
    });
  }
}

export async function PATCH(request, { params }) {
  try {
    //Get Spin by id
    const spin = await db.spin.findFirst({
      where: {
        id: params.spinwheelId,
      },
    });

    //Check if Spin is found
    if (!spin) {
      return new NextResponse("Data User Not Found", { status: 404 });
    }

    //Get name Spin from body
    const { name, prize } = await request.json();

    //Update spin
    const updateSpin = await db.spin.update({
      where: {
        id: params.spinwheelId,
      },
      data: {
        name: name,
        prize: prize,
      },
    });

    //Return spin to client
    return NextResponse.json(updateSpin, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error", {
      status: error.status || 500,
    });
  }
}
