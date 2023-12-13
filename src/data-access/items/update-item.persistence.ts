import "server-only";

import { db } from "@/db";
import { items } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ItemDto } from "@/use-cases/items/types";

export async function updateItem(item: ItemDto): Promise<void> {
  await db.update(items).set(item).where(eq(items.id, item.id));
}
