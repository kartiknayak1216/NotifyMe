"use server"
import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"


export const isValidUser=async(name:string)=>{
    const clerk = await currentUser()
    if (!clerk) {
        return { status: 404 }
    }
    try{
const isVlid= await prisma.groups.findUnique({
    where:{
      name_userId:{
        name:name,
        userId:clerk.id
      }
    }
})

if(isVlid){
    return { status: 200 }

}
else{
    return { status: 404 }

}
    } catch(error){
        console.log(error)
        return { status: 500 }
  
    }
}


export const userDetail=async()=>{
    const clerk = await currentUser()
    if (!clerk){
        return {status:404}
    }


}


export const  groupDetail=async(name:string|null)=>{
    const clerk = await currentUser()
    if (!clerk) {
        return { status: 404 }
    }
    try {

        if(!name){
            return { status: 404 }

        }
        const isVlid = await prisma.groups.findUnique({
            where: {
                name_userId: {
                    name: name,
                    userId: clerk.id
                }
            
            },
            include:{
                user:{
                   select:{
                    secretKey:true
                   }
                },
            
            }
        })

        if (isVlid) {
            return { status: 200,data:isVlid }

        }
        else {
            return { status: 404 }

        }
    } catch (error) {
        console.log(error)
        return { status: 500 }

    }
}