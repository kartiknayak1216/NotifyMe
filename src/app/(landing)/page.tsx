import { Heading } from "@/components/global/heading";
import MaxWidthWrapper from "@/components/global/max-width-wrapper";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <section className="relative py-24 sm:py-32 bg-brand-25">
        <MaxWidthWrapper className="text-center">
          <div className="relative mx-auto text-center flex flex-col items-center gap-10">
            <div>
              <Button variant="outline" className="mb-1 rounded-full px-4 py-2">
                <h2 className="text-center text-base font-semibold text-brand-600">
                  Integrate Actions
                </h2>
              </Button>
              <Heading>
                Get Real-time insights with us.
              </Heading>
              <div className="text-center text-2xl font-semibold text-brand-600 mt-3">
                Integrate Actions to get personal delivered messages
              </div>
              <blockquote className="mt-6 font-bold text-2xl italic text-muted-foreground max-w-2xl mx-auto">
                "Empower your workflows for seamless integration with Discord, Email, WhatsApp, enabling you to achieve more with less effort."
              </blockquote>
            </div>

            <div className="relative flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
              <button className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-brand-400 bg-[linear-gradient(110deg,#E1E9F6,45%,#C3D3ED,55%,#E1E9F6)] bg-[length:200%_100%] px-6 font-medium text-brand-900 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-white">
                <span className="font-semibold text-lg text-brand-700">Continue to Dashboard</span>
                <ArrowRight className="w-5 h-5 text-brand-700 ml-2" />
              </button>
            </div>

            <div className="mt-10 flex justify-center w-full">
              <Image
                src="/diagram.svg"
                width={800}
                height={800}
                alt="diagram"
                className="max-w-full h-auto rounded-lg object-contain"
              />
            </div>
          </div>
        </MaxWidthWrapper>
      </section>
      <section></section>
      <section></section>
      <section></section>
      <section></section>
    </>
  );
}
