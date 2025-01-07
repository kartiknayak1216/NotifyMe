import { Separator } from '@/components/ui/separator'
import { SidebarMenuSkeleton } from '@/components/ui/sidebar'
import React, { ReactNode, Suspense } from 'react'
import Sidebar from './_component/sidebar'
import Logo from '@/components/global/logo'
import { MobSidebar } from './_component/minisidebar'


export default function ({children}:{children:ReactNode}) {
  return (
      <div className='flex min-h-screen h-full'>
          <Suspense fallback={<SidebarMenuSkeleton />}><Sidebar />
          </Suspense>
          <div className='flex flex-col flex-1 min-h-screen'>
              <header className=' items-center flex justify-between px-8 py-5 h-[68px] container'>
                  <div className="flex md:hidden">  <Logo /></div>  
                  <div className="flex md:hidden"><MobSidebar/></div>      
              </header>
              <Separator />
              <div className='overflow-y-auto overflow-x-hidden'>
                  <div className="flex-1 container py-4 text-accent-foreground">
                  </div>
                  {children}
              </div>
          </div>
      </div>
  )
}
