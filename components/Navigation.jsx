import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navigation() {
  const menus = [
    { tabName: "IDENTITY", pageName: "/" },
    { tabName: "NEW PROPOSAL", pageName: "/NewVote" },
    { tabName: "ACTIVE PROPOSAL", pageName: "/Activeproposals" },
    { tabName: "VOTE", pageName: "/SelectId" },
  ];
  const { pathname } = useRouter();
  console.log(pathname);

  return (
    <div className="flex bg-gray-800 justify-center items-center w-full px-5 rounded-2xl">
      {menus.map((tab) => (
        <Link href={tab.pageName} key={tab.tabName}>
          <h2
            className={`font-semibold px-4 py-1 w-full items-center cursor-pointer ${pathname === tab.pageName ? "bg-[#9CFF00]" : "bg-white"}`}
          >
            {tab.tabName}
          </h2>
        </Link>
      ))}
    </div>
  );
}
