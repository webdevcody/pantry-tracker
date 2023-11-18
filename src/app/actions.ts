"use server";

import { createItem, deleteItem } from "@/data-access/items";
import { ItemEntityValidationError } from "@/entites/item";
import { auth } from "@/lib/auth";
import { ValidationError, createItemUseCase } from "@/use-cases/items";
import { revalidatePath } from "next/cache";

type CreateItemState = {
  errors: Partial<{ name: string }>;
  form: { name: string };
  error?: string;
  status: "pending" | "success" | "errors" | "field-errors";
};

export async function createItemAction(
  state: CreateItemState,
  formData: FormData
): Promise<CreateItemState> {
  "use server";

  const session = await auth();

  try {
    await createItemUseCase(
      {
        getUser: () => session?.user && { userId: session.user.id },
        createItem,
      },
      { name: formData.get("name") as string }
    );
    revalidatePath("/");
    return {
      errors: {},
      form: {
        name: "",
      },
      status: "success",
    };
  } catch (err) {
    const error = err as Error;
    if (error instanceof ValidationError) {
      return {
        form: {
          name: formData.get("name") as string,
        },
        status: "field-errors",
        errors: {
          name: error.getErrors().name,
        },
      };
    } else {
      return {
        form: {
          name: formData.get("name") as string,
        },
        status: "errors",
        error: error.message,
        errors: {},
      };
    }
  }
}

export async function deleteItemAction(itemId: number) {
  "use server";
  await deleteItem(itemId);
  revalidatePath("/");
}
