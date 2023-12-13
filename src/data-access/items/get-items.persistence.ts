import "server-only";

import { db } from "@/db";
import { ItemDto, toDtoMapper } from "./get-item.persistence";

export async function getItems(): Promise<ItemDto[]> {
  const items = await db.query.items.findMany();

  return items.map(toDtoMapper);
}
