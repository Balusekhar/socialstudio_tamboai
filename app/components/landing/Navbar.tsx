"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";

const Navbar: React.FC = () => {
  return (
    <motion.nav
      className="max-w-[1440px] mx-auto px-10 py-4 flex items-center justify-between"
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}>
      {/* Logo */}
      <motion.div
        className="flex items-center gap-2 flex-1"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-[34px] h-[34px] rounded-full border-[6px] border-brand flex items-center justify-center">
            <div className="w-[6px] h-[6px] bg-brand rounded-full"></div>
          </div>
          <span className="font-bold text-[22px] tracking-tight text-foreground">
            Social Studio
          </span>
        </Link>
      </motion.div>

      {/* Actions */}
      <div className="flex items-center justify-end flex-1 gap-3">
        <ThemeToggle />
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            href="/auth"
            className="inline-block bg-brand text-white px-9 py-4 rounded-full font-medium text-[15.5px] shadow-[0_15px_30px_rgba(0,0,0,0.18)]">
            Get Started
          </Link>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
