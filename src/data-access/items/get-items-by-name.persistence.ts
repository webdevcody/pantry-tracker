import "server-only";

import { db } from "@/db";
import { Item, items } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { ItemDto, toDtoMapper } from "./get-item.persistence";

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
