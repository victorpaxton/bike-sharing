import { Bike } from 'lucide-react';

type LogoProps = {
  className?: string;
};

const Logo = ({ className = '' }: LogoProps) => (
  <div className={`flex items-center space-x-2 ${className}`}>
    <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center relative">
      <div className="absolute inset-0 bg-primary-500 rounded-full animate-pulse" />
      <Bike className="w-6 h-6 text-white relative z-10" />
    </div>
    <div>
      <h1 className="text-xl font-bold text-primary-600 font-display tracking-tight">
        MetroWheel
      </h1>
      <p className="text-xs text-gray-500">Urban Mobility</p>
    </div>
  </div>
);

export default Logo; 