import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navigation() {
  const menus = [
    { tabName: "IDENTITY", pageName: "/" },
    { tabName: "NEW PROPOSAL", pageName: "/NewVote" },
    { tabName: "ACTIVE PROPOSAL", pageName: "/proposals" },
    { tabName: "VOTE", pageName: "/SelectId" },
  ];
  const { pathname } = useRouter();
  console.log(pathname);

  return (
    <div className="grid grid-cols-4 w-full justify-center items-center">
      {menus.map((tab) => (
        <Link href={tab.pageName} key={tab.tabName}>
          <h2
            className={`font-semibold px-4 py-1 items-center cursor-pointer ${pathname === tab.pageName ? "justify-center flex text-center mx-8 bg-gradient-to-r from-lime-400 via-teal-500 to-green-500 bg-[length:100%_6px] bg-no-repeat bg-bottom" : "justify-center flex text-center"}`}
          >
            {tab.tabName}
          </h2>
        </Link>
      ))}
    </div>
  );
}
