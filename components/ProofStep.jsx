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
  const { isOpen, onOpen, onClose } = useDisclosure();
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

    console.log(
      "Keccak256 of vote",
      "b[0]",
      b[0],
      keccak256(["address"], [b[0]])
    );
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
    <>
      <div className="bg-[#fcffff] p-8 rounded-md">
        {eve == 0 ? (
          <div>
            <h1>This Id does not exist</h1>
          </div>
        ) : (
          <div>
            {eve && (
              <div label={ethers.BigNumber.from(eve[0].groupId).toString()}>
                <h3 className="text-xl mb-4">
                  ID:{" "}
                  {ethers.BigNumber.from(eve[0].groupId)
                    .toString()
                    .slice(0, 10) +
                    "..." +
                    ethers.BigNumber.from(eve[0].groupId).toString().slice(-6)}
                </h3>
              </div>
            )}
            <div className="flex justify-between">
              <div>
                {Votes &&
                  Votes.map((val, index) => {
                    console.log("val proposals", val.IndividualGrantee);
                    return (
                      <div
                        key={index}
                        className='flex justify-center my-3 space-x-4'>
                        <div label={val.IndividualGrantee}>
                          <p className="text-lg">
                            {val.IndividualGrantee.slice(0, 5) +
                              "..." +
                              val.IndividualGrantee.slice(-5)}
                            :{" "}
                          </p>
                        </div>
                        <input
                          className="w-[100px]"
                          placeholder="Votes"
                          value={Position[index]}
                          onChange={(e) =>
                            updatePosition(index, e.target.value)
                          }
                        />
                        {" : "}
                        <p className="text-xl">
                          {isNaN(Position[index])
                            ? "0"
                            : Position[index] * Position[index]}{" "}
                        </p>
                      </div>
                    );
                  })}
                {
                  <p className="text-xl mb-5">
                    Remaining Votes: {RemainingVotes}
                  </p>
                }
              </div>
              {EventData && EventData[0] && EventData[0].time != 0 ? (
                <div className="pl-5">
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
                    <p mt={4} className="text-xl">
                      End Time: <br /> {new Date(EndTime * 1000).toDateString()}{" "}
                      {new Date(EndTime * 1000).toLocaleTimeString()}
                    </p>

                  ) : (
                    <p className="text-xl">
                      <b>End Time Status : </b>Not Started
                    </p>
                  )}
                </div>
              ) : (
                <div className="pl-5">
                  <label>End Time</label>
                  <input
                    type={"datetime-local"}
                    onChange={(e) => {
                      const x = new Date(e.target.value);
                      console.log("New time", Date.parse(x).toString().substring(0, 10));
                      SetTime(Date.parse(x).toString().substring(0, 10));
                    }}
                  />
                  <div className="flexm mt-5">
                    <button className="bg-teal-500 text-white"
                      onClick={async () => {
                        console.log("id", ethers.BigNumber.from(eve[0].groupId).toString());
                        console.log("Time", Time);
                        await contract.StartPoll(
                          ethers.BigNumber.from(eve[0].groupId).toString(),
                          Time
                        );
                      }}
                    >Start Poll</button>
                  </div>
                </div>
              )}
            </div>
            <button className="ml-5"
              onClick={async () => {
                await contract.disperse(ethers.BigNumber.from(eve[0].groupId).toString())
              }}
            >Disperse</button>
            <div className="flex w-full border-b-4" />
            <div
              className="flex justify-between items-center"
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <button className='w-full' onClick={onOpen}>
                Vote
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="backdrop-blur-lg bg-transparent rounded-xl p-4 border w-1/3 shadow mx-10 my-10 text-center">
        <div className="mb-5 text-sm bg-red-500">ID:{" "}
          {ethers.BigNumber.from(eve[0].groupId)
            .toString()
            .slice(0, 10) +
            "..." +
            ethers.BigNumber.from(eve[0].groupId).toString().slice(-6)}</div>

        <div>
          <div>
            <div>
              <div>
                <p>Proposer</p>
                <p>Votes</p>
              </div>
            </div>
            <div>
              {Votes &&
                Votes.map((val, index) => {
                  return (
                    <div key={index}>
                      <div>
                        <div label={val.IndividualGrantee}>
                          <p className="text-xl">
                            {val.IndividualGrantee.slice(0, 10) +
                              "..." +
                              val.IndividualGrantee.slice(-6)}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xl">
                          {ethers.BigNumber.from(val.votes).toString()} votes
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
      {/* Modal overlay */}
      <div className="" isCentered isOpen={isOpen} onClose={onClose}>
        {/* <ModalOverlay /> */}
        <div>
          <header>Confirm Your Vote</header>
          <button className="bg-red-500 text-white border px-4 py-2">CLOSE</button>
          <div>
            {Votes &&
              Votes.map((val, index) => {
                return (
                  <p className="text-xl" key={index}>
                    {val.IndividualGrantee}:{" "}
                    {Position[index] ? Position[index] * Position[index] : 0}{" "}
                    Votes
                  </p>
                );
              })}
          </div>

          <div>
            <button
              className="bg-teal-500 w-full"
              width={"100%"}
              // variant="ghost"
              isLoading={Voting}
              onClick={async () => {
                console.log("Positions ", Position);
                console.log("Proposals", Proposals);
                vote(Proposals, Position);
              }}
              disabled={NotEnoughVotes}
            >
              Vote
            </button>
          </div>
        </div>
      </div>
    </>
  );
};