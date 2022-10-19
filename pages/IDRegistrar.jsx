import React from "react";
import IdentityStep from "../components/IdentityStep";
import { useState, useEffect } from "react";

export default function Identity({ }) {
  const [_identity, _Setidentity] = useState();
  return (
    <div className="flex flex-col min-h-screen justify-center items-center">
      {/* <div className="flex flex-col h-full items-center justify-center space-y-2 w-5/6"> */}
      <IdentityStep />
      {/* </div> */}
    </div>
  );
}
