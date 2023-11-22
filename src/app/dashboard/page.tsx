import { getItems } from "@/data-access/items";
import { CreateItemForm } from "./create-item-form";
import { ItemsTable } from "./items-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { partition } from "lodash";

export default async function Dashboard() {
  const items = await getItems();

  const [outOfItems, itemsInPantry] = partition(
    items,
    (item) => item.quantity === 0
  );
  const [lowItems, normalItems] = partition(
    itemsInPantry,
    (item) => item.isLow
  );

  return (
    <main className="grid grid-cols-3 p-12 gap-12">
      <div className="col-span-2">
        <h1 className="text-4xl mb-8">Your Pantry</h1>

        <Tabs defaultValue="items">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="items">
              In Stock ({normalItems.length})
            </TabsTrigger>
            <TabsTrigger value="low">
              Running Low ({lowItems.length})
            </TabsTrigger>
            <TabsTrigger value="out">
              Out of Stock ({outOfItems.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="items">
            <ItemsTable items={normalItems} />
          </TabsContent>
          <TabsContent value="low">
            <ItemsTable items={lowItems} />
          </TabsContent>
          <TabsContent value="out">
            <ItemsTable items={outOfItems} />
          </TabsContent>
        </Tabs>
      </div>
      <div className="col-span-1">
        <CreateItemForm />
      </div>
    </main>
  );
}
