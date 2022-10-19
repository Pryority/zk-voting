import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navigation() {
  const menus = [
    { tabName: "NEW PROPOSAL", pageName: "/create-proposal" },
    { tabName: "ACTIVE PROPOSAL", pageName: "/proposals" },
    { tabName: "VOTE", pageName: "/SelectId" },
    { tabName: "IDENTITY", pageName: "/" },
  ];
  const { pathname } = useRouter();
  console.log(pathname);

  return (
    <div className="grid grid-cols-4 w-full justify-center items-center">
      {menus.map((tab) => (
        <Link href={tab.pageName} key={tab.tabName}>
          <h2
            className={`font-semibold px-4 py-1 items-center cursor-pointer ${tab.tabName != 'IDENTITY' && 'hover:bg-gradient-to-r hover:from-yellow-500 hover:via-lime-500 hover:to-lime-400 hover:bg-[length:50%_2px] hover:bg-no-repeat hover:bg-bottom'}  ${tab.tabName === 'IDENTITY' && 'bg-lime-600  text-white border border-[#1e1e1e]/50 hover:bg-lime-400 hover:scale-105 transition ease-in-and-out duration-100 hover:text-zinc-900 rounded-md'} ${pathname === tab.pageName && tab.tabName != 'IDENTITY' ? "justify-center flex text-center bg-gradient-to-r from-lime-400 via-lime-500 to-yellow-500 bg-[length:50%_2px] bg-no-repeat bg-bottom" : "justify-center flex text-center "} `}
          >
            {tab.tabName}
          </h2>
        </Link>
      ))}
    </div>
  );
}
