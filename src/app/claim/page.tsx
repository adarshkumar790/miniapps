"use client";

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useAppKitProvider } from '@reown/appkit/react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from "next/navigation";
import CONTRACT_ABI from "../../ABI/abi.json";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { json } from 'stream/consumers';

type WalletComponentProps = {
  walletProvider: any;
  chainId: string;
};

// Define your contract details
const CONTRACT_ADDRESS = "0x13ceAC846f1f743B9AAe928b08c341C20742e457" ;//"0x566f344E70E06669f35a127caB2d69F2c80756aC";

const WalletComponent: React.FC<WalletComponentProps> = ({ walletProvider, chainId }) => {
  const { walletProvider: providerInstance, chainId: activeChainId } = useAppKitProvider('eip155');

  // State variables
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [isClaiming, setIsClaiming] = useState<boolean>(false);

  // Get URL search params
  const searchParams = useSearchParams();
  const telegramId = searchParams.get("telegramId") ?? "721749248";
  const amount = Number(searchParams.get("token") ?? 198765);
  const proof = searchParams.get("proof");
  const merkleProof: string[] = proof ? JSON.parse(proof) : [
    "0x1f8b98d2001e2333e8bc83fb24a45827525bda23ced762a81daf8f74405584c9",
        "0x4e5ae2c90f5facc898ecd3165f10d545c127c4399b292cb2b4be9f50e3ede629",
        "0x836d9dba99782c33da63830ebaa56f3902c293c224d66676d1f57ba750ffdab0",
        "0x3661ea0ddea70491392b17d5546888596dcec86715749af67c57e6d3c5f5b811",
        "0xbb1ae150705caecc9ab958caea00e642848f4ba18d2d3ad02b397eec2961faa8",
        "0xfed865bd5740653bedf3792a0cccdb66c5b849adde4adbce54a4b43dc0335459",
        "0xd3c56372030ac2062d46cd3279ed2db609ae5ebf271eac800dc2d41c3f7914b5",
        "0xe32f2657f280a0d44b5b38a877122de6a874cb209b098fb9496732d7b3ec9f76",
        "0x3be070409b7914aa2e6ce4b319871ab6e723173ff473ea08812e586a595749cb",
        "0x023b70e97f126e373425e8fda8be59b549c5f80cbfc1863e383f2a38191a1e89",
        "0x073dea366241cc5755ed4597f79b3434e6f476b89e241c7e1a94f1c524992f9e"
  ];

  // Initialize wallet on component mount
  useEffect(() => {
    async function initializeWallet() {
      try {
        if (!providerInstance?.request) return;

        // Connect wallet
        const accounts: string[] = await providerInstance.request({ method: 'eth_accounts' });
        if (accounts.length === 0) throw new Error("No accounts connected!");

        const address = accounts[0];
        setWalletAddress(address);

        // Get provider & signer
        const ethersProvider = new ethers.BrowserProvider(providerInstance);
        const signerInstance = await ethersProvider.getSigner();
        setSigner(signerInstance);

        console.log("Connected Wallet Address:", await signerInstance.getAddress());

        // Fetch wallet balance
        const balanceWei: string = await providerInstance.request({
          method: 'eth_getBalance',
          params: [address, 'latest'],
        });
        setBalance(parseFloat(ethers.formatEther(balanceWei)).toFixed(4));
      } catch (error) {
        console.error("Wallet Initialization Error:", error);
      }
    }

    initializeWallet();
  }, [providerInstance, activeChainId]);

  // Function to claim tokens
  const claimTokens = async () => {
    if (!signer) {
      console.error("Signer not initialized");
      return;
    }

    try {
     
      setIsClaiming(true);

      // Create contract instance
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // Send transaction to claim tokens
      const tx = await contract.claimTokens(telegramId, amount, merkleProof, {
        value: ethers.parseEther("0.000000000000000001"),
      });
      
      console.log(`Transaction sent: ${tx}`);
      // toast.info(`Transaction sent: ${tx.hash}`,{});
      toast.info(
        <>
          Transaction sent:{" "}
          <a
            href={`https://testnet.bscscan.com/tx/${tx.hash}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#007bff", textDecoration: "underline" }}
          >
            {tx.hash}
          </a>
        </>,
        {}
      );      
      await tx.wait();
     
      toast.success("Tokens claimed successfully!");
    } catch (error :any) {
      console.log("Error claiming tokens:", error.message.split(",")[0].split("("));
      toast.error(`${error.message.split(",")[0].split("(")[0] || "Unknown error"}`);
    } finally {
      setIsClaiming(false);
    }
  };

  const addTokenWithEthers=async()=> {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    await signer.provider.send("wallet_watchAsset", [{
        type: "ERC20",
        options: {
            address: CONTRACT_ADDRESS,
            symbol: "RK",
            decimals: 18,
            image: "/rat.png",
        },
    }]);
}

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
        <p className=''>{walletAddress}</p>

        <p className="text-2xl font-bold mt-4">Amount to claim:</p>
        <p className="text-m text-gray-400">{amount} RK</p>
        
        <p className="text-2xl font-bold mt-4">CONTRACT ADDRESS</p>
        <p className="text-m text-gray-400 truncate">
        {CONTRACT_ADDRESS.slice(0, 10)}...{CONTRACT_ADDRESS.slice(-16)}
        </p>
      </div>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 border border-gray-500 rounded-lg bg-gray-600 hover:bg-gray-700"
            onClick={() => window.open("https://polygonscan.com/token/0xa2E1a3228488f25ca7d4887DCe07c9625d4De5Df#code", "_blank")}
          >
            View on Explorer
          </button>
          <button className="px-4 py-2 border border-gray-500 rounded-lg hover:bg-gray-700 bg-gray-600" onClick={()=>addTokenWithEthers()}>
            Add to Wallet
          </button>
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

export default WalletComponent;
