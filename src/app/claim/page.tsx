'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAppKitProvider } from '@reown/appkit/react';
import { ethers } from 'ethers';

export default function ClaimComponent() {
  const { walletProvider } = useAppKitProvider('eip155');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [ethBalance, setEthBalance] = useState<string | null>(null);

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
        <p className="text-m text-gray-400 truncate">0x1236d6g...</p>

        {/* {walletAddress ? (
          <div className="mt-4 p-2 border border-gray-600 rounded-lg bg-gray-800">
            <p className="text-xl font-bold">Connected Wallet:</p>
            <p className="text-gray-400 truncate">{walletAddress.slice(0, 10)}...</p>
            {ethBalance !== null && (
              <p className="text-gray-400 mt-2">Balance: {ethBalance} ETH</p>
            )}
          </div>
        ) : (
          <p className="text-red-500 mt-4">Not Connected</p>
        )} */}

        <div className="flex gap-2 mt-4">
          <button className="px-4 py-2 border border-gray-500 rounded-lg bg-gray-600 hover:bg-gray-700">
            View on Explorer
          </button>
          <button className="px-4 py-2 border border-gray-500 rounded-lg hover:bg-gray-700 bg-gray-600">
            Add to Wallet
          </button>
        </div>
      </div>

      <button className="mt-4 px-8 py-3 text-2xl text-center font-bold bg-white text-black rounded-xl shadow-md hover:bg-gray-200">
        Claim Now
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
