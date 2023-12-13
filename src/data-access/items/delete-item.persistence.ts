import "server-only";

import { db } from "@/db";
import { items } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ItemId } from "./get-item.persistence";

export async function deleteItem(itemId: ItemId): Promise<void> {
  await db.delete(items).where(eq(items.id, itemId));
}
