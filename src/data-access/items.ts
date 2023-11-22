import "server-only";

import { db } from "@/db";
import { Item, items } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export type ItemDto = {
  id: number;
  name: string;
  quantity: number;
  userId: string;
  isLow: boolean;
};

export type CreateItemDto = {
  name: string;
  userId: string;
  quantity: number;
};

export type ItemId = number;

function toDtoMapper(item: Item) {
  return {
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    userId: item.userId,
    isLow: item.isLow,
  };
}

export async function getItems(): Promise<ItemDto[]> {
  const items = await db.query.items.findMany();

  return items.map(toDtoMapper);
}

export async function createItem(item: CreateItemDto): Promise<void> {
  await db.insert(items).values(item);
}

export async function deleteItem(itemId: ItemId): Promise<void> {
  await db.delete(items).where(eq(items.id, itemId));
}

export async function updateItem(item: ItemDto): Promise<void> {
  await db.update(items).set(item).where(eq(items.id, item.id));
}

export async function getItem(itemId: number): Promise<ItemDto> {
  const foundItem = await db.query.items.findFirst({
    where: eq(items.id, itemId),
  });

  if (!foundItem) {
    throw new Error("could not find item");
  }

  return toDtoMapper(foundItem);
}

export async function getUserItemByName(
  userId: string,
  name: string
): Promise<ItemDto | undefined> {
  const foundItem = await db.query.items.findFirst({
    where: and(eq(items.userId, userId), eq(items.name, name)),
  });

  if (!foundItem) {
    return undefined;
  }

  return toDtoMapper(foundItem);
}
