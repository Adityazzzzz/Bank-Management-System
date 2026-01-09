import React from 'react'

const Loading = () => {
    return (
        <div className="flex w-full h-screen items-center justify-center bg-gray-50/50">
            <div className="flex flex-col items-center gap-4">
                {/* Spinning Loader Icon */}
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-16 font-semibold text-blue-900 animate-pulse">
                    Loading Citadel Banking...
                </p>
            </div>
        </div>
    )
}

export default Loading