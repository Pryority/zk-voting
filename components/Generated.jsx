import { DocumentDuplicateIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react'

export default function Generated({ identity }) {
    const [loading, setLoading] = useState(false);
    const [TrapdoorCopied, SetTrapdoorCopied] = useState(false);
    const [NullifierCopied, SetNullifierCopied] = useState(false);
    const [CommitmentCopied, SetCommitmentCopied] = useState(false);

    const getSetNullifier = () => {
        SetNullifierCopied(true);
        copyToClipboard(identity.getNullifier().toString());
    }
    const getSetTrapdoor = () => {
        copyToClipboard(identity.getTrapdoor().toString());
        SetTrapdoorCopied(true);
    }
    const getSetCommitment = () => {
        copyToClipboard(identity.generateCommitment().toString());
        SetCommitmentCopied(true);
    }

    return (
        <div>
            {identity ? (
                <div className="border shadow p-4 rounded-xl bg-red-500 h-full">
                    <div className="mb-3">
                        <p className="font-bold">
                            Nullifier (<b>Don&apos;t share this </b>) : {""}
                        </p>
                        {identity ? identity.getNullifier().toString() : ""}{" "}
                        <div
                            onClick={getSetNullifier}
                            className={NullifierCopied ? "bg-green-600" : "bg-blue-500 h-16 w-16 justify-center items-center flex rounded"}
                            aria-label="Copy Trapdoor"
                        >
                            <DocumentDuplicateIcon className='w-8 h-8 text-white' />
                        </div>
                    </div>

                    <div className="mb-3">
                        <p className="font-bold">
                            Nullifier (<b>Don&apos;t Share this </b>) :{""}
                        </p>
                        {identity ? identity.getTrapdoor().toString() : ""}{" "}
                        <div
                            onClick={getSetTrapdoor}
                            className={TrapdoorCopied ? "bg-green-600" : "bg-blue-500 h-16 w-16 justify-center items-center flex rounded"}
                            aria-label="Copy Commitment"
                        >
                            <DocumentDuplicateIcon className='w-8 h-8 text-white' />
                        </div>
                    </div>

                    <div>
                        <p className="font-bold">
                            Commitment (This is your Public ID) :{" "}
                        </p>
                        {identity ? identity.generateCommitment().toString() : " "}
                        {"  "}
                        <div
                            onClick={getSetCommitment}
                            className={CommitmentCopied ? "bg-green-600" : "bg-blue-500 h-16 w-16 justify-center items-center flex rounded"}
                            aria-label="Copy Commitment"
                        >
                            <DocumentDuplicateIcon className='w-8 h-8 text-white' />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="border shadow p-2 rounded-xl h-full bg-white justify-center items-center md:flex md:flex-row hidden">
                    {loading ? (
                        <h1>{'LOAAAADING (this needs a spinner)'}</h1>
                    ) : (
                        <h1 className="text-sm">Create or Load an ID</h1>
                    )}
                </div>
            )}
            {/* {identity ? (
                <div className='flex flex-col'>
                    <p className="font-bold">
                        Commitment (This is your Public ID) :{" "}
                    </p>
                    {identity ? identity.generateCommitment().toString() : " "}
                    {"  "}
                    <div
                        onClick={getSetCommitment}
                        className={`relative ${CommitmentCopied ? "bg-green-600" : "bg-blue-500 h-16 w-16 justify-center items-center flex rounded"}`}
                    >
                        <DocumentDuplicateIcon />
                    </div>
                </div>
            ) : 'meh'} */}
        </div>
    )
};
