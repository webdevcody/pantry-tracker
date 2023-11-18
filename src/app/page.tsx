import { getItems } from "@/data-access/items";
import { CreateItemForm } from "./create-item-form";
import { ItemsList } from "./items-list";

export default async function Home() {
  const items = await getItems();

  return (
    <main className="flex  flex-col items-center justify-between p-12">
      <ItemsList items={items} />
      <CreateItemForm />
    </main>
  );
}
