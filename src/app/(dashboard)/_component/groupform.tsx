"use client";

import React, { useEffect, useState } from "react";
import useGroup from "../hooks/useGroup";
import FormGenerator from "@/components/global/form/formgenerator";
import { ErrorMessage } from "@hookform/error-message";
import { LoaderCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const EMOJI_OPTIONS = [
    { emoji: "💰", label: "Money (Sale)" },
    { emoji: "👤", label: "User (Sign-up)" },
    { emoji: "🎉", label: "Celebration" },
    { emoji: "📅", label: "Calendar" },
    { emoji: "🚀", label: "Launch" },
    { emoji: "📢", label: "Announcement" },
    { emoji: "🎓", label: "Graduation" },
    { emoji: "🏆", label: "Achievement" },
    { emoji: "💡", label: "Idea" },
    { emoji: "🔔", label: "Notification" },
];

export default function Groupform() {
    const { errors, onSubmit, register, setValues, isPending } = useGroup();
    const [iconValue, setIconValue] = useState("🚀");

    useEffect(() => {
        setValues("icon", iconValue);
    }, [iconValue]);

    return (
        <form className="space-y-6 mt-6 " onSubmit={onSubmit}>
            <FormGenerator
                key="name-field"
                inputType="input"
                register={register}
                label="Group Name"
                name="name"
                error={errors}
                type="text"
            />

            <div>
                <Label>Emoji</Label>
                <div className="flex flex-wrap gap-3">
                    {EMOJI_OPTIONS.map(({ emoji, label }) => (
                        <button
                            key={emoji}
                            type="button"
                            className={cn(
                                "size-10 flex items-center justify-center text-xl rounded-md transition-all",
                                iconValue === emoji
                                    ? "bg-brand-100 ring-2 ring-brand-700 scale-110"
                                    : "bg-brand-100 hover:bg-brand-200"
                            )}
                            onClick={() => setIconValue(emoji)}
                            aria-label={label}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>

                <ErrorMessage
                    errors={errors}
                    name="icon"
                    render={({ message }) => (
                        <p className="text-sm text-red-500 mt-1">
                            {message || "Please select an icon."}
                        </p>
                    )}
                />
            </div>

            <Button type="submit" disabled={isPending} className="relative w-full">
                {isPending ? (
                    <span className="flex items-center justify-center">
                        <LoaderCircleIcon className="w-5 h-5 text-yellow-400 animate-spin" />
                        <span className="ml-2">Creating...</span>
                    </span>
                ) : (
                    "Create Group"
                )}
            </Button>
        </form>
    );
}
