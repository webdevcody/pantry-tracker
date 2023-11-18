"use server";

import { createItem, deleteItem } from "@/data-access/items";
import { auth } from "@/lib/auth";
import { ValidationError, createItemUseCase } from "@/use-cases/items";
import { revalidatePath } from "next/cache";

type CreateItemState = { form: { name: string } } & (
  | {
      status: "success";
    }
  | {
      status: "error";
      errors: string;
    }
  | {
      status: "field-errors";
      errors: Partial<{ name: string }>;
    }
  | {
      status: "default";
    }
);

async function handleFieldValidation(
  submittedForm: any,
  callback: () => Promise<any>
) {
  try {
    return await callback();
  } catch (err) {
    const error = err as Error;
    if (error instanceof ValidationError) {
      return {
        form: submittedForm,
        status: "field-errors",
        errors: error.getErrors(),
      };
    } else {
      return {
        form: submittedForm,
        status: "error",
        errors: error.message,
      };
    }
  }
}

export async function createItemAction(
  state: CreateItemState,
  formData: FormData
): Promise<CreateItemState> {
  const session = await auth();

  return handleFieldValidation(formData.entries(), async () => {
    await createItemUseCase(
      {
        getUser: () => session?.user && { userId: session.user.id },
        createItem,
      },
      { name: formData.get("name") as string }
    );
    revalidatePath("/");
    return {
      form: {
        name: "",
      },
      status: "success",
    };
  });
}

export async function deleteItemAction(itemId: number) {
  "use server";
  await deleteItem(itemId);
  revalidatePath("/");
}
