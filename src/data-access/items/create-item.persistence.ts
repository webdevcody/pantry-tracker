import "server-only";

import { db } from "@/db";
import { items } from "@/db/schema";

export type CreateItemDto = {
  name: string;
  userId: string;
  quantity: number;
};

export async function createItem(item: CreateItemDto): Promise<void> {
  await db.insert(items).values(item);
}
