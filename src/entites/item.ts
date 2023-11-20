import { ZodError, z } from "zod";

type ValidatedFields = "name" | "userId" | "quantity";

export class ItemEntityValidationError extends Error {
  private errors: Record<ValidatedFields, string | undefined>;

  constructor(errors: Record<ValidatedFields, string | undefined>) {
    super("An error occured validating an item entity");
    this.errors = errors;
  }

  getErrors() {
    return this.errors;
  }
}

export class ItemEntity {
  private id?: number;
  private name: string;
  private quantity: number;
  private userId: string;

  constructor({
    id,
    name,
    userId,
    quantity,
  }: {
    id?: number;
    name: string;
    userId: string;
    quantity: number;
  }) {
    this.id = id;
    this.name = name;
    this.userId = userId;
    this.quantity = quantity;
  }

  getName() {
    return this.name;
  }

  getQuantity() {
    return this.quantity;
  }

  getUserId() {
    return this.userId;
  }

  getId() {
    return this.id;
  }

  validate() {
    const itemSchema = z.object({
      name: z
        .string()
        .regex(/^[a-z]+$/)
        .min(1),
      userId: z.string().min(1),
      quantity: z.number().min(1),
    });

    try {
      itemSchema.parse(this);
    } catch (err) {
      const error = err as ZodError;
      const errors = error.flatten().fieldErrors;
      throw new ItemEntityValidationError({
        name: errors.name?.[0],
        userId: errors.userId?.[0],
        quantity: errors.quantity?.[0],
      });
    }
  }
}
