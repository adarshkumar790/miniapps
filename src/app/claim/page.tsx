"use client";

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useAppKitProvider } from '@reown/appkit/react';
import Image from 'next/image';
import Link from 'next/link';
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useSearchParams } from "next/navigation";
import CONTRACT_ABI from "../../ABI/abi.json";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Copy } from 'lucide-react';

// import Web

type WalletComponentProps = {
  walletProvider: any;
  chainId: string;
};

// Define your contract details
const CONTRACT_ADDRESS = "0xB5b163D8964Cf216f153E1c757330c991aa6D3ae";

const WalletComponent: React.FC<WalletComponentProps> = ({ walletProvider, chainId }) => {
  //@ts-ignore
  const { walletProvider: providerInstance, chainId: activeChainId } = useAppKitProvider('eip155')

  // State variables
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  const [address] = useState(CONTRACT_ADDRESS);
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
        //@ts-ignore
        if (!providerInstance?.request) return;

        // Connect wallet
        //@ts-ignore
        const accounts: string[] = await providerInstance.request({ method: 'eth_accounts' });
        if (accounts.length === 0) throw new Error("No accounts connected!");

        const address = accounts[0];
        setWalletAddress(address);

        // Get provider & signer
        //@ts-ignore
        const ethersProvider = new ethers.BrowserProvider(providerInstance);
        const signerInstance = await ethersProvider.getSigner();
        setSigner(signerInstance);

        console.log("Connected Wallet Address:", await signerInstance.getAddress());

        // Fetch wallet balance
        //@ts-ignore
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
      toast.error("Please connect to wallet")
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
          <p>Txn hash: </p>
          <p>
          <a
            href={`https://testnet.bscscan.com/tx/${tx.hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className='text-blue-900'
          >
            {/* {tx.hash.slice} */}
            {tx.hash.slice(0, 4)}...{tx.hash.slice(-4)}
          </a>
          </p>
        </>,
        { autoClose: 10000 }
      );
      await tx.wait();

      toast.success(" Tokens claimed successfully!");
    } catch (error: any) {
      console.log("Error claiming tokens:", error.message.split(",")[0].split("("));
      toast.error(`${error.message.split(",")[0].split("(")[0] || "Unknown error"}`);
    } finally {
      setIsClaiming(false);
    }
  };

  // async function addTokenToMetaMask() {
  //   // Check if MetaMask is installed
  //   if (typeof window.ethereum === 'undefined') {
  //     alert('MetaMask is not installed!');
  //     return;
  //   }

  //   // Request account access if needed
  //   try {
  //     //@ts-ignore
  //     await window.ethereum.request({ method: 'eth_requestAccounts' });
  //   } catch (error) {
  //     console.error('User denied account access:', error);
  //     return;
  //   }

  //   // Token details
  //   const tokenDetails = {
  //     type: 'ERC20',
  //     options: {
  //       address: '0xCE35BfF751C2B3754aBa957Fb5e0705AE9f41f3A', // Replace with your token contract address
  //       symbol: 'RK', // Replace with your token symbol
  //       decimals: 18, // Replace with your token decimals
  //       image: '/rats.png', // Replace with your token logo URL (optional)
  //     },
  //   };

  //   // Add token to MetaMask
  //   try {
  //     //@ts-ignore
  //     const wasAdded = await window.ethereum.request({
  //       method: 'wallet_watchAsset',
  //       params: tokenDetails,
  //     });

  //     if (wasAdded) {
  //       console.log('Token added successfully!');
  //       alert('Token added successfully!');
  //     } else {
  //       console.log('Token was not added.');
  //       alert('Token was not added.');
  //     }
  //   } catch (error) {
  //     console.error('Error adding token:', error);
  //     alert('Error adding token. See console for details.');
  //   }
  // }




  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-[#1E1E1E] text-white p-2 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full flex items-center justify-between px-4">
        <Link href="/">
          <button className="text-white text-lg">
            <Image src="/backarrow.png" width={30} height={30} alt="backbutton" />
          </button>
        </Link>
        <div className="absolute right-4">
          <appkit-button />
        </div>
        <p className="text-m font-bold mt-20 text-white px-4 py-2">
        Balance : <span className="text-yellow-600">{signer ? balance : 0} POL</span>

        </p>
      </div>      
      <div className='mb-12'>
         <Image src="/rat1.png" alt='rat' width={150} height={150}  className='-ml-4'/>
        <p className="text-2xl font-bold">Network :</p>
        <p className="text-m text-gray-400">POL (POLYGON)</p>
        
        {/* <p className=''>{walletAddress}</p> */}

        <p className="text-2xl font-bold mt-2">Amount to claim :</p>
        <p className="text-m text-gray-400">{amount} RK</p>

        <p className="text-2xl font-bold mt-2">Contract Address :</p>
        <p className="flex items-center gap-2">
      {/* Clickable Contract Address */}
      <a
        href={`https://bscscan.com/address/${CONTRACT_ADDRESS}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        {CONTRACT_ADDRESS?.slice(0, 10)}...{CONTRACT_ADDRESS?.slice(-10)}
      </a>

      {/* Copy to Clipboard Button */}
      <CopyToClipboard text={CONTRACT_ADDRESS} onCopy={() => toast.success("Copied!")}>
        <button className="p-1 rounded-md hover:bg-gray-200 transition">
          <Copy size={20} />
        </button>
      </CopyToClipboard>
    </p>
        {/* <button
          className="px-4 py-2 mt-2 border border-gray-500 rounded-lg bg-gray-600 hover:bg-gray-700"
          onClick={() => window.open("https://polygonscan.com/token/0xa2E1a3228488f25ca7d4887DCe07c9625d4De5Df#code", "_blank")}
        >
          View on Explorer
        </button> */}
      </div>
      {/* <div className="flex gap-2"> */}
        
        {/* <button className="px-4 py-2 border border-gray-500 rounded-lg hover:bg-gray-700 bg-gray-600" onClick={() => addTokenToMetaMask()}>
          Add to Wallet
        </button> */}
      {/* </div> */}


      <button
        className="mt-0 mb-8 px-8 py-3 text-2xl text-center font-bold bg-white text-black rounded-xl shadow-md hover:bg-green-400"
        onClick={claimTokens}
        disabled={isClaiming}
      >
        {isClaiming ? "Claiming..." : "Claim Now"}
      </button>

      <div className="absolute bottom-12 left-5 opacity-80 ">
        <Image src="/leftside.png" alt='leftside' width={80} height={80} />
      </div>
      <div className="absolute bottom-0 right-0 opacity-80 sm:h-[50]">
        <Image src="/rightside.png" alt="rightcat" width={150} height={150} />
      </div>
    </div>
  );


}

export default WalletComponent;
