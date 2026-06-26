import { z } from "zod";
import { useState } from "react";

export const ImageCardProps = z.object({
  prompt: z.string().describe("A detailed visual description of the image to generate"),
  title: z.string().optional().describe("Optional title to display above the image"),
  description: z.string().optional().describe("Optional caption to display below the image"),
});

type ImageCardPropsType = z.infer<typeof ImageCardProps>;

function buildImageUrl(prompt: string): string {
  const encoded = encodeURIComponent(prompt);
  return `https://image.pollinations.ai/prompt/${encoded}?width=600&height=400&nologo=true&seed=${Math.floor(Math.random() * 99999)}`;
}

export function ImageCard({ prompt, title, description }: ImageCardPropsType) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const imageUrl = buildImageUrl(prompt);

  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden max-w-lg">
      {title && (
        <div className="px-4 pt-3 pb-1 font-semibold text-gray-800 text-sm">{title}</div>
      )}

      <div className="relative w-full bg-gray-100" style={{ minHeight: 240 }}>
        {!loaded && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400 text-sm">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            <span>Generating image…</span>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-500 text-sm px-4 text-center">
            <span>⚠️ Image failed to load.</span>
            <button
              onClick={() => { setError(false); setLoaded(false); setRetryKey(k => k + 1); }}
              className="px-3 py-1.5 rounded-md border border-gray-200 text-xs hover:bg-gray-50 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        <img
          key={retryKey}
          src={imageUrl}
          alt={title || prompt}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`w-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
          style={{ display: error ? "none" : "block" }}
        />
      </div>

      {description && (
        <div className="px-4 py-2 text-xs text-gray-500">{description}</div>
      )}

      <div className="px-4 py-2 text-xs text-gray-300 italic truncate border-t border-gray-50">
        {prompt}
      </div>
    </div>
  );
}
