import { DocumentDuplicateIcon } from "@heroicons/react/24/solid";
import React, { useState } from "react";
import copy from "copy-to-clipboard";

export default function Generated({ identity }) {
  const [loading, setLoading] = useState(false);
  const [TrapdoorCopied, SetTrapdoorCopied] = useState(false);
  const [NullifierCopied, SetNullifierCopied] = useState(false);
  const [CommitmentCopied, SetCommitmentCopied] = useState(false);

  const getSetNullifier = () => {
    const nullifier = identity.getNullifier().toString();
    copyToClipboard(nullifier);
    console.log("🔐 - N U L L I F I E R - COPIED !", nullifier);
    SetNullifierCopied(true);
    SetTrapdoorCopied(false);
    SetCommitmentCopied(false);
  };
  const getSetTrapdoor = () => {
    const trapdoor = identity.getTrapdoor().toString();
    copyToClipboard(trapdoor);
    console.log("🔐 - T R A P D O O R - COPIED !", trapdoor);
    SetTrapdoorCopied(true);
    SetCommitmentCopied(false);
    SetNullifierCopied(false);
  };
  const getSetCommitment = () => {
    const idHash = identity.generateCommitment().toString();
    copyToClipboard(idHash);
    console.log("🔐 - I D  C O M M I T  H A S H - COPIED !", idHash);
    SetCommitmentCopied(true);
    SetTrapdoorCopied(false);
    SetNullifierCopied(false);
  };

  const copyToClipboard = (text) => {
    copy(text);
  };

  return (
    <div>
      {identity ? (
        <div className="border shadow p-4 rounded-xl bg-[#fcffff] h-full">
          <div className="mb-3">
            <p className="font-bold text-base">
                Nullifier - Do Not Share ⚠️
            </p>
            <div className='flex items-center w-full justify-center space-x-4'>
              <div className='h-28 w-28 tracking-widest leading-[14px] text-[12px] bg-stone-900 text-stone-50 justify-center items-center flex relative rounded-lg'>
                <div className='h-fit overflow-clip tracking-[2px] leading-[15px] text-[12px] font-bold justify-center items-center flex'>
                  <p className='break-all text-center'>{identity ? identity.getNullifier().toString() : ""}{""}</p>
                </div>
              </div>
              <div
                onClick={getSetNullifier}
                className={NullifierCopied ? "bg-green-600 hover:bg-green-600 copy-btn" : "bg-blue-500 hover:bg-blue-600 copy-btn"}
                aria-label="Copy Trapdoor"
              >
                <div className={`relative hover:scale-110 ${NullifierCopied ? "bg-green-600 hover:bg-green-600 copy-btn" : "bg-blue-500 hover:bg-blue-600 copy-btn"}`}
                >
                  <DocumentDuplicateIcon className='w-16 h-16 text-white' />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <p className="font-bold text-base">
                            Trapdoor - Do Not Share ⚠️
            </p>
            <div className='flex items-center w-full justify-center space-x-4'>
              <div className='h-28 w-28 tracking-widest leading-[14px] text-[12px] bg-stone-900 text-stone-50 justify-center items-center flex relative rounded-lg'>
                <div className='h-full w-full overflow-clip tracking-[2px] leading-[15px] text-[12px] font-bold justify-center items-center flex relative p-1'>
                  {/* <p className='break-all items-center text-center absolute flex w-full h-full'>{
                    identity ? identity.getTrapdoor().toString() : ""
                  }</p> */}
                  <p className='break-all items-center text-center absolute flex w-full h-full'>{identity.getTrapdoor().toString()}</p>                     
                </div>
              </div>
              <div
                onClick={getSetTrapdoor}
                className={TrapdoorCopied ? "bg-green-600 hover:bg-green-600 copy-btn" : "bg-blue-500 hover:bg-blue-600 copy-btn"}
                aria-label="Copy Commitment"
              >
                <div className={`relative hover:scale-110 ${TrapdoorCopied ? "bg-green-600 hover:bg-green-600 copy-btn" : "bg-blue-500 hover:bg-blue-600 copy-btn"}`}
                >
                  <DocumentDuplicateIcon className='w-16 h-16 text-white' />
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="font-bold text-base">
                            Commitment - Your Shareable ID ✅
            </p>
            <div className='flex items-center w-full justify-center space-x-4'>
              <div className='h-28 w-28 tracking-widest leading-[14px] text-[12px] bg-stone-900 text-stone-50 justify-center items-center flex relative rounded-lg'>
                <div className='h-fit overflow-clip tracking-[2px] leading-[15px] text-[12px] font-bold justify-center items-center flex'>
                  <p className='break-all text-center'> {identity ? identity.generateCommitment().toString() : ""}{" "}</p>
                </div>
              </div>
              <div
                onClick={getSetCommitment}
                className={CommitmentCopied ? "bg-green-600 hover:bg-green-600 copy-btn" : "bg-blue-500 hover:bg-blue-600 copy-btn"}
                aria-label="Copy Commitment"
              >
                <div className={`relative hover:scale-110 ${CommitmentCopied ? "bg-green-600 hover:bg-green-600 copy-btn" : "bg-blue-500 hover:bg-blue-600 copy-btn"}`}
                >
                  <DocumentDuplicateIcon className='w-16 h-16 text-white' />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="border shadow p-2 rounded-xl h-full bg-white justify-center items-center md:flex md:flex-row hidden">
          {loading ? (
            <h1>{"LOAAAADING (this needs a spinner)"}</h1>
          ) : (
            <h1 className="text-sm">Create or Load an ID</h1>
          )}
        </div>
      )}
    </div>
  );
};
