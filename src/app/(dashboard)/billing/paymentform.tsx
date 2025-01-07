"use client";
import React from "react";
import { usePayment } from "./striphook";
import { Loader } from "@/components/global/loader";
import { CardElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CountUp from "react-countup";

export default function PaymentForm() {
    const {
        Intent,
        creatingIntent,
        increaseQuotas,
        isPending,
        getQuota,
        quotapending,
        error,
        quota,
    } = usePayment();

    return (
        <div className="flex flex-col items-center justify-center gap-8 px-4 py-6 max-w-lg mx-auto">
            <Loader loading={creatingIntent}>
                {!error && quota !== undefined && (
                    <Card className="w-full">
                        <CardHeader className="flex items-center justify-between pb-3 border-b">
                            <CardTitle className="text-lg font-semibold">
                                Your Monthly Quota
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center py-6">
                            <div className="text-3xl font-bold">
                                <CountUp end={quota} />
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card className="w-full">
                    <CardHeader className="pb-2">
                        <p className="text-sm">
                            Increase your monthly quota limit.
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                increaseQuotas();
                            }}
                        >
                            <div className="my-4">
                                <CardElement
                                    options={{
                                        style: {
                                            base: {
                                                fontSize: "16px",
                                                color: "#000000",
                                                "::placeholder": {
                                                    color: "#B4B0AE",
                                                },
                                            },
                                        },
                                    }}
                                    className="border rounded-md p-3 w-full"
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    variant="secondary"
                                    type="submit"
                                    className="px-4 py-2 rounded-md"
                                    disabled={isPending}
                                >
                                    <Loader loading={isPending}>Get Started</Loader>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </Loader>
        </div>
    );
}
