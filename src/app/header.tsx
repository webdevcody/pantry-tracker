import { ModeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import Link from "next/link";

export async function Header() {
  const { getUser } = await auth();

  return (
    <div className="border-b py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div>LOGO</div>
        <div className="flex items-center gap-4">
          <ModeToggle />

          {getUser() ? (
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
