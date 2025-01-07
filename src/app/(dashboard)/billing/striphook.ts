import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"
import {loadStripe, StripeCardElement} from "@stripe/stripe-js"
import { useRouter } from "next/navigation"
import { increaseQuota, onGetStripeClientSecret,getQuotaserver } from "./server"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { useEffect, useState } from "react"

export const useStrip = () => {

const startStrip=async()=>{
    const isLoaded = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISH_KEY as string)
 return isLoaded
}
return{startStrip}
}

export const usePayment = () => {
    const router = useRouter();
    const stripe = useStripe();
    const elements = useElements();
    const [quota, setQuota] = useState<number | undefined>();
    const { mutate: getQuota, isPending: quotapending, error } = useMutation({
        mutationFn: () => getQuotaserver(),
        onSuccess: (data) => setQuota(data?.data?.count || 0),
    });

    useEffect(() => {
        getQuota();
    }, []);

    const { data: Intent, isPending: creatingIntent } = useQuery({
        queryKey: ["payment-intent"],
        queryFn: () => onGetStripeClientSecret(),
    });

    const { mutateAsync: increaseQuotas, isPending } = useMutation({
        mutationFn: async () => {
            if (!stripe || !elements || !Intent) {
                return toast("Error", {
                    description: "Stripe is not initialized or missing payment intent.",
                });
            }

            const { error, paymentIntent } = await stripe.confirmCardPayment(Intent.secret!, {
                payment_method: {
                    card: elements.getElement(CardElement) as StripeCardElement,
                },
            });

            if (error) {
                console.error(error);
                return toast("Error", {
                    description: "Oops! Something went wrong, try again later.",
                });
            }

            if (paymentIntent?.status === "succeeded") {
                const response = await increaseQuota();
                if (response?.status === 200) {
                    toast.success("Payment done sucessfuly")
                    getQuota();
                } else {
                    return toast("Error", {
                        description: "Oops! Something went wrong, try again later.",
                    });
                }
            }
        },
    });

    return {
        Intent,
        isPending,
        creatingIntent,
        increaseQuotas,
        getQuota,
        quotapending,
        error,
        quota,
    };
};

