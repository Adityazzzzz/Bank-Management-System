"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Footer from "./Footer";
import PlaidLink from "./PlaidLink"; // Import this
import TwoFactorAuth from "./TwoFactorAuth"; // Import this

const MobileNav = ({ user }: MobileNavProps) => {
  const pathname = usePathname();

  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger>
          <Image
            src="/icons/hamburger.svg"
            width={30}
            height={30}
            alt="menu"
            className="cursor-pointer"
          />
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-white flex flex-col justify-between h-screen">
            {/* WRAPPER FOR SCROLLING CONTENT */}
            <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
                
              <Link href="/" className="cursor-pointer flex items-center gap-1 px-4 mb-4">
                <Image
                  src="/icons/logo.svg"
                  width={34}
                  height={34}
                  alt="Citadel logo"
                />
                <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">Citadel</h1>
              </Link>

              <div className="mobilenav-sheet">
                <SheetClose asChild>
                  <nav className="flex h-full flex-col gap-6 pt-16 text-white">
                    {sidebarLinks.map((item) => {
                      const isActive =
                        pathname === item.route || pathname.startsWith(`${item.route}/`);

                      return (
                        <SheetClose asChild key={item.route}>
                          <Link
                            href={item.route}
                            key={item.label}
                            className={cn("mobilenav-sheet_close w-full", {
                              "bg-bank-gradient": isActive,
                            })}
                          >
                            <Image
                              src={item.imgURL}
                              alt={item.label}
                              width={20}
                              height={20}
                              className={cn({
                                "brightness-[3] invert-0": isActive,
                              })}
                            />
                            <p
                              className={cn("text-16 font-semibold text-black-2", {
                                "text-white": isActive,
                              })}
                            >
                              {item.label}
                            </p>
                          </Link>
                        </SheetClose>
                      );
                    })}
                  </nav>
                </SheetClose>
              </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-gray-100 pt-6">
            <PlaidLink user={user} variant="ghost" />
            <div className="w-full px-2 max-xl:hidden [&>button]:w-full [&>button]:justify-center [&>button]:shadow-none [&>button]:bg-gray-50 [&>button]:text-gray-700 [&>button]:border-gray-200 [&>button]:hover:bg-gray-100">
                <TwoFactorAuth user={user} />
            </div>
            <Footer user={user} type="desktop" />
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;