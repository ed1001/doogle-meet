import { db } from "@/lib/db";
import { RoomsTable } from "@/lib/schema";

export async function GET() {
  const dbRes = await db.select().from(RoomsTable);

  return Response.json({ dbRes });
}
