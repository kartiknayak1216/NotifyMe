"use server"

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import crypto from 'crypto';

const generateSecretKey = () => crypto.randomBytes(32).toString('hex');


export const getGroup = async () => {
    const user = await currentUser();
    if (!user) {
        return { status: 404 };
    }

    try {
        const groups = await prisma.groups.findMany({
            where: {
                user: {
                    externalId: user.id,
                },
            },
            select: {
                id: true,
                name: true,
                updatedAt: true,
                createdAt:true,
                icon: true,
                events: {
                    select: {
                        isSuccess: true,
                        createdAt: true,
                    },
                },
            },
        });
        if (groups.length === 0) {
            return { status: 404 };
        }

        const enrichedGroups = groups.map((group) => {
            const totalEvents = group.events.length;

            const totalSuccess = group.events.filter((event) => event.isSuccess).length;
            const totalFailure = totalEvents - totalSuccess;

            const thisMonthEvents = group.events.filter(
                (event) =>
                    event.createdAt >= new Date(new Date().getFullYear(), new Date().getMonth(), 1) &&
                    event.createdAt < new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
            );

            const monthSuccess = thisMonthEvents.filter((event) => event.isSuccess).length;
            const monthFailure = thisMonthEvents.length - monthSuccess;

            return {
                id: group.id,
                name: group.name,
                updatedAt: group.updatedAt,
                createdAt: group.createdAt,
                icon: group.icon,
                eventCounts: {
                    total: totalEvents,
                    totalSuccess,
                    totalFailure,
                    thisMonth: thisMonthEvents.length,
                    monthSuccess,
                    monthFailure,
                },
            };
        });

        return {
            status: 200,
            data: enrichedGroups,
        };
    } catch (error) {
        console.error(error);
        return { status: 500 };
    }
};

export const createGroup = async (name: string, icon: string) => {
    const user = await currentUser();
    if (!user) {

        return { status: 404 }
    }

    try {
        const create = await prisma.groups.create({
            data: {
                name: name,
                icon: icon,
                userId: user.id
            }
        })
        if (create) {
            return { status: 200 }
        }
        else {
            return { status: 404 }

        }
    } catch (error) {
        console.log(JSON.stringify(error))
        return { status: 404 }

    }
}
export const deleteGroup = async (groupId:string) => {
    const user = await currentUser();
    if (!user) {

        return { status: 404 }
    }

    try {
        const create = await prisma.groups.delete({
           where:{
            user:{
                externalId:user.id
            },
                id: groupId
           }
        })
        if (create) {
            return { status: 200 }
        }
        else {
            return { status: 404 }

        }
    } catch (error) {
        console.log(JSON.stringify(error))
        return { status: 404 }

    }
}
export const createGroupMany = async (data:{name: string, icon: string}[]) => {
    const user = await currentUser();
    if (!user) {

        return { status: 404 }
    }
    try {

const groupuser= data.map((gro)=>({...gro,userId:user.id}))

        const create = await prisma.groups.createMany({
            data: groupuser
            
        })
        if (create) {
            return { status: 200 }
        }
        else {
            return { status: 404 }

        }
    } catch (error) {
        console.log(JSON.stringify(error))
        return { status: 404 }

    }
}
export const getCredential = async()=>{
    const user = await currentUser();
    if (!user) {

        return { status: 404 }
    }

    try {
        const create =await prisma.user.findUnique({
            where:{
                externalId:user.id
            },
        select:{
            secretKey:true
        }
        })
        
        if (create) {
            return { status: 200,data:create }
        }
        else {
            return { status: 404 }

        }
    } catch (error) {
        console.log(JSON.stringify(error))
        return { status: 404 }

    }
}

export const updateCredential = async () => {
    const user = await currentUser();
    if (!user) {

        return { status: 404 }
    }

    try {
        const create = await prisma.user.update({
            where: {
                externalId: user.id
            },
            data:{
                secretKey: generateSecretKey()
            },
            select:{
                secretKey:true
            }
        })

        if (create) {
            return { status: 200, data: create }
        }
        else {
            return { status: 404 }

        }
    } catch (error) {
        console.log(JSON.stringify(error))
        return { status: 404 }

    }
}