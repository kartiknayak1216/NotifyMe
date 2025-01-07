"use client"
import React, { useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Divide, InboxIcon } from 'lucide-react'
import GroupDrawer from './groupdrawer'
import GroupCard from './groupcard'
import useGroup from '../hooks/useGroup'
import { Button } from '@/components/ui/button'

export default function GroupGrid() {

const[open,setOpen]= useState<boolean>(false)
    const { Groups, isLoading,createsMutate,isCreatings} = useGroup();


    
    if (isLoading) {
        return (
            <div className="grid max-w-6xl grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className='w-[300px] min-h-[300px]' />
                ))}
            </div>
        );
    }

    if (!Groups?.data || Groups?.data.length === 0) {
        return (
            <div className="flex flex-col gap-4 h-full items-center justify-center text-center">
                <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
                    <InboxIcon size={40} className="stroke-primary" />
                </div>
                <h2 className="font-bold text-lg">No Groups created yet</h2>
                <p className="text-sm text-muted-foreground">
                    Click the button below to create your first workflow.
                </p>
                <Button onClick={() => createsMutate()} disabled={isCreatings}>{
    isCreatings?<div className="">Creating Quickstart...</div>:<div>Create Quickstart</div>
    }</Button>
                <GroupDrawer />
            </div>
        );
    }

    return (
        <div className="grid max-w-6xl grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {Groups?.data.map((gro) => (
                <GroupCard
                    key={gro.id}
                    icon={gro.icon||""}
                    name={gro.name}
                    totalEvents={gro.eventCounts.total}
                    monthlyEvents={gro.eventCounts.thisMonth}
                    successEvents={gro.eventCounts.totalSuccess}
                    failureEvents={gro.eventCounts.totalFailure}
                    monthFailure={gro.eventCounts.monthFailure}
                    monthSuccess={gro.eventCounts.monthSuccess}
                    createdAt={gro.createdAt}
                    updatedAt={gro.updatedAt}
                    setOpen={setOpen}
                    open={open}
                    id={gro.id}

                    />
            ))}
        </div>
    );
}
