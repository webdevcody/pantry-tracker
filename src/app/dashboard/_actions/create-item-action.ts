"use server";

import { createItem, getUserItemByName } from "@/data-access/items";
import { auth } from "@/lib/auth";
import { ValidationError, createItemUseCase } from "@/use-cases/items";
import { revalidatePath } from "next/cache";

type Form = {
  name: string;
  quantity: string;
};

type CreateItemState = { form: Form } & (
  | {
      status: "success";
    }
  | {
      status: "error";
      errors: string;
    }
  | {
      status: "field-errors";
      errors: Partial<Record<keyof Form, string>>;
    }
  | {
      status: "default";
    }
);

export async function createItemAction(
  state: CreateItemState,
  formData: FormData
): Promise<CreateItemState> {
  const { getUser } = await auth();

  const submittedForm = {
    name: formData.get("name") as string,
    quantity: formData.get("quantity") as string,
  };

  try {
    await createItemUseCase(
      {
        getUser,
        createItem,
        getUserItemByName,
      },
      {
        name: submittedForm.name.toLowerCase(),
        quantity: parseInt(submittedForm.quantity),
      }
    );
    revalidatePath("/");
    return {
      form: {
        name: "",
        quantity: "1",
      },
      status: "success",
    };
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
