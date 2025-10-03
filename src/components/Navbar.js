// components/UnomedNavbar.jsx
import { Menu } from "lucide-react";
import Image from "next/image";
import Button from "./Button";

export default function UnomedNavbar() {
  return (
    <nav className="w-full max-w-[640px] mx-auto py-4 px-4 sm:py-6 md:py-8">
      <div className="bg-primary min-h-[54px] sm:min-h-[60px] md:h-[66px] rounded-lg px-3 sm:px-4 md:px-navbar-x py-3 sm:py-3.5 md:py-navbar-y flex items-center justify-between shadow-lg animate-fade-in">
        
        {/* Logo Section */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          <Image
            src="/logo.png"
            alt="Unomed Logo"
            width={150}
            height={24}
            className="h-5 sm:h-5.5 md:h-6 w-auto"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
          {/* Login Button - responsive sizing */}
          <div className="hidden  sm:block">
            <Button text="Login" style="btn btn-primary"/>
          </div>
          
          {/* Mobile Login Button (icon only for very small screens) */}
          <div className="block sm:hidden">
            <Button text="Login" style="btn btn-primary text-xs px-2 py-1.5"/>
          </div>

          {/* Menu Button - responsive icon size */}
          <button className="icon-btn icon-btn-default p-1.5 sm:p-2">
            <Menu 
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-[28px] md:h-[28px]" 
              strokeWidth={2.75} 
            />
          </button>
        </div>
      </div>
    </nav>
  );
}