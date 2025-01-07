"use clent"
import { useMutation, useQuery, QueryClient, useQueryClient } from '@tanstack/react-query';
import { createGroup, createGroupMany, deleteGroup, getGroup } from '../_server/group';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Dispatch, SetStateAction, useState } from 'react';

export default function useGroup() {
    const client = useQueryClient();
    const groupForm = z.object({
        name: z.string().min(1, { message: 'Name is required' }),
        icon: z.string().min(1, { message: 'Icon is required' }),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset, setValue
    } = useForm<z.infer<typeof groupForm>>({
        resolver: zodResolver(groupForm),
        mode: 'onChange',
    });

    const { data: Groups, isLoading } = useQuery({
        queryKey: ['find-group'],
        queryFn: () => getGroup(),
    });

    const { mutate, isPending } = useMutation({
        mutationFn: ({ name, icon }: { name: string; icon: string }) => createGroup(name, icon),
        onSuccess: (data) => {
            if (data.status === 200) {
                toast.success('Group created successfully');
                reset();
            } else {
                toast.error('Failed to create group');
            }
        },
        onError: () => {
            toast.error('Failed to create group');
        },
        onSettled: async() => {
          return await client.invalidateQueries({ queryKey: ['find-group'] });
        },
    });

    const onSubmit = handleSubmit((value) => {
        mutate(value);
    });

const {mutate:DeleteMutate,isPending:isDeleting}= useMutation({
    mutationFn: ({groupId}:{groupId:string}) => deleteGroup(groupId),
     onSuccess: (data) => {
        if (data.status === 200) {
            toast.success('Group delete successfully');
            reset();
        } else {
            toast.error('Failed to delete group');
        }
    },
    onError: () => {
        toast.error('Failed to delete group');
    },
    onSettled: async () => {
        return await client.invalidateQueries({ queryKey: ['find-group'] });
    },
})

    const { mutate: createsMutate, isPending: isCreatings } = useMutation({
        mutationFn: () => createGroupMany([{ name: "Sales", icon: "💰" }, { name: "Revenu", icon: "🚀" }, { name: "User", icon: "🎉" }]),
     onSuccess: (data) => {
            if (data.status === 200) {
                toast.success('Group created successfully');
                reset();
            } else {
                toast.error('Failed to create group');
            }
        },
        onError: () => {
            toast.error('Failed to create group');
        },
        onSettled: async () => {
            return await client.invalidateQueries({ queryKey: ['find-group'] });
        },
   
    })

    return {
        onSubmit,
        Groups,
        isPending,
        isLoading,
        register,
        errors,
        setValues: setValue,DeleteMutate,isDeleting,createsMutate,isCreatings
    };
}
