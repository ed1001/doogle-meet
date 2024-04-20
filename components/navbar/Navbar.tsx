import Link from "next/link";
import { Logo } from "./Logo";

export const Navbar = () => {
  return (
    <nav className="fixed left-0 top-0 flex h-16 w-full items-center p-12">
      <Link href={"/"}>
        <Logo />
      </Link>
    </nav>
  );
};
