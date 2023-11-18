import { Button } from "@/components/ui/button";
import { deleteItemAction } from "./actions";
import { Item } from "@/db/schema";
import { sortBy } from "lodash";

export function ItemsList({ items }: { items: Item[] }) {
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
