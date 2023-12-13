import "server-only";

import { db } from "@/db";
import { Item, items } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ItemDto } from "@/use-cases/items/types";

export type ItemId = number;

export function toDtoMapper(item: Item) {
  return {
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    userId: item.userId,
    isLow: item.isLow,
  };
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
