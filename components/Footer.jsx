import React from 'react'
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Footer() {
    return (
        <div className="fixed bottom-0 left-0 w-full justify-between items-center bg-zinc-50/80 p-1 backdrop-blur-xl z-50 border-b">
            <div className="flex justify-end md:col-span-2">
                <ConnectButton
                    className="font-light rounded-md bg-sky-300 hover:bg-violet-400 px-6 py-2 m-4 "
                    onClick={() => connect()}
                />
            </div>
        </div>
    )
}
