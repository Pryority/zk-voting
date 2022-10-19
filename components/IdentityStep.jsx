import React, { useState, useCallback, useEffect } from "react";
import { Identity } from "@semaphore-protocol/identity";
import copy from "copy-to-clipboard";
import { useSigner } from "wagmi";
const { ethers } = require("ethers");
import { DocumentDuplicate } from '@heroicons/react/24/outline'
import { InformationCircleIcon } from '@heroicons/react/24/solid'
import SemaphoreIntro from './SemaphoreIntro'

export default function IdentityStep({ }) {
  const { data: signer, isError, isLoading } = useSigner();
  const [identity, setIdentity] = useState("");
  const [TrapdoorCopied, SetTrapdoorCopied] = useState(false);
  const [NullifierCopied, SetNullifierCopied] = useState(false);
  const [CommitmentCopied, SetCommitmentCopied] = useState(false);
  const [SecretString, SetSecretString] = useState();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  async function checkidentity() {
    const identityval = window.localStorage.getItem("identitycommitment");
    console.log("identityval", identityval);

    if (identityval) {
      const _identity = new Identity(identityval);
      setIdentity(_identity);
      window.localStorage.setItem("identitycommitment", _identity);
      console.log("_identity", _identity);
      console.log("Successfully loaded identity");
    } else {
      console.log("Create new identity");
      alert("Please create New Identity");
    }
  }

  const copyToClipboard = (text) => {
    copy(text);
  };

  const CreateDeterministicidentity = async (hash) => {
    const identitynew = new Identity(hash);
    setIdentity(identitynew);
    const publicid = identitynew.generateCommitment();
    let a = ethers.BigNumber.from(publicid).toString();
    console.log("identitycommitment", a);
    window.localStorage.setItem("identitycommitment", identitynew);
  };

  const toggle = () => {
    setIsOpen(!isOpen);
  }

  return (
    <div className="text-base md:text-lg leading-5 w-full relative min-h-screen justify-center items-center">
      <div className="absolute flex flex-col w-full justify-center items-center h-screen ">
        {isOpen ? (<div className="absolute bg-black/60 flex items-center h-screen w-full z-50">
          <SemaphoreIntro toggle={toggle} />
        </div>) : (<></>)}
        <div className="p-4 rounded-xl h-fit bg-zinc-50 flex flex-col sm:w-1/2 md:w-2/5 space-y-4 border">
          <div className="flex justify-between">
            <div className="bg-stone-200/50 rounded-lg justify-center items-center px-2">
              <p className="tracking-tighter font-extrabold uppercase bg-gradient-to-r from-pink-700 via-pink-500 to-yellow-500 bg-clip-text text-transparent">Claim Your Identity</p>
            </div>
            <div
              className="w-6 h-6 rounded-full ml-2 md:ml-0 bg-zinc-300 relative flex justify-center items-center cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="w-4 h-4 rounded-full bg-white relative flex justify-center items-center object-center">
                <InformationCircleIcon className="h-6 w-6 absolute object-center text-stone-900" />
              </div>
            </div>
          </div>
          <input
            className={`mb-5 p-1 rounded border border-pink-300/50 focus:ring-[2px] focus:outline-none focus:ring-pink-500 ${SecretString ? 'focus:ring-lime-500 border-lime-300/50' : 'focus:pink-500'}`}
            placeholder="Enter a secret message to generate Identity "
            value={SecretString}
            onChange={(e) => SetSecretString(e.target.value)}
          ></input>
          <div className="flex flex-col items-center justify-center w-full space-y-1">
            <button
              className={`w-full ${SecretString ? 'bg-green-500 border rounded-sm px-2 py-1 text-sm md:text-md lg:text-lg hover:bg-green-600 text-white cursor-pointer' : 'bg-red-500 border rounded-sm px-2 py-1 text-sm md:text-md lg:text-lg hover:bg-red-600/90 text-white cursor-not-allowed'}`}
              disabled={!SecretString}
              onClick={async () => {
                setLoading(true);
                const hash = await signer.signMessage(SecretString);
                CreateDeterministicidentity(hash);
                SetSecretString("");
                setLoading(false);
              }}
            >
              Create Deterministic Identity
            </button>
            <button
              className='w-full bg-[#fcffff] border border-stone-300 rounded-sm px-2 py-1 text-sm md:text-md lg:text-lg hover:bg-zinc-300 hover:border-[#fcffff] hover:text-gray-700 text-gray-600 cursor-pointer'
              onClick={async () => {
                await checkidentity();
              }}
            >
              Load Existing Identity
            </button>
          </div>
        </div>

      </div>
    </div >
  );
}

// <div flexGrow={1}>
//         {identity ? (
//           <div className="border shadow p-4 rounded-xl bg-red-500 h-full">
//             <ul>
//               <div className="mb-3">
//                 <p className="font-bold">
//                   Trapdoor (<b>Don&apos;t share this </b>) : {""}
//                 </p>
//                 {identity ? identity.getTrapdoor().toString() : ""}{" "}
//                 <div
//                   onClick={() => {
//                     SetTrapdoorCopied(true);
//                     copyToClipboard(identity.getTrapdoor().toString());
//                   }}
//                   className={TrapdoorCopied ? "bg-green-600" : "bg-blue-500"}
//                   aria-label="Copy Trapdoor"
//                 >
//                   <DocumentDuplicate />
//                 </div>
//               </div>

//               <div className="mb-3">
//                 <p className="font-bold">
//                   Nullifier (<b>Don&apos;t Share this </b>) :{""}
//                 </p>
//                 {identity ? identity.getNullifier().toString() : ""}{" "}
//                 <div
//                   onClick={() => {
//                     copyToClipboard(identity.getTrapdoor().toString());
//                     SetCommitmentCopied(true);
//                   }}
//                   className={CommitmentCopied ? "bg-green-600" : "bg-blue-500"}
//                   aria-label="Copy Commitment"
//                 >
//                   <DocumentDuplicate />
//                 </div>
//               </div>

//               <div>
//                 <p className="font-bold">
//                   Commitment (This is your Public ID) :{" "}
//                 </p>
//                 {identity ? identity.generateCommitment().toString() : " "}
//                 {"  "}
//                 {/* <b> This is your public ID</b>{" "} */}
//                 <b>
//                   <div
//                     onClick={() => {
//                       copyToClipboard(identity.getTrapdoor().toString());
//                       SetCommitmentCopied(true);
//                     }}
//                     className={CommitmentCopied ? "bg-green-600" : "bg-blue-500"}
//                     aria-label="Copy Commitment"
//                   >
//                     <DocumentDuplicate />
//                   </div>
//                 </b>
//               </div>
//             </ul>
//           </div>
//         ) : (
//           <div className="border shadow p-2 rounded-xl h-full bg-white justify-center items-center md:flex md:flex-row hidden">
//             {
//               loading ? (
//                 <h1>{'LOAAAADING (this needs a spinner)'}</h1>
//               ) : (
//                 <h1 className="text-sm">Create or Load an ID</h1>
//               )
//             }
//           </div>
//         )}
//       </div>