"use client";
import React, { useState, useEffect } from 'react';
import MaxWidthWrapper from '@/components/global/max-width-wrapper';
import { isAuth } from './server';
import { useRouter } from 'next/navigation';
import { LoaderCircleIcon } from 'lucide-react';

export default function Page() {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    const isAuthClient = async () => {
        try {
            const res = await isAuth();
            if (res.status === 200) {
                router.push("/dashboard");
            } else {
                setError(true);
            }
        } catch (err) {
            console.error("Authentication error:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        isAuthClient();
    }, []); 

    if (error) {
        return (
            <div className="relative py-24 sm:py-32 bg-brand-25">
                <MaxWidthWrapper className="text-center">
                    <div className="text-center text-2xl font-semibold text-red-600 mt-3">
                        An unexpected error occurred. Please contact support.
                    </div>
                </MaxWidthWrapper>
            </div>
        );
    }

    return (
        <div className="relative py-24 sm:py-32 bg-brand-25">
            <MaxWidthWrapper className="text-center">
                {loading ? (
                    <div className="flex flex-col gap-y-2 items-center justify-center">
                        <div className="text-center text-2xl font-semibold text-brand-600 mt-3">
                            Preparing your dashboard
                        </div>
                        <LoaderCircleIcon size={25} className="animate-spin text-yellow-400" />
                    </div>
                ) : <></>}
            </MaxWidthWrapper>
        </div>
    );
}
