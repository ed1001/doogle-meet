import { db } from "@/db/db";
import { RoomsTable } from "@/db/schema";

export async function GET() {
  const dbRes = await db.select().from(RoomsTable);

  return Response.json({ dbRes });
}
