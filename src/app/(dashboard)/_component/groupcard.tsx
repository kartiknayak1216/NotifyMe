import { group } from 'console';
import { format, formatDistanceToNow } from 'date-fns';
import { Clock, MoreVerticalIcon, TrashIcon } from 'lucide-react';
import React, { Dispatch, SetStateAction } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { TooltipWraapper } from '@/components/global/tooltip';
import DeleteButton from './deletebutton';
import Link from 'next/link';
import ProgressBar from './progressbar';


interface GroupCardProps {
    id: string
    icon: string;
    name: string;
    totalEvents: number;
    monthlyEvents: number;
    successEvents: number;
    failureEvents: number;
    monthSuccess:number;
    monthFailure:number
    createdAt: Date,
    updatedAt: Date,
    setOpen: Dispatch<SetStateAction<boolean>>,
    open: boolean
}

const GroupCard: React.FC<GroupCardProps> = ({
    icon,
    name,
    totalEvents,
    monthlyEvents,
    successEvents,
    failureEvents, createdAt, updatedAt, setOpen, id, open, monthFailure, monthSuccess
}) => {
    const total = successEvents + failureEvents;
    const successPercentage = total === 0 ? 0 : (successEvents / total) * 100;
    const failurePercentage = total === 0 ? 0 : (failureEvents / total) * 100;

    const successPercentageMonth = monthlyEvents === 0 ? 0 : (monthSuccess / monthlyEvents) * 100;
    const failurePercentageMonth = monthlyEvents === 0 ? 0 : (monthFailure / monthlyEvents) * 100;



    return (
        <div className="border p-4 rounded-md shadow-lg space-y-4">


            <div className="flex flex-ro justify-between">
                <h3 className="text-lg md:text-xl leading-7 font-medium tracking-tight text-slate-600 flex items-center space-x-2">
                    <span>{icon}</span>
                    <Link href={`/group/${name}/analytics`} className=" hover:underline">
                        {name}
                    </Link>
                </h3>

                <p className="text-sm/6 text-gray-600">
                    {format(createdAt, "MMM d, yyyy")}
                </p>
                <DeleteButton id={id} name={name} open={open} setOpen={setOpen} />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <TooltipWraapper content="More actions">
                                <div className="flex items-center justify-center w-full h-full">
                                    <MoreVerticalIcon size={18} />
                                </div>
                            </TooltipWraapper>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive flex items-center gap-2" onSelect={() => setOpen(true)}>
                            <TrashIcon size={16} /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm/5 text-gray-600">
                    <Clock className="size-4 mr-2 text-brand-500" />
                    <span className="font-medium">Last trigger:</span>
                    <span className="ml-1">
                        {updatedAt
                            ? formatDistanceToNow(updatedAt) + " ago"
                            : "Never"}
                    </span>
                </div>


            </div>
            <div className="flex flex-col gap-y-1">
                <div className="text-foreground text-sm text-gray-600">
                    Monthly Events:
                    <ProgressBar
                        successPercentage={successPercentageMonth}
                        failurePercentage={failurePercentageMonth}
                    />
                    <div className="flex flex-row gap-2 mt-1">
                        <span className="text-green-600">{`Success: ${successPercentageMonth}%`}</span>
                        <span className="text-red-600">{`Fail: ${failurePercentageMonth}%`}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-y-1">
                <div className="text-foreground text-sm text-gray-600">
                    Total Events:
                    <ProgressBar successPercentage={successPercentage} failurePercentage={failurePercentage} />

                    <div className="flex flex-row gap-2 mt-1">
                        <span className="text-green-600">{`Success: ${successPercentage}%`}</span>
                        <span className="text-red-600">{`Fail: ${failurePercentage}%`}</span>
                    </div>
                </div>
            </div>





        </div>

    );
};

export default GroupCard;
