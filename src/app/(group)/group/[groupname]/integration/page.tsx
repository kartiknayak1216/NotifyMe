"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { groupDetail } from "../../_server/server";
import { Heading } from "@/components/global/heading";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "@/components/ui/button";
import { BiShow, BiSolidHide } from "react-icons/bi";
import { LoaderCircle } from "lucide-react";

type Props = {
  params: Promise<{
    groupname: string;
  }>;
};

export default function Page({ params }: Props) {
  const [groupname, setGroupname] = useState<string | null>(null);
  const [useBearer, setUseBearer] = useState<boolean>(true)
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setGroupname(resolvedParams.groupname);
    };
    resolveParams();
  }, [params]);

  const { data,isLoading,error } = useQuery({
    queryKey: ["group-info", groupname],
    queryFn: () => groupDetail(groupname),
    enabled: !!groupname

  });

  if (!groupname) {
    return
  }
  if(isLoading){
    <LoaderCircle className="text-center animate-spin text-yellow-500"/>
  }

  if (!data?.data ||error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg font-medium text-red-500">Error loading data!</span>
      </div>
    );
  }

  const snippet = `
  await fetch("${process.env.NEXT_PUBLIC_WEB_URL}/api/v1/events", {
    method: "POST",
    body: JSON.stringify({
      category: "${data.data.name}", // your group name
      type: "Discord" | "Email",
      targetId: "", // DiscordId or EmailId
     data: {
        message: "Example payload message", // Replace with actual event data
        metadata: {
          key1: "value1", // Custom metadata
          key2: "value2"  // Add more as needed
        }
      }
    }),
    headers: {
      ${useBearer ? `Authorization: "Bearer ${data.data.user.secretKey}"` : `Authorization: "Bearer </YOUR_SECRET_KEY>"`}
      //Get secret key in credentials page
      //Never expose or share your Secret Key If expose you can change it in credentials settings
    }
  });
`;


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <section className="w-full bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 sm:px-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            {data.data.icon && (
              <div className="text-4xl flex items-center justify-center">
                {data.data.icon}
              </div>
            )}
            <Heading className="text-2xl font-semibold">{data.data.name}</Heading>


          </div>
        </div>
      </section>

      <div className="flex-1  px-4 py-6 sm:px-8  overflow-hidden w-screen lg:max-w-screen-lg">
        <div className="bg-gray-900 rounded-lg shadow-lg p-6 text-white w-full">
          <div className="flex items-center justify-between border-b border-gray-700 pb-4 mb-4">
            <span className="text-lg font-semibold">API Example</span>

            <div className="flex gap-4 items-center justify-between text-center">
              <span className="text-sm text-gray-400 sm:hide md:flex">NotifyMe.ts</span>
              <Button variant={"secondary"}
                onClick={() => setUseBearer(!useBearer)}
              >
                {useBearer ? <div className="flex flex-1"><BiSolidHide />
                  <div>Hide</div>
                </div> : <div className="flex flex-1"><BiShow />
                  <div>Show</div>
                </div>}
              </Button>
            </div>
          </div>
          <SyntaxHighlighter language="typescript" style={oneDark} >
            {snippet.trim()}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
}
