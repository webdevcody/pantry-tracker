import { ZodError, z } from "zod";

export class ItemEntityValidationError extends Error {
  private errors: Record<"name" | "userId", string | undefined>;

  constructor(errors: Record<"name" | "userId", string | undefined>) {
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
  private userId: string;

  constructor({
    id,
    name,
    userId,
  }: {
    id?: number;
    name: string;
    userId: string;
  }) {
    this.id = id;
    this.name = name;
    this.userId = userId;
  }

  getName() {
    return this.name;
  }

  getUserId() {
    return this.userId;
  }

  getId() {
    return this.id;
  }

  validate() {
    const itemSchema = z.object({
      name: z.string().min(1),
      userId: z.string().min(1),
    });

    try {
      itemSchema.parse(this);
    } catch (err) {
      const error = err as ZodError;
      const errors = error.flatten().fieldErrors;
      throw new ItemEntityValidationError({
        name: errors.name?.[0],
        userId: errors.userId?.[0],
      });
    }
  }
}
