"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createItemAction } from "./actions";
import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";

export function CreateItemForm() {
  const { toast } = useToast();
  const [formState, onCreateItemAction] = useFormState(createItemAction, {
    form: {
      name: "",
    },
    status: "pending",
    errors: {
      name: "",
    },
  });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formState.status === "success") {
      toast({
        title: "Item Added",
        description: "Your pantry item has been added",
      });
      formRef.current?.reset();
    }
  }, [toast, formState]);

  return (
    <form
      ref={formRef}
      action={onCreateItemAction}
      className="flex flex-col gap-4"
    >
      <Label htmlFor="item-name"></Label>
      <Input
        data-testid="item-name"
        defaultValue={formState.form.name}
        name="name"
        id="item-name"
        autoFocus
      ></Input>
      <Error error={formState.errors.name} />

      <SubmitButton />
    </form>
  );
}

function Error({ error }: { error?: string }) {
  return error ? <span className="text-red-400">{error}</span> : null;
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      data-testid="create-item"
      className="disabled:bg-gray-400 disabled:cursor-default"
      disabled={pending}
    >
      {pending ? "Adding Item..." : "Add Item"}
    </Button>
  );
}
