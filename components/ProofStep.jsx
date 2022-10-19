import React, { useEffect } from "react";
import { useState } from "react";
import { keccak256 } from "@ethersproject/solidity";
const { Group } = require("@semaphore-protocol/group");
import { useCallback } from "react";
import "react-datetime/css/react-datetime.css";

const { ethers } = require("ethers");
const {
  generateProof,
  packToSolidityProof,
} = require("@semaphore-protocol/proof");

export default function ProofStep({
  eve,
  identitycommitment,
  contract,
  signer,
}) {
  const [date, Setdate] = useState(new Date());

  const [Votes, SetVotes] = useState();
  const [EventData, SetEventData] = useState();
  const [Coordinator, SetCoordinator] = useState();
  const [Proposals, SetProposals] = useState([]);
  const [Position, SetPosition] = useState([]);
  const [RemainingVotes, SetRemainingVotes] = useState(100);
  const [NotEnoughVotes, SetNotEnoughVotes] = useState(false);
  const [Voting, SetVoting] = useState(false);
  const [Id, SetId] = useState();
  const [UpdateVotes, SetUpdateVotes] = useState(false);
  const [EndTime, SetEndTime] = useState();
  const [Time, SetTime] = useState();

  let BACKEND_URL = "https://zkvotebackend.herokuapp.com/";

  const getEvents = useCallback(async () => {
    if (!contract || !eve || eve?.length === 0) {
      return [];
    }

    console.log("eve", eve);
    const start = await contract.queryFilter(
      contract.filters.VoteStarts(eve[0].groupId)
    );

    console.log(start);
    console.log('CONTRACT', contract);
    return start.map((e) => ({
      groupId: e.args[0],
      time: e.args[1],
    }));
  }, [contract, eve]);

  useEffect(() => {
    async function updateEvents() {
      if (eve == 0 || !eve || eve?.length === 0 || !contract) {
        return null;
      } else {
        const events = await getEvents();
        SetEventData(events);

        const pollInstance = await contract.polls(
          ethers.BigNumber.from(eve[0].groupId).toString()
        );
        const coordinator = pollInstance.coordinator;
        SetCoordinator(coordinator);
        const endtime = pollInstance.endtime;
        console.log("endtime", ethers.BigNumber.from(endtime).toString());
        SetEndTime(ethers.BigNumber.from(endtime).toString());
        SetId(ethers.BigNumber.from(eve[0].groupId).toString());
        let z = await contract.getlatestVotes(
          ethers.BigNumber.from(eve[0].groupId).toString()
        );
        console.log("Votes", z);
        SetVotes(z);
      }
    }
    updateEvents();
  }, [eve, UpdateVotes, getEvents, contract]);

  useEffect(() => {
    if (eve == null) {
      return null;
    } else {
      let a = [];
      Votes &&
        Votes.map((val, index) => {
          console.log("val", val);
          a[index] = val.IndividualGrantee;
        });
      SetProposals(a);
      console.log("a", a);
    }
  }, [Votes, eve]);

  const getMembers = async () => {
    if (!contract) {
      return [];
    }
    const events = await contract.queryFilter(
      contract.filters.NewProposal(eve[0].groupId)
    );
    const members = await contract.queryFilter(contract.filters.MemberAdded());

    return events.map((e) => ({
      groupId: e.args[0],
      members: members
        .filter((m) => m.args[0].eq(e.args[0]))
        .map((m) => m.args[1].toString()),
    }));
  };

  const vote = async (proposals, position) => {
    SetVoting(true);
    let b = [];
    for (let i = 0; i < proposals.length; i++) {
      b[i] = proposals[i];
    }

    const mem = await getMembers();
    const group = new Group();
    group.addMembers(mem[0].members);
    let id = ethers.BigNumber.from(eve[0].groupId).toString();
    console.log('VALUE??!', ethers.utils.parseBytes32String(ethers.utils.formatBytes32String(eve[0].groupId)))
    console.log(
      "Keccak256 of vote",
      "b[0]",
      b[0],
      keccak256(["address"], [b[0]])
    );
    console.log('ID COMMITMENT', identitycommitment)
    const fullProof = await generateProof(
      identitycommitment,
      group,
      id,
      keccak256(["address"], [b[0]]),
      {
        zkeyFilePath: "/semaphore.zkey",
        wasmFilePath: "/semaphore.wasm",
      }
    );
    let ps = fullProof.publicSignals;
    let hash = ps.nullifierHash;
    const solidityProof = packToSolidityProof(fullProof.proof);
    let isvoted = await contract.nullifierHashes(hash);
    if (isvoted == true) {
      alert("Already Voted ser");
      SetVoting(false);
    } else {
      const { status } = await fetch(`${BACKEND_URL}vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposals,
          position,
          hash,
          id,
          solidityProof,
        }),
      });
      SetVoting(false);
      if (status == 200) {
        SetUpdateVotes(!UpdateVotes);
      }

      console.log("status", status);
      console.log("adf");
    }
  };

  const updatePosition = (index, position) => {
    let a = Position;
    a[index] = position;
    SetPosition(a);

    let total = 0;
    for (let i = 0; i < Position.length; i++) {
      total += Position[i] * Position[i];
    }
    SetRemainingVotes(100 - total > 0 ? 100 - total : <p>Not enough votes</p>);
    if (RemainingVotes < 0) {
      SetNotEnoughVotes(true);
    }
  };
  const handleChange = (newValue) => {
    console.log(newValue);
    console.log(Date.parse(new Date(newValue)));
    let time = (new Date(newValue).getTime() / 1000).toFixed(0);
    Setdate(time);
    console.log("Date", time);
  };

  const Unixtotime = (time) => {
    return new Date(time * 1000);
  };

  return (
    <div className="text-base md:text-lg leading-5 w-full relative min-h-screen justify-center items-center">
      <div className="absolute grid w-full justify-center items-center py-24">
        <div className="bg-[#fcffff] border shadow p-8 rounded-md flex flex-col space-y-8">
          {eve == 0 ? (
            <div>
              <h1>This ID does not exist</h1>
            </div>
          ) : (
            <>
              {eve && (
                <div
                  label={ethers.BigNumber.from(eve[0].groupId).toString()}
                  className='flex flex-col w-full items-center'
                >
                  <div className="flex w-full justify-between items-center">
                    <h3 className="text-xl">
                      Proposal ID:{" "}
                      {ethers.BigNumber.from(eve[0].groupId)
                        .toString()
                        .slice(0, 3) +
                        "..." +
                        ethers.BigNumber.from(eve[0].groupId).toString().slice(-3)}
                    </h3>
                    <h2 className="text-sm">
                      Created By: {contract.signer._address.substring(0, 5) + '...' + contract.signer._address.substring(contract.signer._address.length, contract.signer._address.length - 5)}
                    </h2>
                  </div>
                </div>
              )}
              <div className="flex justify-center space-x-16 w-full">

                {Votes &&
                  Votes.map((val, index) => {
                    console.log("PROPOSER", val.IndividualGrantee);
                    return (
                      <div
                        key={index}
                        className='grid grid-cols-2 justify-center items-center   w-full'>
                        <div label={val.IndividualGrantee}>
                          <p className="text-lg" key={index}>
                            <span className="uppercase p-1 px-2 tracking-tighter font-bold text-sky-800 rounded-lg bg-blue-300 border text-sm">You</span> ({val.IndividualGrantee.substring(0, 5) + '...' + val.IndividualGrantee.substring(val.IndividualGrantee, val.IndividualGrantee.length - 5)}):{" "}
                          </p>
                        </div>
                        {/* VOTE STEPPER */}
                        <div className="relative w-full justify-center items-center flex">
                          <input
                            className="w-[100px] border rounded p-1 absolute"
                            placeholder={Position[index] ? Position[index] * Position[index] : 0}
                            type={'number'}
                            value={Position[index]}
                            onChange={(e) =>
                              updatePosition(index, e.target.value)
                            }
                          />
                          {Position <= 0 ? (<p className="absolute text-zinc-800">Votes</p>) : ''}
                        </div>
                      </div>

                    );
                  })}
                {/* {
                  <p className="text-xl mb-5">
                    Remaining Votes: {RemainingVotes}
                  </p>
                } */}

                {EventData && EventData[0] && EventData[0].time != 0 ? (
                  <div className="">
                    {EventData && EventData[0] && EventData[0].time != 0 ? (
                      <p className="text-xl">
                        Start Time: <br />
                        {new Date(
                          Number(EventData[0].time) * 1000
                        ).toDateString()}{" "}
                        {new Date(
                          Number(EventData[0].time) * 1000
                        ).toLocaleTimeString()}
                      </p>
                    ) : (
                      <p className="text-xl">
                        <b>Start Time Status: </b>Not Started
                      </p>
                    )}

                    {EndTime != 0 ? (
                      <p className="text-xl">
                        End Time: {new Date(EndTime * 1000).toDateString()}{" "}
                        {new Date(EndTime * 1000).toLocaleTimeString()}
                      </p>

                    ) : (
                      <p className="text-xl">
                        <b>End Time Status : </b>Not Started
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <p className="text-sm">End Time</p>
                    <input
                      type={"datetime-local"}
                      onChange={(e) => {
                        const x = new Date(e.target.value);
                        console.log("New time", Date.parse(x).toString().substring(0, 10));
                        SetTime(Date.parse(x).toString().substring(0, 10));
                      }}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        {/* Modal overlay */}
        <div >
          {/* <ModalOverlay /> */}
          <section id="actions"
            className="grid grid-cols-3"
          >
            <div className="flex w-full p-8">
              <button
                className="px-4 w-full bg-teal-500  text-white border border-[#1e1e1e]/50 hover:bg-teal-400 transition ease-in-and-out duration-100 hover:text-zinc-800 rounded-md"
                onClick={async () => {
                  console.log("id", ethers.BigNumber.from(eve[0].groupId).toString());
                  console.log("Time", Time);
                  await contract.StartPoll(
                    ethers.BigNumber.from(eve[0].groupId).toString(),
                    Time
                  );
                }}
              >
                Start Poll
              </button>
            </div>
            <div className="flex w-full p-8">
              <button
                className="px-4 w-full bg-red-600  text-white border border-[#1e1e1e]/50 hover:bg-red-500 transition ease-in-and-out duration-100 hover:text-zinc-800 rounded-md"
                onClick={async () => {
                  await contract.disperse(ethers.BigNumber.from(eve[0].groupId).toString())
                }}
              >
                Disperse
              </button>
            </div>
            <div className="flex w-full p-8">
              <button
                className='px-4 w-full bg-lime-600  text-white border border-[#1e1e1e]/50 hover:bg-lime-400 transition ease-in-and-out duration-100 hover:text-zinc-800 rounded-md'
                // variant="ghost"
                isLoading={Voting}
                onClick={async () => {
                  console.log("Positions ", Position);
                  console.log("Proposals", Proposals);
                  vote(Proposals, Position);
                }}
                disabled={NotEnoughVotes}
              >
                Confirm Vote
              </button>
            </div>
          </section>
        </div>
      </div >
    </div >
  );
};