"use client"
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useAppKitProvider } from '@reown/appkit/react';
import Image from 'next/image';
import Link from 'next/link';
import CONTRACT_ABI from "../../ABI/abi.json"

const CONTRACT_ADDRESS = "0x2d9cAeCe9592bcb26530F4Aa3fD694Ef62a93A42";


export default function ClaimComponent() {
  const { walletProvider } = useAppKitProvider('eip155');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [ethBalance, setEthBalance] = useState<string | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    async function fetchAccount() {
      if (walletProvider && walletProvider.request) {
        try {
          const accounts: string[] = await walletProvider.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const address = accounts[0];
            setWalletAddress(address);
            const balanceWei: string = await walletProvider.request({
              method: 'eth_getBalance',
              params: [address, 'latest']
            });
            const balanceEth = ethers.utils.formatEther(balanceWei);
            setEthBalance(parseFloat(balanceEth).toFixed(4));
          }
        } catch (error) {
          console.error('Error fetching wallet data:', error);
        }
      }
    }
    fetchAccount();
  }, [walletProvider]);

  const claimTokens = async () => {
    if (!window.ethereum) {
        alert("Wallet provider not found. Please install MetaMask or another web3 wallet.");
        return;
    }

    try {
        setIsClaiming(true);

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

        const data = {
            telegramId: 721749248,
            tokens: 353488, 
            proof:  [
              "0x0020ff4c3e3a0beb9570b9af78436b1db7e5e4e3ca72f7b76137f5aff6f25f3b",
              "0x216f5a332e933d49ba44278fb39a95473f051c8aaaeb748f8e52684784973091",
              "0x454ce3511b0c2cc02ce0353629ef4b7f4c20fa9b46785ee04465e3f1ce1ddb66",
              "0xe69ffebdac914b24c5fa475e9fe395ed73957de9ce3bdecbcdc8f10c56a88081",
              "0xe786d8ec870cc8c061bbbc1ecb9a332a17e203af00e19562e1b48b1f56292c1f",
              "0xb521fb2c85c7e3d60599a336baad41851a51bbd7b623c7e650886f4e6cb737d3",
              "0xc3f20b92dd10adbd4554f9d43325895fe3bd93a21054cce54f4d57bfa198655d",
              "0x31ad9370b8c5ec77b7834c286a18f336297f10f41be3e44c5444850a1249920b",
              "0x6b1352556c00d98857306e2cc21da1610547104732facf1c733cc2b50f607cf8",
              "0xc4bdd161c517061f07ba3c93c848cd751c4622584c0c2891af0c6fe3b4bacf6e",
              "0x58c2b5f5c8ddfa60409a5dece688740acc42cee2482f59700b9484a512b40f6a",
              "0x00ec3993e49a7f5a4aa495d71cdbd702974135fc77d2f6a50c1acd53adfa43e3",
              "0xceb34aa279d5b4668121642a8784cb0f1f475ea304f8325866028bb2bea608a3",
              "0xc8b0e7be081431e401b0d4fd6dc19ecdb81a8ec7000d5c33f48c109a2d306c27",
              "0x3d8c026d457eda852bccc6cefec2100873cd4ba70e3ac5a75b35bc7826562480",
              "0x0f949d428c7bf994a4f74f232f568fc3d4d3763789930355f9cdc47c546b9790",
              "0xd803888fd2900a4627284d8f7095a4889831bec474f4805ebb59cbb3a50d8c6f",
              "0xebf405784871a170b92826a5b05000adfce4f4226a30defbde27c72050ffc567"
          ]
        };

        const tokenAmountInWei = ethers.utils.parseUnits(data.tokens.toString(), 18);
    
        const tx = await contract.claimTokens(data.telegramId, tokenAmountInWei, data.proof, {
            value: ethers.utils.parseEther("1"),
        });

        await tx.wait();
        alert("Tokens claimed successfully!");
    } catch (error) {
        console.error("Error claiming tokens:", error);
        alert("Error claiming tokens. Check console for details.");
    } finally {
        setIsClaiming(false);
    }
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
        <p className="text-m text-gray-400">4000</p>

        <p className="text-2xl font-bold mt-4">Contract address:</p>
        <p className="text-m text-gray-400 truncate">{CONTRACT_ADDRESS}</p>

        <div className="flex gap-2 mt-4">
          <button className="px-4 py-2 border border-gray-500 rounded-lg bg-gray-600 hover:bg-gray-700">
            View on Explorer
          </button>
          <button className="px-4 py-2 border border-gray-500 rounded-lg hover:bg-gray-700 bg-gray-600">
            Add to Wallet
          </button>
        </div>
      </div>

      <button 
        className="mt-4 px-8 py-3 text-2xl text-center font-bold bg-white text-black rounded-xl shadow-md hover:bg-gray-200"
        onClick={claimTokens}
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
    </div>
  );
}
