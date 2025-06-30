import Link from "next/link";
import { ModeToggle } from "./theme-toggle";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Link href="/" className="font-bold text-lg">
        Food Facts
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/search" className="text-sm font-medium hover:underline underline-offset-4">
          Search
        </Link>
        <Link href="/restaurants" className="text-sm font-medium hover:underline underline-offset-4">
          Restaurants
        </Link>
        <ModeToggle />
      </div>
    </nav>
  );
}