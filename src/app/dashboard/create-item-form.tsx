"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState, useFormStatus } from "react-dom";
import { HTMLAttributes, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { createItemAction } from "./_actions/create-item.action";
import { cn } from "@/lib/utils";

export function CreateItemForm() {
  const { toast } = useToast();
  const [formState, onCreateItemAction] = useFormState(createItemAction, {
    form: {
      name: "",
      quantity: "1",
    },
    status: "default",
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
    <>
      <h2 className="text-3xl mb-8">Add Entry</h2>
      {formState.status === "error" && (
        <Alert variant={"destructive"}>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Uh oh!</AlertTitle>
          <AlertDescription>{formState.errors}</AlertDescription>
        </Alert>
      )}
      <form
        ref={formRef}
        action={onCreateItemAction}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-"></div>
        <Label htmlFor="item-name">Item Name</Label>
        <Input
          data-testid="item-name"
          defaultValue={formState.form.name}
          name="name"
          id="item-name"
          autoFocus
          hasError={
            formState.status === "field-errors" && !!formState.errors.name
          }
        ></Input>
        {formState.status === "field-errors" && (
          <Error error={formState.errors.name} />
        )}

        <Label htmlFor="quantity">Quantity</Label>
        <Input
          data-testid="quantity"
          defaultValue={formState.form.quantity}
          name="quantity"
          type="number"
          id="quantity"
          autoFocus
        ></Input>
        {formState.status === "field-errors" && (
          <Error error={formState.errors.quantity} />
        )}

        <SubmitButton idleText="Add Item" submittingText="Adding Item..." />
      </form>
    </>
  );
}

function Error({ error }: { error?: string }) {
  return error ? <span className="text-red-400">{error}</span> : null;
}

function SubmitButton({
  idleText,
  submittingText,
  ...props
}: HTMLAttributes<HTMLButtonElement> & {
  idleText: string;
  submittingText: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      {...props}
      className={cn(
        "disabled:bg-gray-400 disabled:cursor-default",
        props.className
      )}
      disabled={pending}
    >
      {pending ? submittingText : idleText}
    </Button>
  );
}
