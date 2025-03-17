'use client';

import { useMemo, useEffect, useState } from 'react';
import { useSignal, initData, type User } from '@telegram-apps/sdk-react';
import { Placeholder } from '@telegram-apps/telegram-ui';
import { CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import {
  DisplayData,
  type DisplayDataRow,
} from '@/components/DisplayData/DisplayData';
import { Page } from '@/components/Page';
import { useRouter } from 'next/navigation';

type ResultProps = {
  status?: boolean;
  error?: string;
  telegramId?: string;
  tokens?: string;
  proofs?: string[];
};


function getUserRows(user: User): DisplayDataRow[] {
  return [
    { title: 'id', value: user.id.toString() },
    { title: 'username', value: user.username },
    { title: 'photo_url', value: user.photoUrl },
    { title: 'last_name', value: user.lastName },
    { title: 'first_name', value: user.firstName },
    { title: 'is_bot', value: user.isBot },
    { title: 'is_premium', value: user.isPremium },
    { title: 'language_code', value: user.languageCode },
    { title: 'allows_to_write_to_pm', value: user.allowsWriteToPm },
    { title: 'added_to_attachment_menu', value: user.addedToAttachmentMenu },
  ];
}

export default function InitDataPage() {
  const initDataRaw = useSignal(initData.raw);
  const initDataState = useSignal(initData.state);
  const [result, setResult] = useState<ResultProps>();

  const router = useRouter();

  useEffect(() => {
    if (initDataRaw && initDataState) {
      console.log('Sending full initDataState to database:', initDataRaw);

      fetch('https://airdrop.ratskingdom.com/api/get-proof', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': initDataRaw,
        },
      })
      .then((response) => {
        return response.json();
    })
    .then((data) => {
        console.log('Raw response Adarsh', data);
        if(data.telegramId && data.telegramId !== "") {
          setResult({
            status: true,
            error: "",
            ...data
          })}
       else
       {
        setResult({
          status:false, error:"",
          ...data
        });
        
       }         
    })
    .catch((error) => console.error('Error sending initData:', error));    
    }
  }, [initDataRaw, initDataState]);

  
  const handleNext = () => {
    if (!result) {
      console.warn("Missing data, cannot navigate!", result);
      return;
    }
  
    const queryParams = new URLSearchParams({
      telegramId: result?.telegramId || "",
      token: result?.tokens || "",
      proof: JSON.stringify(result?.proofs),
      // proof: ""
    }).toString();
  
    console.log("Navigating to: /claim?" + queryParams);
    router.push(`/claim?${queryParams}`);
  };
  

    const initDataRows = useMemo<DisplayDataRow[] | undefined>(() => {
      if (!initDataState || !initDataRaw) {
        return;
      }
      const {
        authDate,
        hash,
        queryId,
        chatType,
        chatInstance,
        canSendAfter,
        startParam,
      } = initDataState;
      return [
        { title: 'raw', value: initDataRaw },
        { title: 'auth_date', value: authDate.toLocaleString() },
        { title: 'auth_date (raw)', value: authDate.getTime() / 1000 },
        { title: 'hash', value: hash },
        {
          title: 'can_send_after',
          value: initData.canSendAfterDate()?.toISOString(),
        },
        { title: 'can_send_after (raw)', value: canSendAfter },
        { title: 'query_id', value: queryId },
        { title: 'start_param', value: startParam },
        { title: 'chat_type', value: chatType },
        { title: 'chat_instance', value: chatInstance },
      ];
    }, [initDataState, initDataRaw]);
  
    const userRows = useMemo<DisplayDataRow[] | undefined>(() => {
      return initDataState && initDataState.user
        ? getUserRows(initDataState.user)
        : undefined;
    }, [initDataState]);
  
    const receiverRows = useMemo<DisplayDataRow[] | undefined>(() => {
      return initDataState && initDataState.receiver
        ? getUserRows(initDataState.receiver)
        : undefined;
    }, [initDataState]);
  
    const chatRows = useMemo<DisplayDataRow[] | undefined>(() => {
      if (!initDataState?.chat) {
        return;
      }
      const {
        id,
        title,
        type,
        username,
        photoUrl,
      } = initDataState.chat;
  
      return [
        { title: 'id', value: id.toString() },
        { title: 'title', value: title },
        { title: 'type', value: type },
        { title: 'username', value: username },
        { title: 'photo_url', value: photoUrl },
      ];
    }, [initData]);
  

  if (!result) return null;

  if (!result.status) {
    return (
      <div className="flex flex-col justify-center items-center h-screen w-screen bg-[#1E1E1E] p-4 relative overflow-hidden">
      <div className="absolute top-8 left-4 flex items-center text-xl text-white bg-gray-700 px-4 py-2 rounded-lg">
      User: {initDataState?.user?.id ?? 'Unknown'}
    </div>

      <div className="flex flex-col justify-center items-center h-screen w-screen bg-[#1E1E1E] p-4">
        <XCircle className="text-red-400 mb-4" size={48} />
        <h2 className="font-[aakar] text-white text-3xl mb-2 text-center">
        User is not verified!
        </h2>
        <p className="text-white text-sm text-center">
          Only verified users are currently allowed to claim tokens. Please come after verification.
        </p>
        <Link href="/init-data" passHref>
        <button className="mt-4 font-[inter] text-3xl px-10 py-2 rounded-lg font-semibold shadow-8xl transition bg-white text-black hover:bg-gray-300 cursor-pointer">
          Next »
        </button>
      </Link>
      </div>
      <appkit-button />
      </div>
    );
  }

  // Verified UI
  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen bg-[#1E1E1E] p-4 relative overflow-hidden">
      <div className="absolute top-8 left-4 flex items-center text-xl text-white bg-gray-700 px-4 py-2 rounded-lg">
        User: {initDataState?.user?.id ?? 'Unknown'}
      </div>

      <div className="absolute text-white top-20 left-4 flex items-center text-xl px-3 py-2 rounded-lg">
        Verified <CheckCircle className="text-green-400 ml-1" size={20} />
        <CheckCircle className="text-blue-400 ml-1" size={14} />
      </div>

      <h2 className="font-[aakar] font-extrabold text-5xl leading-none text-white text-center shadow-lg">
        Congratulations
      </h2>
      <p className="font-[aakar] font-medium text-3xl text-white mt-2">{`You've earned`}</p>

      <div className="flex justify-between items-center text-white mt-2">
        <h1 className="font-[aakar] font-bold text-4xl text-center flex-1">
          {result.tokens} RK
        </h1>
      </div>

      <p className="text-xs text-white mt-2">
        Verified users can claim their tokens now
      </p>
      <p className="text-xs text-white">Thank you for joining</p>

      <p className="font-[aakar] font-bold text-3xl text-white mt-3">
        Rats Kingdom
      </p>
      <button
        onClick={()=>handleNext()}
        className="mt-4 font-[inter] text-3xl px-10 py-2 rounded-lg font-semibold shadow-8xl transition bg-white text-black hover:bg-gray-300 cursor-pointer"
      >
        Next »
      </button>
      {/* Decorative Images */}
      <div className="absolute bottom-0 left-0 opacity-80 text-5xl">
        <Image src="/rats.png" alt="rats" width={200} height={200} />
      </div>
      <div className="absolute bottom-12 right-0 opacity-80 text-3xl">
        <Image src="/ratsright.png" width={120} height={120} alt="rightrats" />
      </div>
      
    </div>
  );
}
