import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
});
