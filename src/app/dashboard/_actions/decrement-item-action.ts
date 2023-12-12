"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { updateItem, getItem, deleteItem } from "@/data-access/items";
import { decrementItemUseCase } from "@/use-cases/items/decrement-item-use-case";

export type State = {
  showToast: boolean;
};

export async function decrementItemAction(
  state: State,
  formData: FormData
): Promise<State> {
  const { getUser } = await auth();

  const itemId = parseInt(formData.get("itemId") as string);

  const item = await decrementItemUseCase(
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
  return {
    showToast: item.quantity === 0,
  };
}
