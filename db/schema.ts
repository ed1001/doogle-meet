import { pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const RoomsTable = pgTable("rooms", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Room = InferSelectModel<typeof RoomsTable>;
export type NewRoom = InferInsertModel<typeof RoomsTable>;
