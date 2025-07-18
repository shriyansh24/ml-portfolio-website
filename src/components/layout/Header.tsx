"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import MobileMenu from "./MobileMenu";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Research", href: "/research" },
  { label: "Transformer", href: "/transformer" },
  { label: "Contact", href: "/#contact" },
];

export default function Header() {
  const pathname = usePathname();
  
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href) || (href.startsWith("/#") && pathname === "/");
  };

  return (
    <motion.header 
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-bold text-xl flex items-center gap-2">
            <span className="text-primary">ML</span>Portfolio
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary relative",
                isActive(item.href) ? "text-primary" : "text-foreground"
              )}
            >
              {item.label}
              {isActive(item.href) && (
                <motion.span 
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                  layoutId="activeNavIndicator"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-4">
          <Button variant="outline" size="sm">
            <Link href="/#contact">Contact</Link>
          </Button>
        </div>
        <MobileMenu navItems={navItems} />
      </div>
    </motion.header>
  );
}