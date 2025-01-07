import Logo from '@/components/global/logo'
import MaxWidthWrapper from '@/components/global/max-width-wrapper'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import React from 'react'
import { currentUser } from '@clerk/nextjs/server'
import { SignOutButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'

export default async function Navbar() {
    const user = await currentUser()

    return (
        <nav className="sticky z-[100] h-16 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg transition-all">
            <MaxWidthWrapper>
                <div className='flex h-16 items-center justify-between '>
                    <div className=" flex justify-start ml-0">
                        <Logo />
                    </div>
                    <div className="h-full flex items-center space-x-4">
                        {user ? (
                            <>

                                <Link href="/dashboard" className='ml-3'>
                                    <Button className='font-light shadow-md gap-2' variant="secondary">
                                        Dashboard <ArrowRight />
                                    </Button>
                                </Link>

                                <UserButton />
                            </>
                        ) : (
                            <>
                                <Link href="/pricing">
                                    <Button className='font-light shadow-md gap-2' variant="secondary">
                                        Pricing
                                    </Button>
                                </Link>
                                <Link href="/sign-in">
                                    <Button className='font-light shadow-md gap-2' variant="default">
                                        Sign in <ArrowRight />
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </MaxWidthWrapper>
        </nav>
    )
}
