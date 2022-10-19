import React, { useState } from "react";
import { Identity } from "@semaphore-protocol/identity";
import { useSigner } from "wagmi";
const { ethers } = require("ethers");
import { ArrowPathRoundedSquareIcon, InformationCircleIcon } from '@heroicons/react/24/solid'
import SemaphoreIntro from './SemaphoreIntro'
import Generated from '../components/Generated'

export default function IdentityStep({ }) {
  const { data: signer, isError, isLoading } = useSigner();
  const [identity, setIdentity] = useState("");
  // const [TrapdoorCopied, SetTrapdoorCopied] = useState(false);
  // const [NullifierCopied, SetNullifierCopied] = useState(false);
  // const [CommitmentCopied, SetCommitmentCopied] = useState(false);
  const [SecretString, SetSecretString] = useState();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  console.log(identity)

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
      <div className="absolute grid md:grid-cols-2 space-y-2 md:space-y-0 w-full justify-center items-center h-screen pt-24 md:pt-0">
        <div className={`absolute bg-black/60 items-center h-screen w-full z-50 ${isOpen ? 'flex' : 'hidden'}`}>
          <SemaphoreIntro toggle={toggle} />
        </div>
        {loading && <div className={`absolute bg-black/60 items-center h-screen w-full z-50 ${isOpen ? 'flex' : 'hidden'}`}>
          <ArrowPathRoundedSquareIcon className="h-8 w-8 text-[#fcffff]" />
        </div>}
        <div className="md:p-8">
          <div className="p-4 rounded-xl bg-zinc-50 flex flex-col justify-center items-center w-full space-y-4 border shadow">
            <div className="flex justify-between w-full">
              <div className="bg-stone-200/50 rounded-lg justify-center items-center px-2">
                <p className="tracking-tighter font-extrabold uppercase bg-gradient-to-r from-pink-700 via-pink-500 to-yellow-500 bg-clip-text text-transparent">
                  Claim Your Identity
                </p>
              </div>
              <div
                className="w-6 h-6 rounded-full ml-2 md:ml-0 bg-zinc-300 relative flex justify-center items-center cursor-pointer"
                onClick={toggle}
              >
                <div className="w-4 h-4 rounded-full bg-white relative flex justify-center items-center object-center transition ease-in-out duration-200 hover:bg-black">
                  <InformationCircleIcon className="h-6 w-6 absolute object-center text-stone-700 transition ease-in-out duration-200 hover:text-stone-50" />
                </div>
              </div>
            </div>
            <input
              className={`mb-5 p-1 w-full rounded border border-pink-300/50 focus:ring-[2px] focus:outline-none focus:ring-pink-500 ${SecretString ? 'focus:ring-lime-500 border-lime-300/50' : 'focus:pink-500'}`}
              placeholder="Enter a secret message to generate Identity "
              value={SecretString}
              onChange={(e) => SetSecretString(e.target.value)}
            />
            <div className="flex flex-col items-center justify-center w-full space-y-1">
              <button
                className={`w-full ${SecretString ? 'bg-green-500 border rounded-sm px-2 py-1 text-sm md:text-md lg:text-lg hover:bg-green-600 transition ease-in-out duration-200 text-white cursor-pointer' : 'bg-red-500 border rounded-sm px-2 py-1 text-sm md:text-md lg:text-lg hover:bg-red-600/90 transition ease-in-out duration-200 text-white cursor-not-allowed'}`}
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
        <div className="md:p-8">
          <Generated identity={identity} />
        </div>
      </div>
    </div>
  );
};