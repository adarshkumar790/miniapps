'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';


export default function ClaimComponent() {
  const [connected, setConnected] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-[#1E1E1E] text-white p-2 relative overflow-hidden">
      <div className="absolute top-4 left-0 w-full flex items-center justify-between px-4">

        <Link href="/">  <button className="text-white text-lg"><Image src="/backarrow.png" width={30} height={30} alt="backbutton" /></button>
        </Link>

      </div>

      <div className='mb-12'>
        <p className="text-2xl  font-bold">Network:</p>
        <p className="text-m text-gray-400">POL (POLYGON)</p>

        <p className="text-2xl font-bold mt-4">Amount to claim:</p>
        <p className="text-m text-gray-400">4000</p>

        <p className="text-2xl font-bold mt-4">Contract address:</p>
        <p className="text-m text-gray-400 truncate">0x1236d6g...</p>

        <div className="flex gap-2 mt-4">
          <button className="px-4 py-2 border border-gray-500 rounded-lg bg-[rgba(135, 135, 135, 1)] hover:bg-gray-700">
            View on explorer
          </button>
          <button className="px-4 py-2 border border-gray-500 rounded-lg hover:bg-gray-700 bg-[rgba(135, 135, 135, 1)]">
            Add to Wallet
          </button>
        </div>


      </div>
      <button className="mt-4 px-8 py-3 text-2xl  text-center font-bold bg-white text-black rounded-xl shadow-md hover:bg-gray-200">
        Claim Now
      </button>
      <div className="absolute bottom-12 left-5 opacity-80">
        <span className="text-gray-700 text-8xl"><Image src="/leftside.png" alt='leftside' width={80} height={80} /></span>
      </div>
      <div className="absolute bottom-0 right-0 opacity-80">
        <span className="text-gray-700 text-8xl"><Image src="/rightside.png" alt="rightcat" width={200} height={200} /></span>
      </div>
    </div>
  );
}
