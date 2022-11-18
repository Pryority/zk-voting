import { DocumentDuplicateIcon } from "@heroicons/react/24/solid";
import React, { useState } from "react";
import copy from "copy-to-clipboard";

export default function Generated({ identity }) {
  const [loading, setLoading] = useState(false);
  const [TrapdoorCopied, SetTrapdoorCopied] = useState(false);
  const [NullifierCopied, SetNullifierCopied] = useState(false);
  const [CommitmentCopied, SetCommitmentCopied] = useState(false);

  const getSetNullifier = () => {
    SetNullifierCopied(true);
    copyToClipboard(identity.getNullifier().toString());
    SetTrapdoorCopied(false);
    SetCommitmentCopied(false);
  };
  const getSetTrapdoor = () => {
    copyToClipboard(identity.getTrapdoor().toString());
    SetTrapdoorCopied(true);
    SetCommitmentCopied(false);
    SetNullifierCopied(false);
  };
  const getSetCommitment = () => {
    copyToClipboard(identity.generateCommitment().toString());
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
              <div className='h-32 w-32 tracking-widest leading-[14px] text-[12px] bg-lime-200 justify-center items-center flex relative rounded-lg'>
                <div className='h-28 w-28 overflow-clip tracking-[2px] leading-[14px] text-[12px] font-bold justify-center items-center flex'>
                  <p className='break-all text-center'>{identity ? identity.getNullifier().toString() : ""}{" "}</p>
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
              <div className='h-32 w-32 tracking-widest leading-[14px] text-[12px] bg-lime-200 justify-center items-center flex relative rounded-lg'>
                <div className='h-24 w-24 overflow-clip tracking-[2px] leading-[14px] text-[12px] font-bold justify-center items-center flex'>
                  <p className='break-all text-center'> {identity ? identity.getTrapdoor().toString() : ""}{" "}</p>
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

              <div className='h-32 w-32 tracking-widest leading-[14px] text-[12px] bg-lime-200 justify-center items-center flex relative rounded-lg'>
                <div className='h-24 w-24 overflow-clip tracking-[2px] leading-[14px] text-[12px] font-bold justify-center items-center flex'>
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
