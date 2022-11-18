import React, { useEffect, useState } from "react";
import { useNEXT_PUBLIC_CONTRACT_ADDRESS, useSigner } from "wagmi";
import abi from "../../helpers/ZkVote.json";
import GroupStep from "../../components/GroupStep";
import { Identity } from "@semaphore-protocol/identity";
const { ethers } = require("ethers");

export default function NewVote({ }) {
  const [_identity, _setidentity] = useState();
  const [Contract, SetContract] = useState();
  const { data: signer, isError, isLoading } = useSigner();
  const [NEXT_PUBLIC_CONTRACT_ADDRESS] = useNEXT_PUBLIC_CONTRACT_ADDRESS();
  
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
      NEXT_PUBLIC_CONTRACT_ADDRESS
    );
    // const mainnetNEXT_PUBLIC_CONTRACT_ADDRESS = new ethers.NEXT_PUBLIC_CONTRACT_ADDRESSs.JsonRpcNEXT_PUBLIC_CONTRACT_ADDRESS(
    //   "https://eth-mainnet.g.alchemy.com/v2/gDhsVUBEe61W2Q0w40A7Jwr3ZVyJ_Mvo"
    // );
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
