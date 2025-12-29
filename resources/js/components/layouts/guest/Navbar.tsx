import * as React from "react";
import { useEffect, useState, useRef } from "react";
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
import {
    Link,
    useLocation,
    useNavigate,
    useSearchParams,
} from "react-router-dom";
import { Context } from "@/context/Context";
import axios from "axios";

// --- COMPONENTS ---
const Logo = (props: React.SVGAttributes<SVGElement>) => {
    return (
        <img
            src="/assets/images/logo.png"
            alt="Logo Loon N Read"
            className="w-14"
        />
    );
};

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

// --- TYPES ---
export interface Navbar04NavItem {
    href?: string;
    label: string;
    flag?: string;
}

export interface Navbar04Props extends React.HTMLAttributes<HTMLElement> {
    logo?: React.ReactNode;
    navigationLinks?: Navbar04NavItem[];
    searchPlaceholder?: string;
    onSearchSubmit?: (query: string) => void;
    onCategoryClick?: (categoryName: string) => void;
}

const defaultNavigationLinks: Navbar04NavItem[] = [
    { href: "#", flag: "/assets/flags/jp-waving.webp", label: "Manga" },
    { href: "#", flag: "/assets/flags/cn-waving.webp", label: "Manhua" },
    { href: "#", flag: "/assets/flags/kr-waving.webp", label: "Manhwa" },
];

// --- MAIN NAVBAR ---
export const Navbar = React.forwardRef<HTMLElement, Navbar04Props>(
    (
        {
            className,
            logo = <Logo />,
            navigationLinks = defaultNavigationLinks,
            searchPlaceholder = "Search...",
            onSearchSubmit,
            onCategoryClick,
            ...props
        },
        ref
    ) => {
        const [isMobile, setIsMobile] = useState(false);
        const containerRef = useRef<HTMLElement>(null);
        const navigate = useNavigate();
        const location = useLocation();

        // 1. STATE UNTUK SEARCH
        const [searchParams] = useSearchParams();
        const currentQuery = searchParams.get("search") || "";
        const [searchQuery, setSearchQuery] = useState(currentQuery);

        const { setExpandedCategory, setCategoryComics, setIsCategoryLoading } =
            React.useContext(Context);

        useEffect(() => {
            const checkWidth = () => {
                if (containerRef.current)
                    setIsMobile(containerRef.current.offsetWidth < 768);
            };
            checkWidth();
            window.addEventListener("resize", checkWidth);
            return () => window.removeEventListener("resize", checkWidth);
        }, []);

        const combinedRef = React.useCallback(
            (node: HTMLElement | null) => {
                containerRef.current = node;
                if (typeof ref === "function") ref(node);
                else if (ref) ref.current = node;
            },
            [ref]
        );

        // 2. TRIGGER SEARCH (Tanpa Reload)
        const handleSearchAction = () => {
            if (location.pathname !== "/comics") {
                navigate(`/comics?search=${searchQuery}`);
            }

            if (onSearchSubmit) {
                onSearchSubmit(searchQuery);
            }
        };

        // 3. HANDLE ENTER (Wajib preventDefault)
        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
                e.preventDefault(); // <--- INI KUNCI BIAR GAK RELOAD
                handleSearchAction();
            }
        };

        const handleCategoryClick = async (categoryName: string) => {
            try {
                setExpandedCategory(categoryName);
                setIsCategoryLoading(true);

                const res = await axios.get(
                    `/api/comics?type=${categoryName.toLowerCase()}`
                );
                const categoryData = res.data.data || res.data || [];
                setCategoryComics(
                    Array.isArray(categoryData) ? categoryData : []
                );
            } catch (error) {
                console.error("Error fetching category comics:", error);
                setCategoryComics([]);
            } finally {
                setIsCategoryLoading(false);
            }
        };

        return (
            <header
                ref={combinedRef}
                className={cn(
                    "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur px-4 md:px-6",
                    className
                )}
                {...(props as any)}
            >
                <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4">
                    <div className="flex flex-1 items-center gap-2">
                        {isMobile && (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9"
                                    >
                                        <HamburgerIcon />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    align="start"
                                    className="w-64 p-1"
                                >
                                    <NavigationMenu>
                                        <NavigationMenuList className="flex flex-col gap-5 p-5">
                                            {navigationLinks.map((link, i) => (
                                                <NavigationMenuItem
                                                    key={i}
                                                    className="w-full"
                                                >
                                                    <button
                                                        onClick={() =>
                                                            handleCategoryClick(
                                                                link.label
                                                            )
                                                        }
                                                        className="flex gap-4 hover:text-primary w-full"
                                                    >
                                                        <img
                                                            src={link.flag}
                                                            alt=""
                                                            className="w-6"
                                                        />
                                                        <span>
                                                            {link.label}
                                                        </span>
                                                    </button>
                                                </NavigationMenuItem>
                                            ))}
                                        </NavigationMenuList>
                                    </NavigationMenu>
                                </PopoverContent>
                            </Popover>
                        )}

                        <div className="flex flex-1 items-center gap-6 justify-between lg:px-8">
                            <Link
                                to="/"
                                className="flex items-center space-x-2 text-primary hover:opacity-80"
                            >
                                <div className="text-2xl">{logo}</div>
                                <span className="hidden font-bold text-xl sm:inline-block">
                                    Look n Read
                                </span>
                            </Link>

                            {!isMobile && (
                                <NavigationMenu>
                                    <NavigationMenuList className="gap-10">
                                        {navigationLinks.map((link, i) => (
                                            <NavigationMenuItem key={i}>
                                                <NavigationMenuLink
                                                    onClick={() =>
                                                        handleCategoryClick(
                                                            link.label
                                                        )
                                                    }
                                                    className="flex flex-col items-center cursor-pointer font-bold hover:text-primary"
                                                >
                                                    <img
                                                        src={link.flag}
                                                        alt=""
                                                        className="w-6"
                                                    />
                                                    <span>{link.label}</span>
                                                </NavigationMenuLink>
                                            </NavigationMenuItem>
                                        ))}
                                    </NavigationMenuList>
                                </NavigationMenu>
                            )}

                            {/* --- SEARCH INPUT FIXED --- */}
                            <div className="relative flex gap-2 items-center">
                                <div className="relative">
                                    <Input
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        onKeyDown={handleKeyDown}
                                        type="search"
                                        placeholder={searchPlaceholder}
                                        className="h-8 w-[150px] md:w-[200px] ps-8"
                                    />
                                    <div className="text-muted-foreground absolute inset-y-0 start-0 flex items-center justify-center ps-2 pointer-events-none">
                                        <SearchIcon size={16} />
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    size="sm"
                                    className="h-8"
                                    onClick={handleSearchAction}
                                >
                                    Search
                                </Button>
                            </div>
                            {/* ------------------------- */}
                        </div>
                    </div>
                </div>
            </header>
        );
    }
);
Navbar.displayName = "Navbar";
export { Logo, HamburgerIcon };
