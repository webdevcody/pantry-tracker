"use server";

import { deleteItem } from "@/data-access/items";
import { auth } from "@/lib/auth";
import { deleteItemUseCase } from "@/use-cases/items";
import { revalidatePath } from "next/cache";

export async function deleteItemAction(itemId: number) {
  const { getUser } = await auth();

  await deleteItemUseCase(
    {
      deleteItem,
      getUser,
    },
    { itemId }
  );
  revalidatePath("/dashboard");
}
