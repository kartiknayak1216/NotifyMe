"use server"
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { endOfMonth, startOfMonth } from "date-fns";

export type Period = {
    month: number;
    year: number;
};

export async function GetPeriod(): Promise<Period[] | undefined> {
    const user = await currentUser();

    if (!user) {
        return;
    }

    const years = await prisma.groups.aggregate({
        where: {
            user:{
                externalId:user.id
            }
        },
        _min: {
            createdAt: true,
        },
    });

    const currentYear = new Date().getFullYear();
    const minYear = years._min.createdAt ? years._min.createdAt.getFullYear() : currentYear;

    const period: Period[] = [];

    for (let year = minYear; year <= currentYear; year++) {
        for (let month = 1; month <= 12; month++) {
            period.push({
                month,
                year,
            });
        }
    }

    return period;
}


export const getStatsForDay = async (period: Period,group:string): Promise<Record<string, { success: number; failure: number }>> => {
    const user = await currentUser();

    if (!user) {
        console.error("No user is logged in.");
        return {};
    }

    const { startdate, enddate } = getStartAndEndDate(period);

    const dailyStats: Record<string, { success: number; failure: number }> = {};
    const range = getDates(startdate, enddate);

    range.forEach((date) => {
        const key = date.toISOString().split("T")[0];
        dailyStats[key] = { success: 0, failure: 0 };
    });

    try {
        const events = await prisma.event.findMany({
            where: {
                group: {
                    userId: user.id,
                    name:group

                },
                createdAt: {
                    gte: startdate,
                    lte: enddate,
                },
            },
        });

        events.forEach((event) => {
            const key = event.createdAt.toISOString().split("T")[0];
            if (dailyStats[key]) {
                if (event.isSuccess) {
                    dailyStats[key].success++;
                } else {
                    dailyStats[key].failure++;
                }
            }
        });

        return dailyStats;
    } catch (error) {
        console.error("Error fetching workflow statistics:", error);
        return {};
    }
};



const getStartAndEndDate = (period: Period) => {
    const startdate = startOfMonth(new Date(period.year, period.month - 1));
    const enddate = endOfMonth(new Date(period.year, period.month - 1));
    return { startdate, enddate };
};
function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function getDates(startDate: Date, stopDate: Date): Date[] {
    const dateArray = [];
    let currentDate = new Date(startDate);

    while (currentDate <= stopDate) {
        dateArray.push(new Date(currentDate));
        currentDate = addDays(currentDate, 1);
    }

    return dateArray;
}
