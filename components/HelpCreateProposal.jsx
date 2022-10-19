import { XCircleIcon } from "@heroicons/react/24/solid";

import React from "react";

export default function HelpCreateProposal({ toggle }) {

  return (
    <div className='backdrop-blur-lg bg-[#fcffff] rounded border border-[#fcffff] p-4 text-base md:text-lg leading-5 mx-auto shadow flex flex-col w-5/6 md:w-1/2'>
      <div className="flex w-full justify-end text-stone-500 transition ease-in-out duration-200 hover:text-stone-600">
        <XCircleIcon className="h-6 w-6 cursor-pointer" onClick={toggle} />
      </div>
      <header className="mb-5 font-medium"> How does ZK-VOTE work ?</header>
      <div>
        <p>
          <span className="font-semibold">Semaphore</span> is a <span className="italic">zero-knowledge protocol</span> that allows users to prove their
          membership in a group and send signals such as votes or endorsements
          without revealing their identity.
          <br></br>
          <br></br>
          Additionally, it provides a simple
          mechanism to prevent double-signaling.
        </p>
        <ul>
          <br></br>
          <li className="mb-2 mx-8">- Create or load an identity!</li>
          <li className="mb-2 mx-8">
            - Create a new Vote Proposal or voting on an existing Proposal.
          </li>
        </ul>
      </div>
    </div>
  );
}
