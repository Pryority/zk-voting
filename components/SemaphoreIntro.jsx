import React from "react";

export default function SemaphoreIntro() {
  return (
    <div className='backdrop-blur-lg bg-purple-500 rounded border border-[#fcffff] p-4 text-base md:text-lg leading-5 mx-auto shadow mt-[70px]'>
      <header className="mb-5"> How does ZK-VOTE work ?</header >
      <p>
        Semaphore is a zero-knowledge protocol that allows users to prove their
        membership in a group and send signals such as votes or endorsements
        without revealing their identity. Additionally, it provides a simple
        mechanism to prevent double-signaling.
        <ul>
          <li className="mb-2">Create or load an identity!</li>
          <li className="mb-2">
            Create a new Vote Proposal or voting on an existing Proposal.
          </li>
        </ul>
      </p>
    </div>
  );
}
