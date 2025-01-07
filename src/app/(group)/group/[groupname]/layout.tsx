import { Separator } from '@/components/ui/separator'
import { SidebarMenuSkeleton } from '@/components/ui/sidebar'
import React, { ReactNode, Suspense } from 'react'
import Sidebar from './_component/sidebar'
import { groupDetail, isValidUser } from '../_server/server'
import { redirect } from 'next/navigation'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import Logo from '@/components/global/logo'
import { MobGroupSidebar } from './_component/MobGroupSidebar'

type  Props={
    children: ReactNode,
    params:{
        groupname:string
    }
}

export default async function ({ children,params}:Props) {
    const{ groupname} = await params
    if (!groupname){
        return
    }

    const validate = await isValidUser(groupname)

    if(validate.status !==200){
        redirect("/")
        return
    }
const query = new QueryClient()

await query.prefetchQuery({
    queryKey:["group-info"],
    queryFn: () => groupDetail(groupname)
    

})

    return (
        <HydrationBoundary state={dehydrate(query)}>
        <div className='flex min-h-screen h-full'>
            <Suspense fallback={<SidebarMenuSkeleton />}><Sidebar name={groupname} />
            </Suspense>
            <div className='flex flex-col flex-1 min-h-screen'>
                <header className=' items-center flex justify-between px-8 py-5 h-[68px] container'>
 <div className="flex md:hidden">  <Logo /></div>  
                        <div className="flex md:hidden"><MobGroupSidebar name={groupname} /></div>
                </header>
                <Separator />
                <div className='overflow-y-auto overflow-x-hidden'>
                    <div className="flex-1 container py-4 text-accent-foreground">
                    </div>
                    {children}
                </div>
            </div>
        </div>
        </HydrationBoundary>
    )
}
