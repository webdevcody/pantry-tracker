import { Button } from "@/components/ui/button";
import { deleteItemAction } from "./actions";
import { Item } from "@/db/schema";
import { sortBy } from "lodash";
import { ItemDto } from "@/data-access/items";

export function ItemsList({ items }: { items: ItemDto[] }) {
  const sortedItems = sortBy(items, ["name"]);

  return (
    <ul className="list-disc">
      {sortedItems.map((item) => {
        return (
          <li
            data-testid={`item-${item.name}`}
            key={item.id}
            className="flex gap-4 items-center"
          >
            {item.name}{" "}
            <form action={deleteItemAction.bind(null, item.id)}>
              <Button
                data-testid={`delete-${item.name}`}
                variant={"destructive"}
              >
                X
              </Button>
            </form>
          </li>
        );
      })}
    </ul>
  );
}
