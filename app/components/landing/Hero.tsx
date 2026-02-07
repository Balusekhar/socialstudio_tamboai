import React from "react";
import Link from "next/link";

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-4 pb-8">
      <div className="max-w-[1440px] mx-auto px-10">
        <div className="flex flex-col items-start">
          {/* Tambo AI Pill Badge */}
          <div className="mb-6 ms-1">
            <a
              href="https://tambo.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-muted border border-border rounded-full pl-1.5 pr-4 py-1.5 hover:bg-accent transition-colors group">
              <div className="w-7 h-7 rounded-full overflow-hidden bg-background border border-border shrink-0">
                <img
                  src="/tambo.png"
                  alt="Tambo AI"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[13px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                UI powered by <span className="font-semibold text-foreground">Tambo AI</span>
              </span>
              <svg
                className="w-3.5 h-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Headline Section */}
          <div className="mb-10 w-full">
            <h1
              className="text-[72px] lg:text-[108px] leading-[0.98] tracking-[-0.045em] text-foreground font-inter"
              style={{
                fontWeight: 400,
                maxWidth: "1100px",
                height: "auto",
              }}>
              Big stories, tight edits, supercharge
              <span className="inline-flex items-center align-baseline px-1 translate-y-[8px]">
                <svg
                  className="w-[60px] h-[60px] lg:w-[90px] lg:h-[90px] fill-[#FFD700]"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </span>
              your creator brand!
            </h1>
          </div>

          {/* Sub-paragraph */}
          <div
            className="mb-10"
            style={{ maxWidth: "600px" }}>
            <p
              className="text-[16px] lg:text-[18px] leading-[1.6] text-muted-foreground font-inter"
              style={{ fontWeight: 400 }}>
              Your go-to studio for designs that inspire and strategies that
              deliver. Automate your editing, generate captions, and schedule
              viral content. We turn ideas into lasting impressions.
            </p>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col items-start gap-6 mb-8">
            <Link
              href="/auth"
              className="bg-brand text-white px-10 py-5 rounded-full font-medium text-[17px] hover:scale-[1.02] transition-all shadow-[0_25px_50px_rgba(0,0,0,0.22)]">
              Start Creating Free
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
