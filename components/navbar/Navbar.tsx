import Link from "next/link";
import { Logo } from "./Logo";

export const NAVBAR_HEIGHT = 16;

export const Navbar = () => {
  return (
    <nav
      className={`fixed left-0 top-0 flex h-${NAVBAR_HEIGHT} w-full items-center p-12`}
    >
      <Link href={"/"}>
        <Logo />
      </Link>
    </nav>
  );
};
