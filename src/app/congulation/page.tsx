import React from "react";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const RatsKingdomCard = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen bg-[#1E1E1E] p-4 relative overflow-hidden">
      <div className="absolute top-8 left-4 flex items-center text-xl text-white bg-gray-700 px-4 py-2 rounded-lg">
        User: 4532912
      </div>
      <div className="absolute top-8 right-4">
        <appkit-button/>
      </div>
      
      <div className="absolute text-white top-18 left-4 flex items-center text-xl px-3 py-2 rounded-lg">
        Verified
        <CheckCircle className="text-blue-400 ml-1" size={14} />
      </div>
      
      <h2 className="font-[aakar] font-extrabold text-5xl leading-none text-white text-center shadow-lg">
        Congratulations
      </h2>
      <p className="font-[aakar] font-medium text-3xl text-white mt-2">{`You've earned`}</p>
      <h1 className="font-[aakar] font-bold text-6xl text-white mt-2">4000 RK</h1>
      
      {/* Claim Info Centered */}
      <p className="text-xs text-white mt-2">Verified users can claim their tokens now</p>
      <p className="text-xs text-white">Thank you for joining</p>
      
      {/* Brand Name Centered */}
      <p className="font-[aakar] font-bold text-3xl text-white mt-3">Rats Kingdom</p>
      
      
      <Link href="/claim">
        <button className="mt-4 font-[inter] bg-white shadow-8xl text-3xl text-black px-10 py-2 rounded-lg font-semibold hover:bg-gray-300">
          Next »
        </button>
      </Link>
      <Link href="/init">
        <button className="mt-4 font-[inter] bg-white shadow-8xl text-3xl text-black px-10 py-2 rounded-lg font-semibold hover:bg-gray-300">
          Next »
        </button>
      </Link>
     
      {/* Decorative Icons */}
      <div className="absolute bottom-0 left-0 opacity-80 text-5xl">
        <Image src="/rats.png" alt="rats" width={200} height={200} />
      </div>
      <div className="absolute bottom-12 right-0 opacity-80 text-3xl">
        <Image src="/ratsright.png" width={120} height={120} alt="rightrats" />
      </div>
    </div>
  );
};

export default RatsKingdomCard;