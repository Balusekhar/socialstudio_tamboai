"use client";

import { useEffect, useRef, useState } from "react";
import { useTamboThread, useTamboThreadInput } from "@tambo-ai/react";
import { X, Send, Loader2, MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TamboChatProps {
  open: boolean;
  onClose: () => void;
}

export default function TamboChat({ open, onClose }: TamboChatProps) {
  const { thread, isIdle, generationStage, startNewThread } = useTamboThread();
  const { value, setValue, submit, isPending } = useTamboThreadInput();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread?.messages]);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!value.trim() || isPending) return;
    await submit({ streamResponse: true });
  };

  const handleClearChat = () => {
    startNewThread();
    setValue("");
  };

  if (!mounted) return null;

  const messages = thread?.messages ?? [];

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      {/* Chat Panel - full width on mobile, 420px from sm up; safe area for notched devices */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[100vw] z-50 bg-background border-l border-border shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        } sm:w-[380px] md:w-[420px] pb-[env(safe-area-inset-bottom)]`}
      >
        {/* Header - touch-friendly min height */}
        <div className="flex items-center justify-between gap-2 px-3 py-3 sm:px-4 border-b border-border shrink-0 min-h-[52px]">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <img
              src="/tambo.png"
              alt="Tambo"
              className="w-6 h-6 rounded shrink-0"
            />
            <h2 className="text-sm font-semibold text-foreground truncate">
              AI Assistant
            </h2>
            {!isIdle && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-brand font-medium bg-brand/10 px-2 py-0.5 rounded-full shrink-0">
                <Loader2 className="w-2.5 h-2.5 animate-spin" />
                {generationStage === "CHOOSING_COMPONENT"
                  ? "Thinking..."
                  : generationStage === "FETCHING_CONTEXT"
                  ? "Fetching..."
                  : generationStage === "HYDRATING_COMPONENT"
                  ? "Building..."
                  : generationStage === "STREAMING_RESPONSE"
                  ? "Responding..."
                  : "Processing..."}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {messages.length > 0 && (
              <button
                onClick={handleClearChat}
                disabled={!isIdle}
                className="min-w-[44px] min-h-[44px] sm:min-w-[36px] sm:min-h-[36px] rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:pointer-events-none"
                title="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="min-w-[44px] min-h-[44px] sm:min-w-[36px] sm:min-h-[36px] rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages - responsive padding and scroll */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 sm:px-4 space-y-4 min-h-0">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[200px] sm:min-h-0 sm:h-full text-center px-4 sm:px-6">
              <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center mb-3 shrink-0">
                <MessageSquare className="w-6 h-6 text-brand" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">
                How can I help?
              </h3>
              <p className="text-xs text-muted-foreground max-w-[260px]">
                Ask me to generate thumbnails, captions, scripts, logos, brand
                names, SEO metadata, or manage your content calendar.
              </p>
              <div className="mt-4 space-y-2 w-full max-w-[280px]">
                {[
                  "Generate a thumbnail for my coding tutorial",
                  "I want captions for a video",
                  "Add an event to my calendar for tomorrow",
                  "Create a logo for my brand",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    className="w-full text-left text-xs bg-muted hover:bg-muted/80 border border-border rounded-lg px-3 py-3 sm:py-2 text-foreground transition-colors min-h-[44px] sm:min-h-0"
                    onClick={() => setValue(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => {
            const isUser = message.role === "user";
            const Component = message.renderedComponent;

            // Extract text from content array
            const textContent = Array.isArray(message.content)
              ? message.content
                  .filter(
                    (part: { type: string; text?: string }) =>
                      part.type === "text" && part.text
                  )
                  .map((part: { text?: string }) => part.text)
                  .join("")
              : typeof message.content === "string"
              ? message.content
              : "";

            return (
              <div
                key={message.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[95%] sm:max-w-[90%] min-w-0 ${
                    isUser
                      ? "bg-brand text-white rounded-2xl rounded-br-md px-3 py-2"
                      : "space-y-2"
                  }`}
                >
                  {textContent && (
                    <div
                      className={
                        isUser
                          ? "text-xs leading-relaxed wrap-break-word"
                          : "bg-muted rounded-2xl rounded-bl-md px-3 py-2 text-xs text-foreground leading-relaxed whitespace-pre-wrap wrap-break-word"
                      }
                    >
                      {textContent}
                    </div>
                  )}
                  {Component && (
                    <div className="mt-2 overflow-x-auto">
                      {Component}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {/* Input - touch-friendly height on mobile */}
        <form
          onSubmit={handleSubmit}
          className="shrink-0 border-t border-border px-3 py-3 sm:px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        >
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask anything..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={isPending}
              className="flex-1 min-w-0 text-sm bg-muted border border-border rounded-xl px-3 py-2.5 sm:py-2 min-h-[44px] sm:min-h-[36px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:opacity-50"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!value.trim() || isPending}
              className="bg-brand hover:bg-brand/90 text-white h-11 w-11 sm:h-9 sm:w-9 rounded-xl shrink-0 min-w-[44px] min-h-[44px] sm:min-w-[36px] sm:min-h-[36px]"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
