"use client";
import React, { useRef, useState, useEffect } from "react";
import { CoinsIcon, HomeIcon, Layers2Icon, ShieldCheckIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sidebaritems } from "@/lib/types/sidebar";
import Logo from "@/components/global/logo";



export default function sidebar() {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const pathname = usePathname();
    const sideref = useRef<HTMLDivElement | null>(null)


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
        <div
            ref={sideref}
            className={cn(
                "relative hidden md:block h-screen overflow-hidden border-r transition-all duration-300",
                isCollapsed ? "min-w-[80px] max-w-[80px]" : "min-w-[280px] max-w-[280px]"
            )}
        >
            <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2 ml-6">
                    {!isCollapsed && (
                        <Logo />
                    )}
                </div>
                <Button onClick={toggleCollapse} variant="ghost" size="icon">
                    {isCollapsed ? "→" : "←"}
                </Button>
            </div>

            <div className="flex flex-col p-4 gap-4">
                {Sidebaritems.map((item, index) => (
                    <TooltipProvider key={index}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href={item.link}
                                    className={buttonVariants({
                                        variant: pathname === item.link ? "sidebarActive" : "sidebarIcon",
                                    })}
                                >
                                    <div
                                        className="flex items-center gap-2">
                                    
                                        <item.icon
                                            size={20}
                                            className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                                        />
                                        {!isCollapsed && (
                                            <span className="text-sm font-medium text-gray-700">
                                                {item.label}
                                            </span>
                                        )}
                                    </div>

                                </Link>
                            </TooltipTrigger>
                            {isCollapsed && (
                                <TooltipContent side="right">
                                    <p>{item.label}</p>
                                </TooltipContent>
                            )}
                        </Tooltip>
                    </TooltipProvider>
                ))}
            </div>
        </div>)
}