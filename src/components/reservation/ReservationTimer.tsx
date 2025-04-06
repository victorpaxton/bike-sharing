import { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface ReservationTimerProps {
  startTime: Date;
  duration: number; // in minutes
  onOverdue: () => void;
}

export default function ReservationTimer({ startTime, duration, onOverdue }: ReservationTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(duration * 60); // convert to seconds
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const elapsedSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      const remainingSeconds = duration * 60 - elapsedSeconds;
      
      setTimeLeft(remainingSeconds);

      if (remainingSeconds <= 0) {
        setIsOverdue(true);
        onOverdue();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, duration, onOverdue]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(Math.abs(seconds) / 60);
    const remainingSeconds = Math.abs(seconds) % 60;
    return `${seconds < 0 ? '-' : ''}${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusColor = () => {
    if (isOverdue) return 'text-red-600';
    if (timeLeft <= 300) return 'text-yellow-600'; // 5 minutes warning
    return 'text-gray-600';
  };

  return (
    <div className={`flex items-center ${getStatusColor()}`}>
      {isOverdue ? (
        <AlertTriangle className="w-5 h-5 mr-2" />
      ) : (
        <Clock className="w-5 h-5 mr-2" />
      )}
      <span className="font-medium">
        {isOverdue ? 'Overdue' : 'Time remaining'}: {formatTime(timeLeft)}
      </span>
    </div>
  );
} 