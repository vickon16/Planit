import Link from "next/link";
import Logo from "./planit-logo";

const Footer = () => {
  return (
    <div className="my-12 px-2 py-16 flex items-center justify-center w-full flex-col gap-y-6">
      <div className="flex items-center gap-2">
        <Logo />
        <p className="text-clampBase font-semibold">Planit</p>
      </div>

        <ul className="flex items-center justify-center gap-y-4 gap-x-8 flex-wrap">
          {footerLinks.map((link) => (
            <Link
              href={link.href}
              key={link.id}
              className="text-foreground/70 hover:text-foreground transition-opacity duration-300 text-sm"
            >
              {link.title}
            </Link>
          ))}
        </ul>

      <p className="text-muted-foreground text-xs">&copy; Vickonary 2024.</p>
    </div>
  );
};

export default Footer;

const footerLinks = [
  {
    id: "1",
    title: "Pricing",
    href: "#",
  },
  {
    id: "2",
    title: "About",
    href: "#",
  },
  {
    id: "3",
    title: "Documentation",
    href: "#",
  },
  {
    id: "4",
    title: "Features",
    href: "#",
  },
];
