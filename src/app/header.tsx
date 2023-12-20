import { ModeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";

export async function Header() {
  const { getUser } = await auth();

  const user = getUser();

  return (
    <div className="border-b py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex gap-1 items-center text-xl">
          <Image
            src="/logo.png"
            width="50"
            height="50"
            alt="pantry tracker logo"
          />{" "}
          PantryTracker
        </Link>

        <div>
          {user && (
            <Link href="/dashboard">
              <Button variant={"ghost"}>Manage Pantry</Button>
            </Link>
          )}
        </div>

        <div className="flex justify-between gap-4">
          <ModeToggle />

          {user ? (
            <Link href="/api/auth/signout">
              <Button>Sign Out</Button>
            </Link>
          ) : (
            <Link href="/api/auth/signin/google">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
