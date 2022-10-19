import React from "react";
import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div className="bg-red-500">
      <Header />
      <div>{children}</div>
    </div>
  );
}
