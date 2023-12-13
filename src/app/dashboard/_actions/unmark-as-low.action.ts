"use server";

import { getItem } from "@/data-access/items/get-item.persistence";
import { updateItem } from "@/data-access/items/update-item.persistence";
import { auth } from "@/lib/auth";
import { unmarkAsLowUseCase } from "@/use-cases/items/unmark-as-low.use-case";
import { revalidatePath } from "next/cache";

export type MarkLowState = {
  showToast: boolean;
};

export async function unmarkAsLowAction(
  state: MarkLowState,
  formData: FormData
) {
  const { getUser } = await auth();

  const itemId = parseInt(formData.get("itemId") as string);

  await unmarkAsLowUseCase(
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
