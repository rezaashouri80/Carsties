"use client";

import { useEffect, useState } from "react";

function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState(
    new Date(targetDate).getTime() - Date.now()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(new Date(targetDate).getTime() - Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const seconds = Math.floor((timeLeft / 1000) % 60);
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));

  return { days, hours, minutes, seconds, completed: timeLeft <= 0 };
}

export default function CountdownTimer({ auctionEnd }: { auctionEnd: string }) {
  const { days, hours, minutes, seconds, completed } = useCountdown(auctionEnd);


  return (
    <div className={`border-2 border-white text-white py-1 px-2 rounded-lg flex
                    justify-center ${completed ? "bg-red-600" : (days==0 && hours<10)
                        ? "bg-amber-600" : "bg-green-600"
                    } 
                    `}>
                        { !completed ?
                        <span suppressHydrationWarning={true}>      {days}:{hours}:{minutes}:{seconds}</span>
                        :
                        <span>Finished !</span>
                        }
    </div>
  );
}