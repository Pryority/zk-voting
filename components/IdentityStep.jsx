import React, { useState, useEffect } from "react";
import { Identity } from "@semaphore-protocol/identity";
import { useSigner } from "wagmi";
const { ethers } = require("ethers");
import { ArrowPathRoundedSquareIcon, InformationCircleIcon } from "@heroicons/react/24/solid";
import SemaphoreIntro from "./SemaphoreIntro";
import CreatedIdInfo from "./id-creation/CreatedIdInfo";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

export default function IdentityStep({ }) {
  const { data: signer, isError, isLoading } = useSigner();
  const [identity, setIdentity] = useState("");
  const [secretString, setSecretString] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  const [walletAddress, setWalletAddress] = useState("");
  // const [canRender, setCanRender] = useState(false);

  // Actions
  const checkIfWalletIsConnected = async () => {
    if (address) {
      console.log("👛 - W A L L E T - FOUND !");
      console.log({address});
      /*
       * Set the user's publicKey in state to be used later!
       */
      setWalletAddress(address);
    } else {
      alert("No browser wallet was found to connect to the blockchain 😡");
    }
  };

  const checkidentity = async () => {
    const identityval = window.localStorage.getItem("identitycommitment");
    console.log("identityval", identityval);
    if (identityval) {
      const _identity = new Identity(identityval);
      setIdentity(_identity);
      window.localStorage.setItem("identitycommitment", _identity);
      console.log("_identity", _identity);
      console.log("Successfully loaded identity");
    } else {
      console.log("Create new identity");
      alert("Please create New Identity");
    }
  };

  const CreateDeterministicidentity = async (hash) => {
    // window.localStorage.setItem("identityCommitment", "⏰ AWAITING HASH");
    const identityNew = new Identity(hash);
    setIdentity(identityNew);
    console.log("🔑 - I D E N T I T Y - CREATED ! ✅ -- SHARE WITH OTHERS", {identityNew});
    console.log("🔑 - T R A P D O O R - GENERATED ! ✅ -- ⚠️ DO NOT SHARE ⚠️", identityNew._trapdoor);
    console.log("🔑 - N U L L I F I E R - GENERATED ! ✅ -- ⚠️ DO NOT SHARE ⚠️", identityNew._nullifier);
    const publicId = identityNew.generateCommitment();
    let a = ethers.BigNumber.from(publicId).toString();
    console.log("🆔 - I D  C O M M I T M E N T - GENERATED ! ✅", a);
    window.localStorage.setItem("identityCommitment", identityNew);
    console.log("💾 - L O C A L L Y  S T O R E D  I D  H A S H - SET ! ✅", window.localStorage.getItem("identityCommitment"));
  };

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSecretString(value);
    // console.log({secretString});
  };

  const handleCreateID = async () => {
    setLoading(true);
    // concatenates the connected wallet's signature with the secret string, then hashes it ↓
    const hash = await signer.signMessage(secretString);
    console.log("🔢 - H A S H - GENERATED ! ✅", hash);
    CreateDeterministicidentity(hash);
    setSecretString("");
    setLoading(false);
  };

  useEffect(function mount() {
    function onScroll() {
      console.log("scroll!");
    }

    window.addEventListener("scroll", onScroll);

    return function unMount() {
      window.removeEventListener("scroll", onScroll);
    };
  });

  useEffect(() => {
    checkIfWalletIsConnected();
    // setCanRender(true);
    console.log("🪟 - W I N D O W - LOADED !");
  }, []);

  useEffect(() => {
    if (walletAddress) {
      // Call Polygon contract here.
      
      // Set state of some content ↓
      // console.log("❔ - S O M E T H I N G - LOADED ! ✅");
    }
  }, [walletAddress]);

  return (
    <div className="text-base md:text-lg leading-5 w-full relative min-h-screen justify-center items-center overflow-scroll bg-gradient-to-bl from-teal-50 via-teal-100 to-yellow-300/40">
      <div className={`absolute grid space-y-2 md:space-y-0 w-full justify-center ${!identity ? "h-full py-16 md:py-0" : " py-16 md:py-0"} items-center md:py-40`}>
        {/* HIDDEN COMPONENTS */}
        <div className={`absolute bg-black/60 items-center h-screen w-full z-50 ${isOpen ? "flex" : "hidden"}`}>
          <SemaphoreIntro toggle={toggle} />
        </div>
        {/* LOADING COMPONENTS */}
        {loading && <div className={`absolute bg-black/60 items-center h-screen w-full z-50 ${isOpen ? "flex" : "hidden"}`}>
          <ArrowPathRoundedSquareIcon className="h-8 w-8 text-[#fcffff]" />
        </div>}
        {/* LOAD COMPONENTS */}
        {identity == "" ? (
          <div className="md:p-8">
            <div className="p-4 rounded-xl bg-zinc-50 flex flex-col justify-center items-center w-full space-y-4 border shadow">
              <div className="flex justify-between w-full">
                <div className="bg-stone-200/50 rounded-lg justify-center items-center px-2">
                  <p className="tracking-tighter font-extrabold uppercase bg-gradient-to-r from-pink-700 via-pink-500 to-yellow-500 bg-clip-text text-transparent">
                  Claim Your Identity
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
              <textarea
                className={`mb-5 p-2 w-full h-[30vh] justify-start items-start rounded border border-pink-300/50 focus:ring-[2px] focus:outline-none focus:ring-pink-500 ${secretString ? "focus:ring-lime-500 border-lime-300/50" : "focus:pink-500"}`}
                placeholder="Enter a secret message to generate Identity "
                value={secretString}
                onChange={handleChange}
              />
              <div className="flex flex-col items-center justify-center w-full space-y-1">
                <button
                  className={`w-full ${secretString ? "bg-green-500 border rounded-sm px-2 py-1 text-sm md:text-md lg:text-lg hover:bg-green-600 transition ease-in-out duration-200 text-white cursor-pointer" : "bg-red-500 border rounded-sm px-2 py-1 text-sm md:text-md lg:text-lg hover:bg-red-600/90 transition ease-in-out duration-200 text-white cursor-not-allowed"}`}
                  disabled={!secretString}
                  onClick={handleCreateID}
                >
                Create Deterministic Identity
                </button>
                <button
                  className='w-full bg-[#fcffff] border border-stone-300 rounded-sm px-2 py-1 text-sm md:text-md lg:text-lg hover:bg-zinc-300 hover:border-[#fcffff] hover:text-gray-700 text-gray-600 cursor-pointer'
                  onClick={async () => {
                    await checkidentity();
                  }}
                >
                Load Existing Identity
                </button>
              </div>
            </div>
          </div>
        )
          :
          (
            <div className="flex w-full justify-center">
              <div className="bg-stone-200 py-2 px-6 text-stone-600 hover:bg-red-700 hover:text-red-50 hover:border-red-500 transition-all ease-in-and-out duration-200 cursor-pointer rounded-lg border-2 border-slate-300 tracking-wider uppercase"
                onClick={()=>setIdentity("")}
              >
                Reset
              </div>
            </div>
          )
        }
        <div className="md:p-8">
          <CreatedIdInfo identity={identity} />
        </div>
      </div>
    </div>
  );
};