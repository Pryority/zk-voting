import React, { useState, useCallback, useEffect } from "react";
import { Identity } from "@semaphore-protocol/identity";
import copy from "copy-to-clipboard";
import { useSigner } from "wagmi";
const { ethers } = require("ethers");
import { DocumentDuplicate } from '@heroicons/react/24/outline'
import { InformationCircleIcon } from '@heroicons/react/24/solid'

export default function IdentityStep({ }) {
  const { data: signer, isError, isLoading } = useSigner();
  const [identity, setIdentity] = useState("");
  const [TrapdoorCopied, SetTrapdoorCopied] = useState(false);
  const [NullifierCopied, SetNullifierCopied] = useState(false);
  const [CommitmentCopied, SetCommitmentCopied] = useState(false);
  const [SecretString, SetSecretString] = useState();
  const [loading, setLoading] = useState(false);
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

  return (
    <div className="backdrop-blur-lg bg-purple-500 rounded border border-[#fcffff] p-4 text-base md:text-lg leading-5 mx-auto shadow mt-[70px]">
      <div className="border border-[#fff] shadow p-4 rounded-xl h-fit bg-yellow-500 flex flex-col">
        <div className="flex justify-between">
          <header className="mb-5 tracking-tighter font-bold uppercase">Claim Your Identity</header>
          <InformationCircleIcon className="h-4 w-4" />
        </div>
        <input
          className="mb-5 p-1 rounded border border-orange"
          placeholder="Enter a secret message to generate Identity "
          value={SecretString}
          onChange={(e) => SetSecretString(e.target.value)}
        ></input>
        <button
          className={`${SecretString ? 'bg-green-500 border rounded-sm px-2 py-1 text-sm md:text-md lg:text-lg hover:bg-green-600 text-white cursor-pointer' : 'bg-red-500 border rounded-sm px-2 py-1 text-sm md:text-md lg:text-lg hover:bg-red-600  text-white cursor-not-allowed'}`}
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
          className='ml-5'
          onClick={async () => {
            await checkidentity();
          }}
        >
          Load Existing Identity
        </button>
      </div>
      <div flexGrow={1}>
        {identity ? (
          <div className="border shadow p-4 rounded-xl bg-red-500 h-full">
            <ul>
              <div className="mb-3">
                <p className="font-bold">
                  Trapdoor (<b>Don&apos;t share this </b>) : {""}
                </p>
                {identity ? identity.getTrapdoor().toString() : ""}{" "}
                <div
                  onClick={() => {
                    SetTrapdoorCopied(true);
                    copyToClipboard(identity.getTrapdoor().toString());
                  }}
                  className={TrapdoorCopied ? "bg-green-600" : "bg-blue-500"}
                  aria-label="Copy Trapdoor"
                >
                  <DocumentDuplicate />
                </div>
              </div>

              <div className="mb-3">
                <p className="font-bold">
                  Nullifier (<b>Don&apos;t Share this </b>) :{""}
                </p>
                {identity ? identity.getNullifier().toString() : ""}{" "}
                <div
                  onClick={() => {
                    copyToClipboard(identity.getTrapdoor().toString());
                    SetCommitmentCopied(true);
                  }}
                  className={CommitmentCopied ? "bg-green-600" : "bg-blue-500"}
                  aria-label="Copy Commitment"
                >
                  <DocumentDuplicate />
                </div>
              </div>

              <div>
                <p className="font-bold">
                  Commitment (This is your Public ID) :{" "}
                </p>
                {identity ? identity.generateCommitment().toString() : " "}
                {"  "}
                {/* <b> This is your public ID</b>{" "} */}
                <b>
                  <div
                    onClick={() => {
                      copyToClipboard(identity.getTrapdoor().toString());
                      SetCommitmentCopied(true);
                    }}
                    className={CommitmentCopied ? "bg-green-600" : "bg-blue-500"}
                    aria-label="Copy Commitment"
                  >
                    <DocumentDuplicate />
                  </div>
                </b>
              </div>
            </ul>
          </div>
        ) : (
          <div className="border shadow p-4 rounded-xl h-full bg-orange-500 justify-center items-center md:flex md:flex-row hidden">
            {
              loading ? (
                <h1>{'LOAAAADING (this needs a spinner)'}</h1>
              ) : (
                <h1 className="text-3xl">Please Generate your Identity</h1>
              )
            }
          </div>
        )}
      </div>
    </div >
  );
}
