import React from "react";
import { useState, useCallBack, useEffect } from "react";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import AddressInput from "./EthComponents/AddressInput";
import abi from "../helpers/ZkVote.json";

const { ethers } = require("ethers");

export default function GroupStep({
  mainnetprovider,
  signer,
}) {
  const [Events, Setevents] = useState();
  const [NewEventName, SetNewEventName] = useState();
  const [NewEventDescription, SetNewEventDescription] = useState();
  const [Proposals, SetProposals] = useState([""]);
  const [Coordinator, SetCoordinator] = useState();
  const [Fund, SetFund] = useState(0);
  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi.abi,
    signer
  );

  const updateProposals = (value, index) => {
    let proposals = [...Proposals];
    proposals[index] = value;
    SetProposals(proposals);
  };

  const RemoveProposals = (index) => {
    let proposals = [...Proposals];
    proposals.splice(index, 1);
    SetProposals(proposals);
  };

  const AddProposals = () => {
    let newproposals = [...Proposals, ""];
    SetProposals(newproposals);
  };

  const CreateProposal = async () => {
    // let proposals = [...Proposals];

    // const newproposals = proposals.map((val, index) => {
    //   if (val.length < 32) {
    //     return ethers.utils.formatBytes32String(val);
    //   }
    //   return val;
    // });
    // SetProposals(newproposals);
    console.log("Proposals", Proposals);
    await contract.NewVoteInstance(
      ethers.utils.formatBytes32String(NewEventName),
      NewEventDescription,
      Proposals,
      Coordinator,
      20,
      0, { value: (Fund ? ethers.utils.parseEther(Fund).toString() : 0) }
    );
    SetCoordinator("");
    SetNewEventDescription("");
    SetNewEventName("");
    SetProposals("");
    SetFund("");
  };

  return (
    <div
      className='cr my-8 text-center'
    >
      <div
        className='backgrop-blur-lg bg-red-500 rounded-xl border w-1/2 mx-auto shadow p-4'
      >
        <header className="border-b pb-2 mb-5">
          Create a new vote
        </header>
        <input
          className="my-3"
          placeholder="Enter Vote proposal Name"
          value={NewEventName}
          onChange={(e) => SetNewEventName(e.target.value)}
        />
        <input
          className="my-3"
          placeholder="Enter Description of Voting "
          value={NewEventDescription}
          onChange={(e) => SetNewEventDescription(e.target.value)}
        />
        <div className="my-3">
          {Proposals.map((proposal, index) => (
            <div className="my-3 flex" key={index}>
              <input
                placeholder="Enter address"
                value={proposal}
                onChange={(e) => updateProposals(e.target.value, index)}
                className="my-3"
              />
              {index >= 0 && (
                <button
                  className="ml-5"
                  onClick={() => {
                    RemoveProposals(index);
                  }}
                >
                  <DeleteOutlined />
                </button>
              )}
              {index === Proposals.length - 1 && (
                <button
                  className="ml-5"
                  onClick={() => {
                    AddProposals();
                  }}
                >
                  <PlusOutlined />
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="my-3">
          <AddressInput
            placeholder="Coordinator"
            value={Coordinator}
            ensProvider={mainnetprovider}
            onChange={(e) => SetCoordinator(e)}
          />
        </div>
        <div className="my-3">
          <input
            placeholder="Ether to distribute"
            value={Fund}
            onChange={e => SetFund(e.target.value)}
          />
        </div>
        <button
          className="mt-3 bg-green-500 justify-center"
          onClick={async () => {
            await CreateProposal();
          }}
        >
          Create Proposal
        </button>
      </div>
    </div>
  );

}
