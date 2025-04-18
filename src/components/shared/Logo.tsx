
import React from 'react';
import { BadgeCheck } from 'lucide-react';

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-md bg-cert-gradient flex-center">
        <BadgeCheck className="text-white" size={20} />
      </div>
      <div className="font-bold text-xl">
        <span className="text-gradient">Certify</span>
        <span>Nexus</span>
      </div>
    </div>
  );
};

export default Logo;
