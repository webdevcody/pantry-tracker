"use server";

import { createItem } from "@/data-access/items/create-item.persistence";
import { getUserItemByName } from "@/data-access/items/get-items-by-name.persistence";
import { updateItem } from "@/data-access/items/update-item.persistence";
import { auth } from "@/lib/auth";
import { createItemUseCase } from "@/use-cases/items/create-item.use-case";
import { ValidationError } from "@/use-cases/items/utils";
import { revalidatePath } from "next/cache";

type Form = {
  name: string;
  quantity: string;
};

type FieldErrorsState = {
  status: "field-errors";
  errors: Partial<Record<keyof Form, string>>;
};

type DefaultState = {
  status: "default";
};

type SubmitErrorState = {
  status: "error";
  errors: string;
};

type SuccessState = {
  status: "success";
};

type CreateItemState = { form: Form } & (
  | SuccessState
  | SubmitErrorState
  | FieldErrorsState
  | DefaultState
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
        createItem: createItem,
        updateItem: updateItem,
        getUserItemByName: getUserItemByName,
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
