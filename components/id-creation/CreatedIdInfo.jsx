import { DocumentDuplicateIcon } from "@heroicons/react/24/solid";
import React, { useState } from "react";
import copy from "copy-to-clipboard";

export default function CreatedIdInfo({ identity }) {
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
          {/* NULLIFIER */}
          <div className="flex flex-col space-y-2 py-2">
            <p className="text-base font-light">
              Nullifier - <span className="text-red-600 font-medium">Do Not Share ⚠️</span>
            </p>
            <div className='flex items-center w-full justify-center space-x-4'>
              <div className='h-28 w-28 tracking-widest leading-[14px] text-[12px] bg-stone-900 text-stone-50 justify-center items-center flex relative rounded-lg'>
                <div className='h-fit overflow-clip tracking-[2px] leading-[15px] text-[12px] font-bold justify-center items-center flex'>
                  <p className='break-all text-center'>{identity ? identity.getNullifier().toString() : ""}{""}</p>
                </div>
              </div>
              <div
                onClick={getSetNullifier}
                className={`cursor-pointer transition-all ease-in-out duration-200 ${NullifierCopied ? "bg-green-600 hover:bg-green-600 copy-btn" : "bg-blue-500 hover:bg-blue-600 copy-btn"}`}
                aria-label="Copy Trapdoor"
              >
                <div className={`relative hover:scale-110 ${NullifierCopied ? "bg-green-600 hover:bg-green-600 copy-btn" : "bg-blue-500 hover:bg-blue-600 copy-btn"}`}
                >
                  <DocumentDuplicateIcon className='w-16 h-16 text-white' />
                </div>
              </div>
            </div>
          </div>

          {/* TRAPDOOR */}
          <div className="flex flex-col space-y-2 py-2">
            <p className="text-base font-light">
              Trapdoor - <span className="text-red-600 font-medium">Do Not Share ⚠️</span>
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
                className={`cursor-pointer transition-all ease-in-out duration-200 ${TrapdoorCopied ? "bg-green-600 hover:bg-green-600 copy-btn" : "bg-blue-500 hover:bg-blue-600 copy-btn"}`}
                aria-label="Copy Commitment"
              >
                <div className={`relative hover:scale-110 transition-all ease-in-out duration-200 ${TrapdoorCopied ? "bg-green-600 hover:bg-green-600 copy-btn" : "bg-blue-500 hover:bg-blue-600 copy-btn"}`}
                >
                  <DocumentDuplicateIcon className='w-16 h-16 text-white' />
                </div>
              </div>
            </div>
          </div>

          {/* COMMIT ID HASH */}
          <div className="flex flex-col space-y-2 py-2">
            <p className="text-base font-light">
              ID Commit Hash - <span className="text-green-600 font-medium">Share with others!</span>
            </p>
            <div className='flex items-center w-full justify-center space-x-4'>
              <div className='h-28 w-28 tracking-widest leading-[14px] text-[12px] bg-stone-900 text-stone-50 justify-center items-center flex relative rounded-lg'>
                <div className='h-fit overflow-clip tracking-[2px] leading-[15px] text-[12px] font-bold justify-center items-center flex'>
                  <p className='break-all text-center'> {identity ? identity.generateCommitment().toString() : ""}{" "}</p>
                </div>
              </div>
              <div
                onClick={getSetCommitment}
                className={`cursor-pointer transition-all ease-in-out duration-200 ${CommitmentCopied ? "bg-green-600 hover:bg-green-600 copy-btn" : "bg-blue-500 hover:bg-blue-600 copy-btn"}`}
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
