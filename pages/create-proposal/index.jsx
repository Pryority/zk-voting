import React, { useEffect, useState } from "react";
import { useSigner } from "wagmi";
import abi from "../../helpers/ZkVote.json";
import GroupStep from "../../components/GroupStep";
import { Identity } from "@semaphore-protocol/identity";
const { ethers } = require("ethers");

export default function NewVote({ }) {
  const [_identity, _setidentity] = useState();
  const [Contract, SetContract] = useState();
  const [Mainnetprovider, SetMainnetprovider] = useState();
  const { data: signer, isError, isLoading } = useSigner();
  useEffect(() => {
    const getidentity = async () => {
      const identitycommitment =
        window.localStorage.getItem("identitycommitment");
      if (identitycommitment) {
        const identity = new Identity(identitycommitment);
        _setidentity(identity);
      }
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        abi.abi,
        signer
      );
      const mainnetprovider = new ethers.providers.JsonRpcProvider(
        "https://eth-mainnet.g.alchemy.com/v2/gDhsVUBEe61W2Q0w40A7Jwr3ZVyJ_Mvo"
      );
      SetMainnetprovider(mainnetprovider);
      SetContract(contract);
    };
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
      {signer && Contract && _identity && Mainnetprovider && (
        <GroupStep
          contract={Contract}
          signer={signer}
          mainnetprovider={Mainnetprovider}
          identitycommitment={_identity}
        />
      )}
    </div>
  );
}
