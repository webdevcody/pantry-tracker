export type ItemDto = {
  id: number;
  name: string;
  quantity: number;
  userId: string;
  isLow: boolean;
};

export type CreateItemDto = {
  name: string;
  userId: string;
  quantity: number;
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

export type User = {
  userId: string;
};

export type CreateItem = (item: CreateItemDto) => void;
export type DeleteItem = (itemId: number) => void;
export type UpdateItem = (item: ItemDto) => void;
export type GetUser = () => User | undefined;
export type GetItem = (itemId: number) => Promise<ItemDto>;
export type GetUserItemByName = (
  userId: string,
  name: string
) => Promise<ItemDto | undefined>;

import { ItemEntity } from "@/entites/item";

export function itemToCreateItemDtoMapper(item: ItemEntity): CreateItemDto {
  return {
    name: item.getName(),
    userId: item.getUserId(),
    quantity: item.getQuantity(),
  };
}

export function itemToDto(item: ItemEntity): ItemDto {
  const itemId = item.getId();

  if (!itemId) {
    throw new Error("expected item to have an id");
  }

  return {
    id: itemId,
    name: item.getName(),
    userId: item.getUserId(),
    quantity: item.getQuantity(),
    isLow: item.getIsLow(),
  };
}
