import { Logo } from "./Logo";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full flex items-center h-16 px-3">
      <Logo />
    </nav>
  );
};
