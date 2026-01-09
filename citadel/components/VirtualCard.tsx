import React from 'react'
import Image from 'next/image'

const VirtualCard = ({ card }: { card: any }) => {
  return (
    <div className="relative flex h-[190px] w-full max-w-[320px] flex-col justify-between rounded-[20px] border border-white bg-gradient-to-r from-[#0179FE] to-[#4893FF] p-6 shadow-lg">
      {/* Texture/Pattern Overlay */}
      <div className="absolute right-0 top-0 size-40 bg-white/10 blur-[50px] rounded-full pointer-events-none" />

      <div className="flex justify-between items-center z-10">
        <Image src="/icons/logo.svg" width={30} height={30} alt="Citadel" className="brightness-200 invert" /> 
        <span className="text-12 font-semibold text-white/80 uppercase tracking-widest">{card.status}</span>
      </div>

      <div className="z-10 flex flex-col gap-1">
        <h1 className="text-24 font-mono font-bold tracking-[4px] text-white shadow-sm">
          {/* Format: 1234 5678 1234 5678 */}
          {card.cardNumber.match(/.{1,4}/g)?.join(' ')}
        </h1>
      </div>

      <div className="flex justify-between items-end z-10">
        <div className="flex flex-col">
          <p className="text-10 font-medium text-white/70 uppercase">Card Holder</p>
          <p className="text-14 font-semibold text-white tracking-wide truncate max-w-[150px]">{card.label}</p>
        </div>
        <div className="flex flex-col items-end">
           <p className="text-10 font-medium text-white/70 uppercase">Expires</p>
           <p className="text-14 font-semibold text-white tracking-wide">{card.expiryDate}</p>
        </div>
      </div>
    </div>
  )
}

export default VirtualCard