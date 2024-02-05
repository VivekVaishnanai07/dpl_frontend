import React, { useState, useEffect } from 'react';

function Countdown(date: any) {
  const [remainingTime, setRemainingTime] = useState<any>({
    hours: 0,
    minutes: 0,
  });

  const calculateTimeRemaining = (deadline: any) => {
    const currentDate: any = new Date();
    const targetDate: any = new Date(deadline);
    const timeDifference = targetDate - currentDate;

    if (timeDifference <= 0) {
      // Countdown is complete
      setRemainingTime("Live");
    } else {
      const hours = Math.floor(timeDifference / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);

      setRemainingTime({
        hours,
        minutes,
      });
    }
  };

  useEffect(() => {
    calculateTimeRemaining(date);
    const intervalId = setInterval(() => calculateTimeRemaining(date), 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return remainingTime;
}

export default Countdown;