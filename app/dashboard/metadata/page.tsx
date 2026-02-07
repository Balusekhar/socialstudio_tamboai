import { AlignLeft, Hash, AtSign, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MetadataPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">
          Metadata
        </h1>
        <p className="text-muted-foreground">
          Generate optimized descriptions, hashtags, and mentions for your reels.
        </p>
      </div>

      {/* Editor Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Description */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <AlignLeft className="w-4 h-4 text-brand" />
              Description
            </h3>
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <Sparkles className="w-3 h-3" />
              Generate
            </Button>
          </div>
          <div className="bg-muted rounded-lg p-4 min-h-[120px]">
            <p className="text-sm text-muted-foreground italic">
              Upload a reel to auto-generate an optimized description based on your content and transcript...
            </p>
          </div>
        </div>

        {/* Hashtags */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <Hash className="w-4 h-4 text-brand" />
              Hashtags
            </h3>
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <Sparkles className="w-3 h-3" />
              Suggest
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "#reels", "#instagram", "#creator", "#contentcreator",
              "#viral", "#trending", "#socialmedia", "#igstudio",
              "#reelsinstagram", "#explore",
            ].map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center bg-brand/10 text-brand text-xs font-medium px-3 py-1.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: AlignLeft,
            title: "Smart Descriptions",
            description: "AI writes scroll-stopping descriptions from your video transcript.",
          },
          {
            icon: Hash,
            title: "Hashtag Research",
            description: "Get trending and niche-specific hashtags for maximum reach.",
          },
          {
            icon: AtSign,
            title: "Mention Suggestions",
            description: "Tag relevant accounts and brands to boost engagement.",
          },
        ].map((feature) => (
          <div
            key={feature.title}
            className="bg-card border border-border rounded-xl p-5"
          >
            <feature.icon className="w-5 h-5 text-brand mb-3" />
            <h4 className="font-medium text-foreground text-sm mb-1">
              {feature.title}
            </h4>
            <p className="text-xs text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
