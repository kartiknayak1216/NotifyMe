import { Skeleton } from "@/components/ui/skeleton";
import React, { Suspense } from "react";
import Periodselection from "./periodselection";
import { GetPeriod, getStatsForDay } from "./server";
import Statsday from "./stats";

type Props = {
  params: {
    month?: string;
    year?: string;
    groupname: string;
  };
};

export default async function Page({ params }: Props) {
  const current = new Date();
  const { month, year, groupname } = params;

  const period = {
    month: month ? parseInt(month) : current.getMonth() + 1,
    year: year ? parseInt(year) : current.getFullYear(),
  };

  if (!groupname) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg font-medium text-red-500">Error loading data!</span>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col h-full p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex justify-between items-center border-b pb-4 mb-6 border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Analytics</h1>
        <Suspense fallback={<Skeleton className="w-[180px] h-[40px]" />}>
          <PeriodSelection selected={period} />
        </Suspense>
      </div>

      <div className="flex flex-col gap-6">
        <Suspense fallback={<Skeleton className="w-full h-[200px] rounded-md" />}>
          <StaticCard selected={period} groupname={groupname} />
        </Suspense>
      </div>
    </div>
  );
}

type Period = {
  month: number;
  year: number;
};

async function PeriodSelection({ selected }: { selected: Period }) {
  const periods = await GetPeriod();
  if (!periods) {
    return null;
  }
  return <Periodselection period={periods} selected={selected} />;
}

async function StaticCard({ selected, groupname }: { selected: Period; groupname: string }) {
  const stats = await getStatsForDay(selected, groupname);
  if (!stats) {
    return (
      <div className="text-red-500">Error fetching statistics for the selected period.</div>
    );
  }
  return (
    <div className="flex flex-col gap-6 bg-white dark:bg-gray-800 p-4 rounded-md shadow-md">
      <Statsday stats={stats} />
    </div>
  );
}
