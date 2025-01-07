"use client"
import { useEffect, useState } from "react";
import { useStrip } from "./striphook";
import { Stripe } from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js"
export default function Stripewrapper({ children }: { children: React.ReactNode }) {
const {startStrip}= useStrip()
    const [stripePromise, setStripePromise] = useState<Stripe | null>();

    useEffect(() => {
        const initializeStripe = async () => {
            const stripe = await startStrip();
            setStripePromise(stripe);
        };
        initializeStripe();
    }, []);


    return(
        <div className="">
        {stripePromise && <Elements stripe={stripePromise}>{children}</Elements>}</div>
    )
}