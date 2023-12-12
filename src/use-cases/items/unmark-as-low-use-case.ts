import { ItemEntity } from "@/entites/item";
import {
  GetUser,
  UpdateItem,
  GetItem,
  AuthenticationError,
  itemToDto,
} from "./utils";

export async function unmarkAsLowUseCase(
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
  item.unmarkAsLow();

  await context.updateItem(itemToDto(item));

  return itemToDto(item);
}
