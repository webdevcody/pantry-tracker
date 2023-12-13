"use server";

import { deleteItem } from "@/data-access/items/delete-item.persistence";
import { auth } from "@/lib/auth";
import { deleteItemUseCase } from "@/use-cases/items/delete-item.use-case";
import { revalidatePath } from "next/cache";

export type DeleteFormState = {
  showToast: boolean;
};

export async function deleteItemAction(
  state: DeleteFormState,
  formData: FormData
) {
  const { getUser } = await auth();

  const itemId = parseInt(formData.get("itemId") as string);

  await deleteItemUseCase(
    {
      deleteItem,
      getUser,
    },
    { itemId }
  );
  revalidatePath("/dashboard");
  return {
    showToast: true,
  };
}
