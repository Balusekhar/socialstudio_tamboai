import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-background py-12 border-t border-border">
      <div className="max-w-[1440px] mx-auto px-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 border-4 border-brand rounded-full flex items-center justify-center">
              <div className="w-1 h-1 bg-brand rounded-full"></div>
            </div>
            <span className="font-bold text-lg tracking-tight text-foreground">
              Social Studio
            </span>
          </div>

          <div className="flex space-x-8 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              LinkedIn
            </a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-border pt-8">
          <p className="text-muted-foreground text-[13px] font-medium">
            &copy; {new Date().getFullYear()} Social Studio. All rights reserved.
          </p>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">
              Project Submission
            </span>
            <div className="h-4 w-px bg-border mx-2"></div>
            <p className="text-muted-foreground text-[11px] font-medium">
              Proudly built for{" "}
              <a
                href="https://www.wemakedevs.org/hackathons/tambo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-brand underline decoration-border underline-offset-4">
                WeMakeDevs
              </a>{" "}
              ×{" "}
              <a
                href="https://tambo.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-brand underline decoration-border underline-offset-4">
                Tambo AI
              </a>{" "}
              Hackathon
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
