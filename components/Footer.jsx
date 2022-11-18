import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Footer() {
  return (
    <div className="fixed bottom-0 w-full justify-between items-center p-1 backdrop-blur-xl z-5 border-b">
      <div className="flex w-full relative justify-center">
        <div className="flex justify-end md:col-span-2">
          <ConnectButton
            className="font-light rounded-md bg-sky-300 hover:bg-violet-400 px-6 py-2 m-4 "
            onClick={() => connect()}
          />
        </div>
      </div>
    </div>
  );
}
