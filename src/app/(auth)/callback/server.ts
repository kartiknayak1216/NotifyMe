"use server"
import crypto from 'crypto';
import { currentUser } from "@clerk/nextjs/server";
import prisma from '@/lib/prisma';

const generateSecretKey = () => crypto.randomBytes(32).toString('hex');

 export const isAuth =async()=>{

   const user = await currentUser();
       if (!user) {
         
           return{status:404}
       } 

try{
    const existingUser = await prisma.user.findUnique({
        where: { externalId: user.id },
    });

    if (existingUser) {
      
        return{status:200}
    }

    const createUser = await prisma.user.create({
        data: {
            externalId: user.id,
            secretKey: generateSecretKey(),
        },
    });

    if (createUser) {
       
        return{status:200}
    }

 
    else{
        return{status:404}
    }
}catch(error){
console.log(error)
    return { status: 404 }

}

}