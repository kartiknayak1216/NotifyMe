import Link from 'next/link'
import React from 'react'

export default function Logo() {
    return (
        <div>
            <Link href="/">
                <div className="flex justify-center items-center gap-[0.8]">
                    <span className="text-2xl font-serif bg-gradient-to-r from-brand-500 to-brand-800 text-transparent bg-clip-text">
                        Notify
                    </span>
                    <span className="text-xl font-serif">Me.</span>
                </div>
                
            </Link>
        </div>
    )
}
