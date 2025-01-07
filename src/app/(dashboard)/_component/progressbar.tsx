import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

interface ProgressBarProps {
    successPercentage: number;
    failurePercentage: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
    successPercentage,
    failurePercentage,
}) => {
    const [success, setSuccess] = useState<number>(0);
    const [failure, setFailure] = useState<number>(0);



    useEffect(() => {
        const interval = setInterval(() => {
            if (success < successPercentage) {
                setSuccess((prev) => Math.min(prev + 1, successPercentage));
            }
            if (failure < failurePercentage) {
                setFailure((prev) => Math.min(prev + 1, failurePercentage));
            }
        }, 30); 

       
        return () => clearInterval(interval);
    }, [success, failure, successPercentage, failurePercentage]);



  


    return (
        <div className="w-full bg-gray-300 rounded-lg">
            <div className="flex w-full h-2">
                <div
                    className={cn('h-full rounded-l-lg', 'bg-green-600')}
                    style={{ width: `${success}%` }}
                />
                <div
                    className={cn('h-full rounded-r-lg', 'bg-red-600')}
                    style={{ width: `${failure}%` }}
                />
            </div>
          
        </div>
    );
};

export default ProgressBar;
