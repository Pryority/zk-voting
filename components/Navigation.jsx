import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navigation() {
  const menus = [
    { tabName: "PROPOSE", pageName: "/create-proposal" },
    { tabName: "VOTE", pageName: "/SelectId" },
    { tabName: "IDENTITY", pageName: "/" },
  ];
  const { pathname } = useRouter();

  return (
    <div className="grid grid-cols-3 w-full justify-center items-center">
      {menus.map((tab) => (
        <Link href={tab.pageName} key={tab.tabName}>
          <h2
            className={`font-semibold px-4 py-1 items-center cursor-pointer ${tab.tabName != "IDENTITY" && "hover:bg-gradient-to-b hover:from-yellow-400  hover:bg-[length:50%_2px] hover:bg-no-repeat hover:bg-bottom"}  ${tab.tabName === "IDENTITY" && "bg-yellow-600/40  text-yellow-900 border border-[#1e1e1e]/50 hover:bg-yellow-400 hover:scale-[1.01] transition ease-in-and-out duration-100 hover:text-zinc-900 rounded-md"} ${pathname === tab.pageName && tab.tabName != "IDENTITY" ? "justify-center flex text-center bg-gradient-to-b from-black/80 bg-[length:50%_2px] bg-no-repeat bg-bottom" : "justify-center flex text-center "} `}
          >
            {tab.tabName}
          </h2>
        </Link>
      ))}
    </div>
  );
}
