"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Image,
  Type,
  Maximize,
  SendHorizonal,
} from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const tools = [
  {
    title: "Caption Composer",
    description:
      "Transform raw speech into high-engagement text overlays that keep eyes on the screen.",
    icon: Sparkles,
  },
  {
    title: "Thumbnails Generator",
    description:
      "AI-curated visual hooks designed to maximize click-through rates across your feed.",
    icon: Image,
  },
  {
    title: "Cinematic Subtitles",
    description:
      "Burn cinematic subtitles directly into your footage with rhythmic, algorithm-friendly timing.",
    icon: Type,
  },
  {
    title: "Smart Aspect Switcher",
    description:
      "One-click adaptation for vertical, square, or landscape formats without losing focus.",
    icon: Maximize,
  },
  {
    title: "Instant Reel Export",
    description:
      "Bypass the render bar with cloud-optimized delivery that ships your reel to your device instantly.",
    icon: SendHorizonal,
  },
];

const ToolsSection: React.FC = () => {
  return (
    <motion.section
      className="bg-background py-24 border-t border-border"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={container}>
      <div className="max-w-[1440px] mx-auto px-10">
        <motion.div
          className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6"
          variants={item}>
          <div className="max-w-2xl">
            <h2 className="text-[42px] font-medium tracking-tight leading-[1.1] mb-4 text-foreground">
              The creator&apos;s powerhouse.
            </h2>
            <p className="text-muted-foreground text-lg">
              Advanced generative tools to scale your presence across every
              social channel.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool, idx) => (
            <motion.div
              key={idx}
              variants={item}
              className="p-10 rounded-[40px] bg-card border border-border flex flex-col items-start transition-colors hover:border-brand/20 group"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}>
              <div className="w-14 h-14 bg-background rounded-2xl flex items-center justify-center shadow-sm border border-border mb-8 group-hover:scale-110 transition-transform duration-200">
                <tool.icon className="w-7 h-7 text-brand" />
              </div>
              <h3 className="text-[24px] font-bold text-foreground mb-4 tracking-tight">
                {tool.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {tool.description}
              </p>
            </motion.div>
          ))}
          {/* Decorative CTA Box */}
          <motion.div
            variants={item}
            className="p-10 rounded-[40px] bg-primary text-primary-foreground flex flex-col items-center justify-center text-center space-y-6 group">
            <h3 className="text-[24px] font-bold tracking-tight">
              Ready to go viral?
            </h3>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/auth"
                className="inline-block bg-brand text-white px-8 py-3 rounded-full font-bold shadow-lg">
                Launch Social Studio
              </Link>
            </motion.div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
              Try Now for Free
            </p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default ToolsSection;
