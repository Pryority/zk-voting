import React from "react";
import { useState, useCallBack, useEffect } from "react";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import abi from "../helpers/ZkVote.json";
import { ArrowPathRoundedSquareIcon, InformationCircleIcon } from '@heroicons/react/24/solid'
import HelpCreateProposal from './HelpCreateProposal'

const { ethers } = require("ethers");

export default function GroupStep({
  mainnetprovider,
  signer,
}) {
  const [loading, setLoading] = useState(false);
  const [Events, Setevents] = useState();
  const [NewEventName, SetNewEventName] = useState(null);
  const [NewEventDescription, SetNewEventDescription] = useState(null);
  const [EligibleVoters, SetEligibleVoters] = useState([""]);
  const [Coordinator, SetCoordinator] = useState(null);
  const [Fund, SetFund] = useState(null);
  const [isShowingCreateProposalHelp, setIsShowingCreateProposalHelp] = useState(false);
  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi.abi,
    signer
  );

  const updateEligibleVoters = (value, index) => {
    let eligibleVoters = [...EligibleVoters];
    eligibleVoters[index] = value;
    SetEligibleVoters(eligibleVoters);
  };

  const RemoveVoter = (index) => {
    let eligibleVoters = [...EligibleVoters];
    if (eligibleVoters.length <= 1) {
      return;
    }
    eligibleVoters.splice(index, 1);
    SetEligibleVoters(eligibleVoters);
  };

  const AddVoters = () => {
    let newVoters = [...EligibleVoters, ""];
    SetEligibleVoters(newVoters);
  };

  const toggle = () => {
    setIsShowingCreateProposalHelp(!isShowingCreateProposalHelp);
  }

  const CreateProposal = async () => {
    let proposals = [...EligibleVoters];

    const newproposals = proposals.map((val, index) => {
      if (val.length < 32) {
        return ethers.utils.formatBytes32String(val);
      }
      return val;
    });
    SetEligibleVoters(newproposals);
    console.log("EligibleVoters", EligibleVoters);
    await contract.NewVoteInstance(
      ethers.utils.formatBytes32String(NewEventName),
      NewEventDescription,
      EligibleVoters,
      Coordinator,
      20,
      0, { value: (Fund ? ethers.utils.parseEther(Fund).toString() : 0) }
    );
    SetCoordinator("");
    SetNewEventDescription("");
    SetNewEventName("");
    SetEligibleVoters("");
    SetFund("");
  };

  return (
    <div className="text-base md:text-lg leading-5 w-full relative min-h-screen justify-center items-center">
      <div className="absolute flex flex-col w-full justify-center items-center h-screen md:pt-0">
        <div className={`absolute bg-black/60 items-center h-screen w-full z-50 ${isShowingCreateProposalHelp ? 'flex' : 'hidden'}`}>
          <HelpCreateProposal toggle={toggle} />
        </div>
        {loading && <div className={`absolute bg-black/60 items-center h-screen w-full z-50 ${isShowingCreateProposalHelp ? 'flex' : 'hidden'}`}>
          <ArrowPathRoundedSquareIcon className="h-8 w-8 text-[#fcffff]" />
        </div>}
        <div
          className='backgrop-blur-lg bg-zinc-50 rounded-xl border w-1/2 mx-auto shadow p-4 flex flex-col space-y-4'
        >
          <div className="flex justify-between w-full">
            <div className="bg-stone-200/50 rounded-lg justify-center items-center px-2">
              <p className="tracking-tighter font-extrabold uppercase bg-gradient-to-r from-pink-700 via-pink-500 to-yellow-500 bg-clip-text text-transparent">
                Create a new Proposal
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
            className={`p-1 w-full rounded border border-pink-300/50 focus:ring-[2px] focus:outline-none focus:ring-pink-500 ${NewEventName ? 'focus:ring-lime-500 border-lime-300/50' : 'focus:pink-500'}  placeholder:text-sm`}
            placeholder="Enter the proposal name"
            value={NewEventName}
            onChange={(e) => SetNewEventName(e.target.value)}
          />
          <input
            className={`p-1 w-full rounded border border-pink-300/50 focus:ring-[2px] focus:outline-none focus:ring-pink-500 ${NewEventDescription ? 'focus:ring-lime-500 border-lime-300/50' : 'focus:pink-500'}  placeholder:text-sm`}
            placeholder="Enter Description of Voting "
            value={NewEventDescription}
            onChange={(e) => SetNewEventDescription(e.target.value)}
          />
          <div className="">
            {EligibleVoters.map((voter, index) => (
              <div className="flex items-center justify-between" key={index}>
                <input
                  placeholder="Enter address"
                  value={voter}
                  onChange={(e) => updateEligibleVoters(e.target.value, index)}
                  className={`p-1 w-full rounded border border-pink-300/50 focus:ring-[2px] focus:outline-none focus:ring-pink-500 ${voter ? 'focus:ring-lime-500 border-lime-300/50' : 'focus:pink-500'}  placeholder:text-sm`}
                />
                <div className="flex space-x-2 justify-center p-4">
                  {index >= 0 && (
                    <button
                      className="flex justify-center items-center"
                      onClick={() => {
                        RemoveVoter(index);
                      }}
                    >
                      <DeleteOutlined />
                    </button>
                  )}
                  {index === EligibleVoters.length - 1 && (
                    <button
                      className="flex justify-center items-center"
                      onClick={() => {
                        AddVoters();
                      }}
                    >
                      <PlusOutlined />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="">
            <input
              placeholder="Coordinator"
              value={Coordinator}
              ensProvider={mainnetprovider}
              onChange={(e) => SetCoordinator(e.target.value)}
              className={`p-1 w-full rounded border border-pink-300/50 focus:ring-[2px] focus:outline-none focus:ring-pink-500 ${Coordinator ? 'focus:ring-lime-500 border-lime-300/50' : 'focus:pink-500'}  placeholder:text-sm`}
            />
          </div>
          <div className="">
            <input
              placeholder="Ether to distribute"
              value={Fund}
              onChange={e => SetFund(e.target.value)}
              className={`p-1 w-full rounded border border-pink-300/50 focus:ring-[2px] focus:outline-none focus:ring-pink-500 ${Fund ? 'focus:ring-lime-500 border-lime-300/50' : 'focus:pink-500'}  placeholder:text-sm`}
            />
          </div>
          <button
            className={`w-full ${NewEventName && NewEventDescription && Fund && EligibleVoters && Coordinator ? 'bg-green-500 border rounded-sm px-2 py-1 text-sm md:text-md lg:text-lg hover:bg-green-600 hover:animate-none transition ease-in-out duration-200 text-white cursor-pointer animate-pulse' : 'bg-red-500 border rounded-sm px-2 py-1 text-sm md:text-md lg:text-lg hover:bg-red-600/90 transition ease-in-out duration-200 text-white cursor-not-allowed'}`}
            onClick={async () => {
              // setLoading(true);
              await CreateProposal();
              // setLoading(false);
            }}
          >
            Create Proposal
          </button>
        </div>
      </div>
    </div>
  );

}
