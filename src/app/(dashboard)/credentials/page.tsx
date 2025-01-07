"use client";

import React, { useState } from "react";
import { DashboardPage } from "../_component/dashboardpage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useCredentials from "../hooks/usecredential";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";

export default function Page() {
    const { error, isPending, isUpdating, update, key } = useCredentials();
    const [isCredentialVisible, setIsCredentialVisible] = useState(false);

    // Toggle credential visibility
    const toggleVisibility = () => {
        setIsCredentialVisible((prev) => !prev);
    };

    // Handle error state
    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center text-red-500">
                    <p>Something went wrong. Please try again later.</p>
                </div>
            </div>
        );
    }

    // Handle pending state
    if (isPending) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoaderCircle className="text-yellow-500 animate-spin" size={48} />
            </div>
        );
    }

    // Main content
    return (
        <div>
            <DashboardPage
                title="Credentials"
                titleClassName="md:text-4xl sm:text-2xl"
                hideBackButton={true}
            >
                <div className="space-y-6">
                    {/* Description */}
                    <div className="text-md text-center text-foreground">
                        This is your credential used to trigger events. Do not share it with anyone.
                        If exposed, please change it immediately.
                    </div>

                    {/* Credential display with toggle */}
                    <div className="flex flex-col items-center space-y-2">
                        <label
                            htmlFor="credential"
                            className="text-sm font-medium text-gray-700"
                        >
                            Your Credential
                        </label>
                        <div className="relative w-full max-w-md">
                            {isCredentialVisible ? (
                                <Input
                                    id="credential"
                                    value={key}
                                    readOnly
                                    className="pr-10"
                                />
                            ) : (
                                <div className="text-center text-2xl font-extrabold bg-gray-50 border border-gray-300 rounded-md px-2 py-1">
                                    **** **** **** ***
                                </div>
                            )}
                            <Button
                                variant={"ghost"}
                                size={"icon"}
                                onClick={toggleVisibility}
                                aria-label={
                                    isCredentialVisible ? "Hide Credential" : "Show Credential"
                                }
                                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                            >
                                {isCredentialVisible ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Change button */}
                    <div className="flex justify-center">
                        <Button
                            onClick={() => update()}
                            disabled={isUpdating}
                            aria-busy={isUpdating}
                            className="w-full max-w-xs"
                        >
                            {isUpdating ? "Changing..." : "Change"}
                        </Button>
                    </div>
                </div>
            </DashboardPage>
        </div>
    );
}
