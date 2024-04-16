import Link from "next/link";
import { Logo } from "./Logo";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full flex items-center h-16 p-12">
      <Link href={"/"}>
        <Logo />
      </Link>
    </nav>
  );
};
