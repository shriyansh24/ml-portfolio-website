import { ButtonHTMLAttributes, forwardRef, AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
  href?: string;
  external?: boolean;
}

// Separate props for anchor elements to fix TypeScript errors
type AnchorProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonProps> & ButtonProps;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = "default", 
    size = "default", 
    asChild = false,
    href,
    external = false,
    children,
    ...props 
  }, ref) => {
    const baseStyles = cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
      {
        "bg-primary text-white hover:bg-primary/90": variant === "primary",
        "bg-secondary text-white hover:bg-secondary/90": variant === "secondary",
        "border border-input bg-background hover:bg-accent hover:text-accent-foreground": variant === "outline",
        "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
        "underline-offset-4 hover:underline text-primary": variant === "link",
        "bg-foreground text-background hover:bg-foreground/90": variant === "default",
        "h-10 py-2 px-4": size === "default",
        "h-9 px-3": size === "sm",
        "h-11 px-8": size === "lg",
        "h-10 w-10": size === "icon",
      },
      className
    );

    // If href is provided, render as Link or anchor
    if (href) {
      // Extract button-specific props that shouldn't be passed to anchor elements
      const { type, ...restProps } = props;
      
      return external ? (
        <a 
          href={href}
          className={baseStyles}
          target="_blank"
          rel="noopener noreferrer"
          {...restProps as AnchorProps}
        >
          {children}
        </a>
      ) : (
        <Link 
          href={href}
          className={baseStyles}
          {...restProps as AnchorProps}
        >
          {children}
        </Link>
      );
    }

    // Otherwise render as button
    return (
      <button
        className={baseStyles}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };