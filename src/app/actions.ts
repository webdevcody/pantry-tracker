"use server";

import { createItem, deleteItem } from "@/data-access/items";
import { revalidatePath } from "next/cache";
import { ZodError, z } from "zod";

type CreateItemState = {
  errors: Partial<{ name: string }>;
  form: { name: string };
  status: "pending" | "success" | "errors";
};

export async function createItemAction(
  state: CreateItemState,
  formData: FormData
): Promise<CreateItemState> {
  "use server";

  const itemSchema = z.object({
    name: z.string().min(1),
  });

  const submittedForm = {
    name: formData.get("name") as string,
  };

  try {
    const itemToCreate = itemSchema.parse(submittedForm);
    await createItem(itemToCreate.name);
    revalidatePath("/");
    return {
      errors: {},
      form: {
        name: "",
      },
      status: "success",
    };
  } catch (err) {
    const error = err as ZodError;
    const errors = error.flatten().fieldErrors;
    return {
      form: {
        name: formData.get("name") as string,
      },
      status: "errors",
      errors: {
        name: errors.name?.[0],
      },
    };
  }
}

export async function deleteItemAction(itemId: number) {
  "use server";
  await deleteItem(itemId);
  revalidatePath("/");
}
