"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import React, { useRef, useState, useEffect } from "react";
import { CoinsIcon, HomeIcon, Layers2Icon, MenuIcon, ShieldCheckIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { getLinkGrop, Sidebaritems } from "@/lib/types/sidebar";
import Logo from "@/components/global/logo";

export function MobGroupSidebar({name}:{name:string}) {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const pathname = usePathname();
    const sideref = useRef<HTMLDivElement | null>(null)
    const getLinkGrops = getLinkGrop(name)

    const toggleCollapse = () => setIsCollapsed((prev) => !prev);
    const handleResize = () => {
        const isSmallScreen = window.innerWidth <= 768;
        setIsCollapsed(isSmallScreen);
    };
    const debounce = (fun: Function, wait: number) => {
        let timeout: ReturnType<typeof setTimeout>

        return (...args: any[]) => {
            clearTimeout(timeout)
            timeout = setTimeout(() => fun(...args), wait)
        }
    }

    useEffect(() => {
        const debouncedResize = debounce(handleResize, 200);
        handleResize();
        window.addEventListener("resize", debouncedResize);
        return () => {
            window.removeEventListener("resize", debouncedResize);
        };
    }, []);
    return (
        <Sheet>
            <SheetTrigger asChild>
                <MenuIcon />
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Menu </SheetTitle>

                </SheetHeader>

                <div
                    ref={sideref}
                    className="relative h-screen overflow-hidden border-r min-w-[280px] max-w-[280px]"
                >
                    <div className="flex items-center justify-between p-4 border-b">

                    </div>

                    <div className="flex flex-col p-4 gap-4">
                        {getLinkGrops.map((item, index) => (
                            <TooltipProvider key={index}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href={item.link}
                                            className={buttonVariants({
                                                variant: pathname === item.link ? "sidebarActive" : "sidebarIcon",
                                            })}
                                        >
                                            <div className="flex items-center gap-2">
                                                <item.icon
                                                    size={20}
                                                    className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                                                />
                                                <span className="text-sm font-medium text-gray-700">
                                                    {item.label}
                                                </span>
                                            </div>
                                        </Link>
                                    </TooltipTrigger>
                                </Tooltip>
                            </TooltipProvider>
                        ))}
                    </div>
                </div>


            </SheetContent>
        </Sheet>
    )
}
