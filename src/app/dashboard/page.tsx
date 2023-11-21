import { getItems } from "@/data-access/items";
import { CreateItemForm } from "./create-item-form";
import { ItemsTable } from "./items-table";

export default async function Dashboard() {
  const items = await getItems();

  return (
    <main className="grid grid-cols-3 p-12 gap-12">
      <div className="col-span-2">
        <h1 className="text-4xl mb-8">Your Pantry Items ({items.length})</h1>
        <ItemsTable items={items} />
      </div>
      <div className="col-span-1">
        <CreateItemForm />
      </div>
    </main>
  );
}
