import { ItemDto, CreateItemDto } from "@/data-access/items";
import { ItemEntity, ItemEntityValidationError } from "@/entites/item";

type User = {
  userId: string;
};

export class ValidationError extends Error {
  private errors: Record<string, string | undefined>;

  constructor(errors: Record<string, string | undefined>) {
    super("An validation error occured");
    this.errors = errors;
  }

  getErrors() {
    return this.errors;
  }
}

export class AuthenticationdError extends Error {
  constructor() {
    super("You must be authenticated to do this action");
  }
}

export type CreateItem = (item: CreateItemDto) => void;
export type GetUser = () => User | undefined;

export async function createItemUseCase(
  context: { getUser: GetUser; createItem: CreateItem },
  data: { name: string }
) {
  const user = context.getUser();

  if (!user) {
    throw new AuthenticationdError();
  }

  const item = new ItemEntity({
    name: data.name,
    userId: user.userId,
  });

  try {
    item.validate();
  } catch (err) {
    const error = err as ItemEntityValidationError;
    throw new ValidationError(error.getErrors());
  }

  await context.createItem({
    name: item.getName(),
    userId: item.getUserId(),
  });
}
