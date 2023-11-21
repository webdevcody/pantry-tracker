"use server";

import { auth } from "@/lib/auth";
import { decrementItemUseCase } from "@/use-cases/items";
import { revalidatePath } from "next/cache";
import { updateItem, getItem, deleteItem } from "@/data-access/items";

export async function decrementItemAction(itemId: number) {
  const { getUser } = await auth();

  await decrementItemUseCase(
    {
      getUser,
      updateItem,
      getItem,
      deleteItem,
    },
    {
      itemId,
    }
  );

  revalidatePath("/dashboard");
}
