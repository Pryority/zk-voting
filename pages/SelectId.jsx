import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
export default function SelectId() {
  const [Id, SetId] = useState();
  const router = useRouter();

  return (
    <div className="rounded-lg border p-2 mx-auto my-40 text-center">
      <header className="border-b pb-2 mb-5">
        {" "}
        Enter the proposal Id
      </header>
      <div className="mt-10">
        <input
          placeholder="Group Id you want to vote"
          value={Id}
          onChange={(e) => SetId(e.target.value)}
        />
        <button
          className="ml-5"
          onClick={() => {
            router.push({
              pathname: "/vote/" + Id,
              query: { GroupId: Id },
            });
          }}
        >
          Go
        </button>
      </div>
    </div>
  );
}
