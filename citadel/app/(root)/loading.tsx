import React from 'react'

const Loading = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-white/40 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6">
        <div className="relative flex items-center justify-center size-24">
          <div className="absolute size-full rounded-full border-[3px] border-blue-100"></div>
          <div className="absolute size-full rounded-full border-[3px] border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          <div className="absolute size-16 rounded-full border-[3px] border-blue-100"></div>
          <div className="absolute size-16 rounded-full border-[3px] border-t-transparent border-r-blue-400 border-b-transparent border-l-transparent animate-spin"></div>
          <div className="size-3 rounded-full bg-blue-600 animate-pulse shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
        </div>
        <p className="text-14 font-medium text-blue-900 animate-pulse tracking-wider">
          LOADING
        </p>
      </div>
    </div>
  )
}

export default Loading