import { NAVBAR_LINKS } from "@/lib/const/navbar-links";
import { cn } from "@/lib/utils";
import { AuthButton, ThemeToggle } from "../elements";
import Link from "next/link";

interface NavbarProps {
  className?: string;
}

export default function Navbar({ className }: NavbarProps) {
  return (
    <div>
      <nav className={cn("flex items-center justify-between p-4", className)}>
        <h1 className="text-2xl font-bold">agentpress</h1>
        <ul className="flex space-x-6">
          {NAVBAR_LINKS.map((link) => (
            <li className="hover:text-foreground/80 transition" key={link.href}>
              {link.disabled ? (
                <span className="cursor-not-allowed text-muted-foreground">
                  {link.title}
                </span>
              ) : (
                <Link href={link.href}>{link.title}</Link>
              )}
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-4">
          <Link className="text-sm text-muted-foreground" href={"/signup"}>
            Sign up
          </Link>
          <AuthButton />
          <ThemeToggle />
        </div>
      </nav>
      <hr />
    </div>
  );
}
