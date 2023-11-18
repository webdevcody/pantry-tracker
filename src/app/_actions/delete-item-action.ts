"use server";

import { deleteItem } from "@/data-access/items";
import { revalidatePath } from "next/cache";

export async function deleteItemAction(itemId: number) {
  await deleteItem(itemId);
  revalidatePath("/");
}
