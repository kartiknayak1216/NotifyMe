"use client"

import * as React from "react"
import { Minus, Plus } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer } from "recharts"

import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import Groupform from "./groupform"



export default function GroupDrawer() {


    return (
        <Drawer>
            <DrawerTrigger asChild>
                <button className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-brand-400 bg-[linear-gradient(110deg,#E1E9F6,45%,#C3D3ED,55%,#E1E9F6)] bg-[length:200%_100%] px-6 font-medium text-brand-900 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-white gap-x-2 w-full sm:w-fit">
                    <Plus className="w-5 h-5 text-brand-700 ml-2" />
                    <span className="font-semibold text-lg text-brand-700">Create Group</span>
                </button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>Creat New Group</DrawerTitle>
                        <DrawerDescription>Set your service call under relative group.</DrawerDescription>
                    </DrawerHeader>
                    <div className="flex items-center justify-center sm:space-x-4 md:space-x-2 w-full">

                        <Groupform  />
                    </div>
                    <DrawerFooter>

                        <DrawerClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
