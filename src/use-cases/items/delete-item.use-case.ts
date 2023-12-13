import { GetUser, DeleteItem } from "./types";
import { AuthenticationError } from "./utils";

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
