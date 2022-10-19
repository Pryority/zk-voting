import React from "react";
import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div className="bg-[#fcfff]">
      <Header />
      <div>{children}</div>
    </div>
  );
}
