import { CreateItemDto, ItemDto, updateItem } from "@/data-access/items";
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

export class AuthenticationError extends Error {
  constructor() {
    super("You must be authenticated to do this action");
  }
}

export type CreateItem = (item: CreateItemDto) => void;
export type DeleteItem = (itemId: number) => void;
export type UpdateItem = (item: ItemDto) => void;
export type GetUser = () => User | undefined;
export type GetItem = (itemId: number) => Promise<ItemDto>;
export type GetUserItemByName = (
  userId: string,
  name: string
) => Promise<ItemDto | undefined>;

function itemToCreateItemDtoMapper(item: ItemEntity): CreateItemDto {
  return {
    name: item.getName(),
    userId: item.getUserId(),
    quantity: item.getQuantity(),
  };
}

function toItemDtoMapper(item: ItemEntity): ItemDto {
  const itemId = item.getId();

  if (!itemId) {
    throw new Error("expected item to have an id");
  }

  return {
    id: itemId,
    name: item.getName(),
    userId: item.getUserId(),
    quantity: item.getQuantity(),
  };
}

export async function createItemUseCase(
  context: {
    getUser: GetUser;
    createItem: CreateItem;
    getUserItemByName: GetUserItemByName;
  },
  data: { name: string; quantity: number }
) {
  const user = context.getUser();

  if (!user) {
    throw new AuthenticationError();
  }

  const existingItem = await context.getUserItemByName(user.userId, data.name);

  if (existingItem) {
    const updatedItem = new ItemEntity({
      ...existingItem,
      quantity: existingItem.quantity + data.quantity,
    });
    await updateItem(toItemDtoMapper(updatedItem));
    return;
  }

  const newItem = new ItemEntity({
    quantity: data.quantity,
    name: data.name,
    userId: user.userId,
  });

  try {
    newItem.validate();
  } catch (err) {
    const error = err as ItemEntityValidationError;
    throw new ValidationError(error.getErrors());
  }

  await context.createItem(itemToCreateItemDtoMapper(newItem));
}

export async function deleteItemUseCase(
  context: { getUser: GetUser; deleteItem: DeleteItem },
  data: { itemId: number }
) {
  const user = context.getUser();

  if (!user) {
    throw new AuthenticationError();
  }

  await context.deleteItem(data.itemId);
}

export async function incrementItemUseCase(
  context: { getUser: GetUser; updateItem: UpdateItem; getItem: GetItem },
  data: { itemId: number }
) {
  const user = context.getUser();

  if (!user) {
    throw new AuthenticationError();
  }

  const item = new ItemEntity(await context.getItem(data.itemId));

  item.setQuantity(item.getQuantity() + 1);

  await context.updateItem(toItemDtoMapper(item));
}

export async function decrementItemUseCase(
  context: {
    getUser: GetUser;
    deleteItem: DeleteItem;
    updateItem: UpdateItem;
    getItem: GetItem;
  },
  data: { itemId: number }
) {
  const user = context.getUser();

  if (!user) {
    throw new AuthenticationError();
  }

  const item = new ItemEntity(await context.getItem(data.itemId));

  if (item.getQuantity() <= 1) {
    await context.deleteItem(item.getId()!);
  } else {
    item.setQuantity(item.getQuantity() - 1);
  }

  item.validate();

  await context.updateItem(toItemDtoMapper(item));
}
