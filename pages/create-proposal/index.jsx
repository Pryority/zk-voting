import React, { useEffect, useState } from "react";
import { useProvider, useSigner } from "wagmi";
import abi from "../../helpers/ZkVote.json";
import GroupStep from "../../components/GroupStep";
import { Identity } from "@semaphore-protocol/identity";
const { ethers } = require("ethers");

export default function NewVote({ }) {
  const [_identity, _setidentity] = useState({});
  const [Contract, SetContract] = useState("");
  const { data: signer, isError, isLoading } = useSigner();
  const provider = useProvider();
  
  const getidentity = async () => {
    const identityCommitment =
      window.localStorage.getItem("identityCommitment");
    if (identityCommitment) {
      const identity = new Identity(identityCommitment);
      _setidentity(identity);
    }
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      abi.abi,
      signer,
      provider
    );

    SetContract(contract);
  };

  useEffect(() => {
    getidentity();
  }, []);

  if (!signer) {
    return (
      <div className="h-3/5 w-screen flex justify-center items-center">
        <h1 className="text-4xl font-bold">
          Connect your Wallet !!!
        </h1>
      </div>
    );
  }

  return (
    <div>
      {signer && Contract && _identity && (
        <GroupStep
          contract={Contract}
          signer={signer}
          identityCommitment={_identity}
        />
      )}
    </div>
  );
}
