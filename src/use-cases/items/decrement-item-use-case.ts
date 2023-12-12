import { ItemEntity } from "@/entites/item";
import {
  GetUser,
  UpdateItem,
  GetItem,
  AuthenticationError,
  itemToDto,
  DeleteItem,
} from "./utils";

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

  const dataItem = await context.getItem(data.itemId);
  const item = new ItemEntity(dataItem);
  item.decrement();
  await context.updateItem(itemToDto(item));

  return itemToDto(item);
}
