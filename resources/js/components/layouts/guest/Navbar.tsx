import * as React from "react";
import { useEffect, useState, useRef, useId } from "react";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { Link } from "react-router-dom";
// Simple logo component for the navbar
const Logo = (props: React.SVGAttributes<SVGElement>) => {
    return (
        <img
            src="/assets/images/logo.png"
            alt="Logo Loon N Read"
            className="w-14"
        />
    );
};
// Hamburger icon component
const HamburgerIcon = ({
    className,
    ...props
}: React.SVGAttributes<SVGElement>) => (
    <svg
        className={cn("pointer-events-none", className)}
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
        {...(props as any)}
    >
        <path
            d="M4 12L20 12"
            className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
        />
        <path
            d="M4 12H20"
            className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
        />
        <path
            d="M4 12H20"
            className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
        />
    </svg>
);
// Types
export interface Navbar04NavItem {
    href?: string;
    label: string;
    flag?: string;
}
export interface Navbar04Props extends React.HTMLAttributes<HTMLElement> {
    logo?: React.ReactNode;
    logoHref?: string;
    navigationLinks?: Navbar04NavItem[];
    signInText?: string;
    signInHref?: string;
    cartText?: string;
    cartHref?: string;
    cartCount?: number;
    searchPlaceholder?: string;
    onSignInClick?: () => void;
    onCartClick?: () => void;
    onSearchSubmit?: (query: string) => void;
}
// Default navigation links
const defaultNavigationLinks: Navbar04NavItem[] = [
    { href: "#", flag: "/assets/flags/jp-waving.webp", label: "Manga" },
    { href: "#", flag: "/assets/flags/cn-waving.webp", label: "Manhua" },
    { href: "#", flag: "/assets/flags/kr-waving.webp", label: "Manhwa" },
];
export const Navbar = React.forwardRef<HTMLElement, Navbar04Props>(
    (
        {
            className,
            logo = <Logo />,
            logoHref = "#",
            navigationLinks = defaultNavigationLinks,
            searchPlaceholder = "Search...",
            onSearchSubmit,
            ...props
        },
        ref
    ) => {
        const [isMobile, setIsMobile] = useState(false);
        const containerRef = useRef<HTMLElement>(null);
        const searchId = useId();
        useEffect(() => {
            const checkWidth = () => {
                if (containerRef.current) {
                    const width = containerRef.current.offsetWidth;
                    setIsMobile(width < 768); // 768px is md breakpoint
                }
            };
            checkWidth();
            const resizeObserver = new ResizeObserver(checkWidth);
            if (containerRef.current) {
                resizeObserver.observe(containerRef.current);
            }
            return () => {
                resizeObserver.disconnect();
            };
        }, []);
        // Combine refs
        const combinedRef = React.useCallback(
            (node: HTMLElement | null) => {
                containerRef.current = node;
                if (typeof ref === "function") {
                    ref(node);
                } else if (ref) {
                    ref.current = node;
                }
            },
            [ref]
        );
        const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const query = formData.get("search") as string;
            if (onSearchSubmit) {
                onSearchSubmit(query);
            }
        };
        return (
            <header
                ref={combinedRef}
                className={cn(
                    "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 [&_*]:no-underline",
                    className
                )}
                {...(props as any)}
            >
                <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4">
                    {/* Left side */}
                    <div className="flex flex-1 items-center gap-2">
                        {/* Mobile menu trigger */}
                        {isMobile && (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        className="group h-9 w-9 hover:bg-accent hover:text-accent-foreground"
                                        variant="ghost"
                                        size="icon"
                                    >
                                        <HamburgerIcon />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    align="start"
                                    className="w-64 p-1"
                                >
                                    <NavigationMenu className="">
                                        <NavigationMenuList className="flex flex-col gap-5 px-5 pb-0 pt-5">
                                            {navigationLinks.map(
                                                (link, index) => (
                                                    <NavigationMenuItem
                                                        key={index}
                                                        className="w-full"
                                                    >
                                                        <Link
                                                            to={""}
                                                            className="flex gap-5 hover:text-primary hover:font-semibold"
                                                        >
                                                            <img
                                                                src={link.flag}
                                                                alt={link.label}
                                                            />
                                                            <span>
                                                                {link.label}
                                                            </span>
                                                        </Link>
                                                    </NavigationMenuItem>
                                                )
                                            )}
                                            <NavigationMenuItem
                                                className="w-full"
                                                role="presentation"
                                                aria-hidden={true}
                                            >
                                                <div
                                                    role="separator"
                                                    aria-orientation="horizontal"
                                                    className="bg-border -mx-1 my-1 h-px"
                                                />
                                            </NavigationMenuItem>
                                        </NavigationMenuList>
                                    </NavigationMenu>
                                </PopoverContent>
                            </Popover>
                        )}
                        {/* Main nav */}
                        <div className="flex flex-1 items-center gap-6 justify-between lg:px-8">
                            <button
                                onClick={(e) => e.preventDefault()}
                                className="flex items-center space-x-2 text-primary hover:text-primary/90 transition-colors cursor-pointer"
                            >
                                <div className="text-2xl">{logo}</div>
                                <span className="hidden font-bold text-xl sm:inline-block">
                                    <Link to={"/"}>Look n Read</Link>
                                </span>
                            </button>
                            {/* Navigation menu */}
                            {!isMobile && (
                                <NavigationMenu className="flex">
                                    <NavigationMenuList className="gap-10">
                                        {navigationLinks.map((link, index) => (
                                            <NavigationMenuItem key={index}>
                                                <NavigationMenuLink
                                                    href={link.href}
                                                    onClick={(e) =>
                                                        e.preventDefault()
                                                    }
                                                    className="flex flex-col items-center"
                                                >
                                                    <img
                                                        src={link.flag}
                                                        alt={link.label}
                                                        className="w-6"
                                                    />
                                                    <span className="hover:text-primary font-bold">
                                                        {link.label}
                                                    </span>
                                                </NavigationMenuLink>
                                            </NavigationMenuItem>
                                        ))}
                                    </NavigationMenuList>
                                </NavigationMenu>
                            )}
                            {/* Search form */}
                            <form
                                onSubmit={handleSearchSubmit}
                                className="relative"
                            >
                                <Input
                                    id={searchId}
                                    name="search"
                                    className="peer h-8 ps-8 pe-2"
                                    placeholder={searchPlaceholder}
                                    type="search"
                                />
                                <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 peer-disabled:opacity-50">
                                    <SearchIcon size={16} />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </header>
        );
    }
);
Navbar.displayName = "Navbar";
export { Logo, HamburgerIcon };
