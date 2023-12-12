"use server";

import { getItem, updateItem } from "@/data-access/items";
import { auth } from "@/lib/auth";
import { markAsLowUseCase } from "@/use-cases/items/mark-as-low-use-case";
import { revalidatePath } from "next/cache";

export type MarkLowState = {
  showToast: boolean;
};

export async function markAsLowAction(state: MarkLowState, formData: FormData) {
  const { getUser } = await auth();

  const itemId = parseInt(formData.get("itemId") as string);

  await markAsLowUseCase(
    {
      updateItem,
      getUser,
      getItem,
    },
    { itemId }
  );
  revalidatePath("/dashboard");
  return {
    showToast: true,
  };
}
