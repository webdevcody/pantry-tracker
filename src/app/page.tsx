import Link from "next/link";

export default async function Page() {
  return (
    <main className="flex  flex-col items-center justify-between p-12">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <h1 className="text-white text-4xl font-bold tracking-tight sm:text-6xl">
            Streamline Your Kitchen Inventory with Ease
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Effortless Pantry Management for Smart Food Tracking and Worry-Free
            Meal Planning
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/dashboard"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Get started
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
