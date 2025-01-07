"use client"

import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { groupDetail } from "../../_server/server";
import { Heading } from "@/components/global/heading";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useSearchParams } from "next/navigation";
export default function Grid() {


    const params = useSearchParams()
    const groupname = params.get("groupname")


    if (!groupname) {
        return
    }

    type Group = Awaited<ReturnType<typeof groupDetail>>;

    const { data } = useQuery({
        queryKey: ["group-info"],
        queryFn: () => groupDetail(groupname),
    }) as { data: Group };

    const snippet = `
  await fetch("http://localhost:3000/api/events", {
    method: "POST",
    body: JSON.stringify({
      category: "${data?.data?.name}", // your group name
      type: "Discord" | "Email",
      targetId: "", // DiscordId or EmailId
      data: {
        // Your event payload
      }
    }),
    headers: {
      Authorization: "Bearer <YOUR_API_KEY>"
    }
  });
  `;

    if (data.status !== 200) return <div className="text-center text-red-500 py-10">Error loading data!</div>;


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <section className="w-full bg-white shadow-sm border-b border-gray-200">
                <div className="container mx-auto px-4 py-4 sm:px-6 flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        {data?.data?.icon && (
                            <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                {data.data.icon}
                            </div>
                        )}
                        <Heading className="text-2xl font-semibold">{data?.data?.name}</Heading>
                    </div>
                </div>
            </section>

            {/* Code Snippet Section */}
            <div className="flex-1 container mx-auto px-4 py-6 sm:px-8">
                <div className="bg-gray-900 rounded-lg shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between border-b border-gray-700 pb-4 mb-4">
                        <span className="text-lg font-semibold">API Example</span>
                        <span className="text-sm text-gray-400">NotifyMe.ts</span>
                    </div>
                    <SyntaxHighlighter language="typescript" style={oneDark}>
                        {snippet.trim()}
                    </SyntaxHighlighter>
                </div>
            </div>
        </div>
    );
}