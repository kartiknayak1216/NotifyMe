"use client"
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogHeader,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import useGroup from '../hooks/useGroup';
import { LoaderCircle } from 'lucide-react';

export default function DeleteButton({
    id,
    name,
    open,
    setOpen,
}: {
    id: string;
    name: string;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}) {
    const [confirm, setConfirm] = useState<string>();
    const { DeleteMutate, isDeleting } = useGroup();

    useEffect(()=>{
        console.log(name,confirm)
    },[confirm])
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        <span>If you delete this group, you will not be able to recover it.</span>
                        <div className="flex flex-col py-4 gap-2">
                            <span>
                                To confirm, type: <b>{name}</b>
                            </span>
                            <Input
                                value={confirm}
                                placeholder="Enter workflow name"
                                onChange={(e) => setConfirm(e.target.value)}
                            />
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={isDeleting || name !== confirm}
                        onClick={() => {
                            DeleteMutate({ groupId: id });
                        }}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isDeleting ? (
                            <LoaderCircle className="animate-spin text-yellow-500" />
                        ) : (
                            <div>delete</div>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
