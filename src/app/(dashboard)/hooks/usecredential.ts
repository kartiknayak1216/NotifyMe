"use client"
import { useMutation } from "@tanstack/react-query";
import { getCredential, updateCredential } from "../_server/group";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function useCredentials() {
const router = useRouter()
const[key,setKey]= useState<string>()
    const { mutate, isPending,error } = useMutation({
        mutationFn: ()=>getCredential(),
      onSuccess:(data)=>{
setKey(data.data?.secretKey)
      }
    })
    useEffect(() => {
        mutate(); 
    }, [mutate]);

    const { mutate:update, isPending:isUpdating } = useMutation({
        mutationFn: () => updateCredential(),
        onSuccess: (data) => {
            if (data.status === 200) {
                setKey(data.data?.secretKey)
                toast.success('Credential  updated successfully');
                router.refresh()

            } else {
                toast.error('Failed to update Credential');
            }
        },
        onError: () => {
            toast.error('Failed to update Credential');
        },
    })

return{
    mutate,isPending,error,update,isUpdating,key
}
}