"use server";

import { auth } from "@/lib/auth";
import { incrementItemUseCase } from "@/use-cases/items";
import { revalidatePath } from "next/cache";
import { updateItem, getItem } from "@/data-access/items";

export async function incrementItemAction(itemId: number) {
  const { getUser } = await auth();

  await incrementItemUseCase(
    {
      getUser,
      updateItem,
      getItem,
    },
    {
      itemId,
    }
  );

  revalidatePath("/dashboard");
}
