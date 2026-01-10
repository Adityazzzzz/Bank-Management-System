"use client";

import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Footer from './Footer'
import TwoFactorAuth from './TwoFactorAuth'

const Sidebar = ({ user }: SiderbarProps) => {
  const pathname = usePathname();

  return (
    <section className="sticky left-0 top-0 flex h-screen w-fit flex-col justify-between border-r border-gray-200 bg-white pt-8 text-white max-md:hidden sm:p-4 xl:p-6 shadow-sm">
      <nav className="flex flex-col gap-4">
        {/* LOGO AREA */}
        <Link href="/" className="mb-8 flex cursor-pointer items-center gap-3 px-4">
          <Image 
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="Citadel logo"
            className="size-[32px] max-xl:size-14"
          />
          <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1 max-xl:hidden">Citadel</h1>
        </Link>

        {/* NAVIGATION LINKS */}
        <div className="flex flex-col gap-2">
            {sidebarLinks.map((item) => {
            const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`)

            return (
                <Link href={item.route} key={item.label}
                className={cn('flex gap-3 items-center py-3 md:p-3 2xl:p-4 rounded-full transition-all duration-200 group', {
                    'bg-blue-50 text-blue-700 font-bold': isActive, // Soft Blue Pill for Active
                    'text-gray-600 hover:bg-gray-50 hover:text-gray-900': !isActive // Clean gray for inactive
                })}
                >
                <div className="relative size-6">
                    <Image 
                    src={item.imgURL}
                    alt={item.label}
                    fill
                    className={cn({
                        'brightness-[3] invert-0': isActive, // Keep active icon blue/white depending on your icon set
                        'filter-grey': !isActive // You might need to adjust this depending on your SVG colors
                    })}
                    // FIX: If your icons are black by default, use this filter for the Blue Active State:
                    style={{ filter: isActive ? 'invert(28%) sepia(96%) saturate(1832%) hue-rotate(213deg) brightness(96%) contrast(96%)' : '' }}
                    />
                </div>
                <p className={cn('text-16 font-medium max-xl:hidden', {
                    'text-blue-700': isActive,
                    'text-gray-600': !isActive
                })}>
                    {item.label}
                </p>
                </Link>
            )
            })}
        </div>
      </nav>

      {/* NEW: UNIFIED USER CONTROL CENTER */}
      {/* This groups the Footer and 2FA into one clean "Account Box" at the bottom */}
      <div className="flex flex-col gap-3 border-t border-gray-100 pt-6">
        
        {/* 2FA Button (Full Width) */}
        <div className="w-full px-2 max-xl:hidden [&>button]:w-full [&>button]:justify-center [&>button]:shadow-none [&>button]:bg-gray-50 [&>button]:text-gray-700 [&>button]:border-gray-200 [&>button]:hover:bg-gray-100">
            <TwoFactorAuth user={user} />
        </div>

        {/* Profile Info */}
        <Footer user={user} type="desktop" />
      </div>
    </section>
  )
}

export default Sidebar