import React from "react";
import abi from "../../helpers/ZkVote.json";
import { useState, useEffect } from "react";
import { Identity } from "@semaphore-protocol/identity";
import Link from "next/link";
import { useSigner } from "wagmi";
import TextArea from "antd/lib/input/TextArea";
const ethers = require("ethers");

export default function Activeproposals() {
  const { data: signer, isError, isLoading } = useSigner();
  const [Events, Setevents] = useState();
  const [NewVoter, SetNewVoter] = useState();
  const [_identity, _setidentity] = useState();
  const [loading, setLoading] = useState(false);
  async function getEvents() {
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_GOERLI_API
    );
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      abi.abi,
      provider
    );
    const identitycommitment =
      window.localStorage.getItem("identitycommitment");
    if (identitycommitment) {
      const identity = new Identity(identitycommitment);
      _setidentity(identity);
    }

    const events = await contract.queryFilter(contract.filters.NewProposal());
    const members = await contract.queryFilter(contract.filters.MemberAdded());
    const start = await contract.queryFilter(contract.filters.VoteStarts());

    return events.map((e) => ({
      groupId: e.args[0],
      eventName: e.args[1],
      members: members
        .filter((m) => m.args[0].eq(e.args[0]))
        .map((m) => m.args[1].toString()),
      coordinator: e.args[2],
      description: e.args[3],
      start: start.filter((m) => m.args[0].eq(e.args[0])).map((m) => m.args[1]),
      end: start.filter((m) => m.args[0].eq(e.args[0])).map((m) => m.args[2]),
    }));
  }

  useEffect(() => {
    setLoading(true);
    async function updateevents() {
      const events = await getEvents();
      Setevents(events);
    }
    updateevents();
    setLoading(false);
  }, []);

  if (!Events) {
    return (
      <div className="flex w-screen h-5/6 justify-center items-center">
        <h1>{'LOAAAADING (this needs a spinner)'}</h1>
      </div>
    );
  }

  return (
    <div className="text-base md:text-lg leading-5 w-full relative min-h-screen justify-center items-center">
      <div className="absolute grid md:grid-cols-2 w-full justify-center items-center py-24">
        {Events &&
          Events.map((value, i) => {
            let name = ethers.utils.parseBytes32String(value.eventName);
            let id = ethers.BigNumber.from(value.groupId).toString();
            console.log("id", id);
            console.log("GROUP ID", ethers.utils.formatBytes32String(value.groupId));
            let members = value.members;
            let isMember = false;
            let des = value.description;
            let admin = value.coordinator;
            for (let i = 0; i < members.length; i++) {
              console.log(
                "members",
                members[i],
                "identity",
                _identity?.generateCommitment().toString()
              );
              if (members[i] == _identity?.generateCommitment().toString()) {
                isMember = true;
              }
            }
            let currentstatus = "Created";

            let status =
              value.start.length != 0
                ? (currentstatus = "Live")
                : value.end.length != 0
                  ? (currentstatus = "Ended")
                  : (currentstatus = "Created");
            let a = isMember ? "You are a member" : "Not Member";

            return (
              <div
                className="h-full w-full flex justify-center p-2 text-zinc-900"
                key={i}
              >
                <div
                  className='border shadow p-4 w-full rounded-xl h-full'
                >
                  <header className="">
                    {name}
                  </header>
                  <p className="text-sm">
                    <span className="tracking-tighter">ID:</span> {id.substring(0, 18)}...
                  </p>
                  <div className="text-sm flex space-x-2 items-center">
                    <p className={`text-zinc-600 tracking-tighter`}>Status:</p>
                    <div className={`flex space-x-1 items-center ${status === 'Live' ? 'animate-pulse' : ''}`}>
                      <p className="font-bold">
                        {status}
                      </p>
                      {status === 'Live' && (<div className="w-2 h-2 rounded-full bg-red-500" />)}
                    </div>
                  </div>
                  <div className="flex w-full h-[100px] rounded p-4 border overflow-auto">
                    {des}
                  </div>
                  <div mb={5} display={"flex"}>
                    <button disabled>{a}</button>
                    <button className="ml-5">
                      <Link href={"vote/" + id}>
                        Open
                      </Link>
                    </button>
                  </div>
                  {signer && signer._address == admin ? (
                    <div>
                      <inpput
                        placeholder="Add voter credentials"
                        value={NewVoter}
                        onChange={(e) => SetNewVoter(e.target.value)}
                        className=''
                      />
                      <button
                        onClick={async () => {
                          if (!signer) {
                            alert("Please connect Wallet");
                          }
                          const contractwithsigner = new ethers.Contract(
                            process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
                            abi.abi,
                            signer
                          );
                          let arr = [];
                          console.log("newVoter", NewVoter);
                          arr.push(NewVoter);
                          console.log("arr", arr);
                          const tx = await contractwithsigner.Addvoter(
                            id,
                            arr
                          );
                          console.log("tx", tx);
                        }}
                      >
                        Add Members
                      </button>
                    </div>
                  ) : (
                    <div className="bg-red-300 text-white font-medium border border-red-400/40 rounded-sm px-2 cursor-default">You are not Admin</div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
