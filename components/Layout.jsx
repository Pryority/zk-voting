import React from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="bg-[#fcfff]">
      <Header />
      <div>{children}</div>
      <Footer />
    </div>
  );
}
