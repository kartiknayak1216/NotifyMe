"use server"

import prisma from "@/lib/prisma";


export async function handleApiError(categoryId: string, userId: string, currentYear: number, currentMonth: number) {
    await prisma.$transaction(async (transactionPrisma) => {
        await transactionPrisma.event.create({
            data: {
                groupId: categoryId,
                isSuccess: false,
            },
        });

        await transactionPrisma.quota.upsert({
            where: {
                userId_year_month: {
                    userId,
                    year: currentYear,
                    month: currentMonth,
                },
            },
            update: {
                count: { increment: 1 },
            },
            create: {
                userId,
                year: currentYear,
                month: currentMonth,
                count: 1,
            },
        });
    });
}
