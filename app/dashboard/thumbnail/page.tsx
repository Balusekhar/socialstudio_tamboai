import { ImageIcon, Sparkles, Crop, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";

const sampleThumbnails = [
  "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop",
];

export default function ThumbnailPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">
          Thumbnail
        </h1>
        <p className="text-muted-foreground">
          Create eye-catching thumbnails for your reels with AI assistance.
        </p>
      </div>

      {/* Thumbnail Grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground">
            AI Generated Thumbnails
          </h2>
          <Button variant="outline" size="sm" className="gap-2">
            <Sparkles className="w-4 h-4" />
            Generate New
          </Button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {sampleThumbnails.map((src, i) => (
            <div
              key={i}
              className="group relative aspect-video bg-muted rounded-xl overflow-hidden border border-border hover:border-brand/40 transition-colors cursor-pointer"
            >
              <img
                src={src}
                alt={`Thumbnail variant ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Select
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: ImageIcon,
            title: "Auto Resize",
            description: "Automatically crop and scale to 16:9 and 9:16 for feeds and stories.",
          },
          {
            icon: Crop,
            title: "Smart Crop",
            description: "AI detects the best focal point and crops around it.",
          },
          {
            icon: Palette,
            title: "Style Transfer",
            description: "Apply your brand colors and style to any thumbnail.",
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
