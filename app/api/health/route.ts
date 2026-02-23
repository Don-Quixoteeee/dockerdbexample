import { NextResponse } from "next/server";

export async function GET() {
	// Simple liveness endpoint; extend with DB checks if needed.
	return NextResponse.json({ status: "ok", uptime: process.uptime() }, { status: 200 });
}
