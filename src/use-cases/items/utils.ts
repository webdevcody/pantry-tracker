import { ItemEntity } from "@/entites/item";
import { CreateItemDto, ItemDto } from "./types";

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
