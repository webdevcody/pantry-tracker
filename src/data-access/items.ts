import "server-only";

import { db } from "@/db";
import { items } from "@/db/schema";
import { eq } from "drizzle-orm";

export type ItemDto = {
  id: number;
  name: string;
  quantity: number;
};

export type CreateItemDto = {
  name: string;
  userId: string;
  quantity: number;
};

export type ItemId = number;

export async function getItems(): Promise<ItemDto[]> {
  const items = await db.query.items.findMany();

  return items.map((item) => ({
    id: item.id,
    name: item.name,
    quantity: item.quantity,
  }));
}

export async function createItem(item: CreateItemDto): Promise<void> {
  await db.insert(items).values(item);
}

export async function deleteItem(itemId: ItemId): Promise<void> {
  await db.delete(items).where(eq(items.id, itemId));
}
