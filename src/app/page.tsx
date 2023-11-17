import { db } from "@/db";

export default async function Home() {
  const allItems = await db.query.items.findMany({});

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {allItems.map((item) => {
        return <div key={item.id}>{item.name}</div>;
      })}
    </main>
  );
}
