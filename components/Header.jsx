import React from "react";
import Link from "next/link";
import Navigation from "./Navigation";

export default function Header() {
  return (
    <div className="fixed w-full items-center bg-[#fcffff]/60 backdrop-blur-xl z-50 border-b border-[#fcffff]">
      <div className="p-4 grid grid-cols-2 justify-center items-center w-full">
        <div className="flex justify-start">
          <Link href='/'>
            <header
              className="flex text-xl md:text-3xl font-bold cursor-pointer"
              color={"#fff"}
              _before={{
                content: "\"\"",
                borderBottom: "2px solid #fff",
                flex: "1",
                margin: "auto 20px",
              }}
              _after={{
                content: "\"\"",
                borderBottom: "2px solid #fff",
                flex: "1",
                margin: "auto 20px",
              }}
            >
              ZK-VOTE
            </header>
          </Link>
        </div>
        <div className="hidden md:flex w-full justify-center">
          <Navigation />
        </div>
      </div>
    </div>
  );
}
