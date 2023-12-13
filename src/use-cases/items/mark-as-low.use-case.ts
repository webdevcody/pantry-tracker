import { ItemEntity } from "@/entites/item";
import { AuthenticationError, itemToDto } from "./utils";
import { GetUser, UpdateItem, GetItem } from "./types";

export async function markAsLowUseCase(
  context: {
    getUser: GetUser;
    updateItem: UpdateItem;
    getItem: GetItem;
  },
  data: { itemId: number }
) {
  const user = context.getUser();

  if (!user) {
    throw new AuthenticationError();
  }

  const dataItem = await context.getItem(data.itemId);
  const item = new ItemEntity(dataItem);
  item.markAsLow();

  await context.updateItem(itemToDto(item));

  return itemToDto(item);
}
