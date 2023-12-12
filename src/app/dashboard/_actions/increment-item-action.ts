"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { updateItem, getItem } from "@/data-access/items";
import { State } from "./decrement-item-action";
import { incrementItemUseCase } from "@/use-cases/items/increment-item-use-case";

export async function incrementItemAction(
  state: State,
  formData: FormData
): Promise<State> {
  const { getUser } = await auth();

  const itemId = parseInt(formData.get("itemId") as string);

  const item = await incrementItemUseCase(
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
  return {
    showToast: item.quantity === 1,
  };
}
