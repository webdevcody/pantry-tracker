import "server-only";

import { db } from "@/db";
import { toDtoMapper } from "./get-item.persistence";
import { ItemDto } from "@/use-cases/items/types";

export async function getItems(): Promise<ItemDto[]> {
  const items = await db.query.items.findMany();

  return items.map(toDtoMapper);
}
