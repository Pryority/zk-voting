import React from "react";
import abi from "../helpers/ZkVote.json";
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
    <div
      display={"flex"}
      mx={"200px"}
      my={20}
      flexWrap={"wrap"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      {Events &&
        Events.map((value, i) => {
          let name = ethers.utils.parseBytes32String(value.eventName);
          let id = ethers.BigNumber.from(value.groupId).toString();
          console.log("id", id);
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
              ? (currentstatus = " Voting Started")
              : value.end.length != 0
                ? (currentstatus = "Voting Ended")
                : (currentstatus = "Created");
          let a = isMember ? "You are a member" : "Not Member";

          return (
            <div
              key={i}
              className='border shadow p-4 w-[400px] m-5 rounded-xl'
            >
              <header className="mb-5">
                {name}
              </header>
              <p className="mb-3 text-xl">
                ID: {id.substring(0, 18)}...
              </p>
              <p className="mb-3 text-xl">
                Status: {status}...
              </p>
              <div
                width={"100%"}
                height={"100px"}
                borderRadius={10}
                padding={3}
                border={"1px solid rgba(255, 255, 255, 0.125)"}
                mb={5}
                overflow={"auto"}
              >
                {des}
              </div>
              <div mb={5} display={"flex"}>
                <button disabled>{a}</button>
                <button className="ml-5">
                  <Link href={"Vote/" + id}>
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
                    className='mb-5'
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
                <div className="bg-red-300 text-white font-medium border">You are not Admin</div>
              )}
            </div>
          );
        })}
    </div>
  );
}
