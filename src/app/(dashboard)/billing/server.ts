"use server"
import prisma from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    typescript: true,
    apiVersion: "2024-12-18.acacia",
});

export async function onGetStripeClientSecret() {
try{
    const payment = await stripe.paymentIntents.create({
        currency: "INR",
        amount: 999,
        automatic_payment_methods: {
            enabled: true,
        },
        description: "Test payment for product trial (export transaction)",
        shipping: {
            name: "John Doe",
            address: {
                line1: "123 Export Street",
                line2: "Suite 456",
                city: "Mumbai",
                state: "MH",
                postal_code: "400001",
                country: "IN",
            },
        },
    });


    if (payment) {
        return { secret: payment.client_secret };
    } else {
        return { status: 400, message: "Failed to load form" };
    }


}catch(error){
    return { status: 400, message: "Failed to load form" };

}
}

 export async function increaseQuota(){
     const currentYear = new Date().getFullYear();
     const currentMonth = new Date().getMonth() + 1
const user = await currentUser();
    if (!user) {
        return { status: 404 };
    }
     try{
         const dbuser = await prisma.user.findUnique({
             where: {
                 externalId: user.id
             }
         })
         if (!dbuser) {
             return { status: 404 };

         }
         await prisma.quota.upsert({
             where: {
                 userId_year_month: {
                     userId:dbuser.id,
                     year: currentYear,
                     month: currentMonth,
                 },
             },
             update: {
                 count: { increment:100 },
             },
             create: {
                 userId:dbuser.id,
                 year: currentYear,
                 month: currentMonth,
                 count: 100,
             },
         });
         return {status:200}
     }catch(error){
         console.log(error)

         return { status:500 };

     }
}
export async function getQuotaserver(){
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1
    const user = await currentUser();
    if (!user) {
        return { status: 404 };
    }
    try {
        const dbuser = await prisma.user.findUnique({
            where:{
                externalId:user.id
            }
        })
        if(!dbuser){
            return { status: 404 };

        }
      const data=  await prisma.quota.findUnique({
            where: {
                userId_year_month: {
                    userId: dbuser.id,
                    year: currentYear,
                    month: currentMonth,
                },
            },
          select:{count:true}
        });
        return{status:200, data:data}
    } catch (error) {
        return { status: 500 };

    }
}