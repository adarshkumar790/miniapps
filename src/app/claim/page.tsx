"use client";

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useAppKitProvider } from '@reown/appkit/react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from "next/navigation";
import CONTRACT_ABI from "../../ABI/abi.json";

const CONTRACT_ADDRESS = "0x2d9cAeCe9592bcb26530F4Aa3fD694Ef62a93A42";

async function claimTokens(signer: any, telegramId: number, amount: any, merkleProof: any) {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    const claimFee = ethers.parseEther("1.0");
    const amountInWei = ethers.parseUnits(amount.toString(), 18);

    console.log("Claiming tokens with params:", {
      telegramId,
      amount: amountInWei.toString(),
      merkleProof
    });

    const tx = await contract.claimTokens(telegramId, amountInWei, merkleProof, { value: claimFee });

    await tx.wait();
    console.log("Tokens claimed successfully:", tx.hash);
    return tx.hash;
  } catch (error: any) {
    console.error("Error claiming tokens:", error);

    if (error.reason) {
      console.error("Revert reason:", error.reason);
    }

    throw error;
  }
}

export default function ClaimComponent() {
  const { walletProvider, chainId } = useAppKitProvider('eip155');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);

  const searchParams = useSearchParams();
  console.log("adarsh", searchParams);
  const telegramId = searchParams.get("telegramId");
  const token = searchParams.get("token");
  const proof = searchParams.get("proof");

  const proofArray = proof ? JSON.parse(proof) : [];


  useEffect(() => {
    async function fetchAccount() {
      if (walletProvider?.request) {
        try {
          const accounts: string[] = await walletProvider.request({ method: 'eth_accounts' });

          if (accounts.length > 0) {
            const address = accounts[0];
            setWalletAddress(address);


            const balanceWei: string = await walletProvider.request({
              method: 'eth_getBalance',
              params: [address, 'latest'],
            });
            const balanceFormatted = ethers.formatEther(balanceWei);
            setBalance(parseFloat(balanceFormatted).toFixed(4));
          }
        } catch (error) {
          console.error('Error fetching wallet data:', error);
        }
      }
    }
    fetchAccount();
  }, [walletProvider, chainId]);

  const handleClaim = async () => {
    if (!walletProvider) return;
    setIsClaiming(true);
    try {
      const provider = new ethers.BrowserProvider(walletProvider);
      const signer = await provider.getSigner();

      const telegramid = telegramId;
      const amount = token;
      const merkleProof = proofArray;

      await claimTokens(signer, telegramid, amount, merkleProof);

      alert("Tokens claimed successfully!");
    } catch (error) {
      console.error("Error claiming tokens:", error);
      alert("Failed to claim tokens: " + (error.reason || error.message));
    }
    setIsClaiming(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-[#1E1E1E] text-white p-2 relative overflow-hidden">
      <div className="absolute top-4 left-0 w-full flex items-center justify-between px-4">
        <Link href="/">
          <button className="text-white text-lg">
            <Image src="/backarrow.png" width={30} height={30} alt="backbutton" />
          </button>
        </Link>
        <div className="absolute right-4">
          <appkit-button />
        </div>
      </div>

      <div className='mb-12'>
        <p className="text-2xl font-bold">Network:</p>
        <p className="text-m text-gray-400">POL (POLYGON)</p>

        <p className="text-2xl font-bold mt-4">Amount to claim:</p>
        <p className="text-m text-gray-400">{token} RK</p>

        <p className="text-2xl font-bold mt-4">Contract address:</p>
        <p className="text-m text-gray-400 truncate">{CONTRACT_ADDRESS}</p>

        <div className="flex gap-2 mt-4">
          <button
            className="px-4 py-2 border border-gray-500 rounded-lg bg-gray-600 hover:bg-gray-700"
            onClick={() => window.open("https://polygonscan.com/token/0xa2E1a3228488f25ca7d4887DCe07c9625d4De5Df#code", "_blank")}
          >
            View on Explorer
          </button>
          <button className="px-4 py-2 border border-gray-500 rounded-lg hover:bg-gray-700 bg-gray-600">
            Add to Wallet
          </button>
        </div>
      </div>

      <button
        className="mt-4 px-8 py-3 text-2xl text-center font-bold bg-white text-black rounded-xl shadow-md hover:bg-gray-200"
        onClick={handleClaim}
        disabled={isClaiming}
      >
        {isClaiming ? "Claiming..." : "Claim Now"}
      </button>

      <div className="absolute bottom-12 left-5 opacity-80">
        <Image src="/leftside.png" alt='leftside' width={80} height={80} />
      </div>
      <div className="absolute bottom-0 right-0 opacity-80">
        <Image src="/rightside.png" alt="rightcat" width={200} height={200} />
      </div>
      {/* <h1>Claim Page</h1>
      <p>Telegram ID: {telegramId}</p>
      <p>Token: {token}</p>
      {proofArray.map((x : any)=><p>{x}</p>)} */}
      {/* <p>Proof: {JSON.stringify(proofArray)}</p> */}
    </div>
  );
}
