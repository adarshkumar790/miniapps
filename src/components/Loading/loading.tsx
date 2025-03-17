import { motion } from 'framer-motion';

//import bidgetLogo from '@/assets/icons/bitget_icon.jpg'

const SplashScreen = () => {
  
  return (
    <div className="z-[1000] fixed top-0 left-0 w-screen h-[100dvh] flex flex-col items-center text-center justify-center bg-black">
      <div className="flex -gap-4">
        <motion.img
          src="/rat1.png"
          alt="Splash-Screen"
          className="w-40 h-40 relative  z-10"
          initial={{scale: 0.5, opacity: 0}}
          animate={{scale: [0.5, 1, 1, 1], opacity: 1}}
          transition={{duration: 1.0, repeat: 0, repeatType: "reverse"}}
        />
        {/* <div className="grid place-items-center relative right-4">
          <motion.img
            src="/trust_icon.png"
            alt="Splash-Screen"
            className="w-24 h-24 rounded-full"
            initial={{scale: 0.5, opacity: 0}}
            animate={{scale: [0.5, 1, 1, 1], opacity: 1}}
            transition={{duration: 1.8, repeat: Infinity, repeatType: "reverse"}}
          />
        </div> */}
      </div>

      <motion.h1
        initial={{y: 20, opacity: 0}}
        animate={{y: 0, opacity: 1}}
        transition={{duration: 1.0, repeat: 0, repeatType: "reverse"}}
        className="font-black text-3xl text-white">
        Rats Kingdom
        {/* <div className="mb-4">X</div>
        <span className="bitget-background px-4 py-2 rounded-xl text-white font-bold">Trust Wallet</span> */}
      </motion.h1>
    </div>
  );
};

export default SplashScreen;

