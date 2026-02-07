import React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const Navbar: React.FC = () => {
  return (
    <nav className="max-w-[1440px] mx-auto px-10 py-4 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2 flex-1">
        <div className="w-[34px] h-[34px] rounded-full border-[6px] border-brand flex items-center justify-center">
          <div className="w-[6px] h-[6px] bg-brand rounded-full"></div>
        </div>
        <span className="font-bold text-[22px] tracking-tight text-foreground">
          IG Studio
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end flex-1 gap-3">
        <ThemeToggle />
        <Link
          href="/auth"
          className="bg-brand text-white px-9 py-4 rounded-full font-medium text-[15.5px] hover:scale-[1.02] transition-all shadow-[0_15px_30px_rgba(0,0,0,0.18)]">
          Get Started
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
