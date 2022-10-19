import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Navigation from "./Navigation";

export default function Header() {
  return (
    <div className="fixed top-0 left-0 w-full justify-between items-center bg-yellow/80 backdrop-blur-xl z-100 border-b">
      <div className="py-5 hidden">
        <Navigation />
      </div>
      <div className="p-4 flex justify-between items-center">
        <header
          className="flex text-xl md:text-3xl font-bold"
          color={"#fff"}
          _before={{
            content: '""',
            borderBottom: "2px solid #fff",
            flex: "1",
            margin: "auto 20px",
          }}
          _after={{
            content: '""',
            borderBottom: "2px solid #fff",
            flex: "1",
            margin: "auto 20px",
          }}
        >
          ZK-VOTE
        </header>
        <div>
          <ConnectButton
            className="font-light rounded-md bg-sky-300 hover:bg-violet-400 px-6 py-2 m-4 "
            onClick={() => connect()}
          />
        </div>
      </div>
    </div>
  );
}
