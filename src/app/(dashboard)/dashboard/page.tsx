"use server"
import prisma from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'
import GroupDrawer from '../_component/groupdrawer'
import { DashboardPage } from '../_component/dashboardpage'
import GroupGrid from '../_component/groupgrid'

export default async function page() {
    const user = await currentUser()
    if (!user) {
        redirect("/sign-in")

    }

    const dbUser = await prisma.user.findUnique({
        where: {
            externalId: user.id
        }
    })

    if (!dbUser) {
        redirect("/sign-in")

    }
    return (
        <div className="">
            <DashboardPage title='Dashboard' cta={<GroupDrawer />}
                titleClassName='md:text-4xl sm:text-2xl'
                hideBackButton={true}>
                <GroupGrid/>
            </DashboardPage>
        </div>)
}

