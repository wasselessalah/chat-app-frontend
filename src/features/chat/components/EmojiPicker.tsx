"use client";

import { useMemo, useState } from "react";
import { Search, X, Smile } from "lucide-react";

import { EMOJI_CATEGORIES } from "@/constants/chat.constants";

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

export function EmojiPicker({
  onSelect,
  onClose,
}: EmojiPickerProps) {
  const [search, setSearch] = useState("");

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return EMOJI_CATEGORIES;

    return EMOJI_CATEGORIES
      .map((category) => ({
        ...category,
        emojis: category.emojis.filter((emoji) =>
          emoji.toLowerCase().includes(query)
        ),
      }))
      .filter((category) => category.emojis.length > 0);
  }, [search]);

  return (
    <div
      className="
        absolute bottom-[4.5rem] left-3 z-50
        w-[340px] max-w-[calc(100vw-1.5rem)]
        overflow-hidden
        rounded-2xl border border-border/60
        bg-background/95 backdrop-blur-xl
        shadow-2xl shadow-black/10
        animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2
        duration-200
      "
    >
      {/* Header */}
      <div className="border-b border-border/60 px-3 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Smile className="h-4 w-4 text-primary" />
            </div>

            <div>
              <h3 className="text-sm font-semibold">
                Emojis
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Choose an emoji
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close emoji picker"
            className="
              flex h-8 w-8 items-center justify-center
              rounded-lg
              text-muted-foreground
              transition-all
              hover:bg-muted
              hover:text-foreground
              active:scale-95
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-ring
            "
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search */}
        <div className="relative my-3">
          <Search
            className="
              pointer-events-none
              absolute left-3 top-1/2
              h-4 w-4
              -translate-y-1/2
              text-muted-foreground
            "
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search emojis..."
            aria-label="Search emojis"
            className="
              h-9 w-full
              rounded-lg
              border border-border/60
              bg-muted/40
              pl-9 pr-3
              text-sm
              outline-none
              placeholder:text-muted-foreground
              transition-colors
              focus:border-primary/50
              focus:bg-background
              focus:ring-2
              focus:ring-primary/10
            "
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear emoji search"
              className="
                absolute right-2 top-1/2
                flex h-6 w-6
                -translate-y-1/2
                items-center justify-center
                rounded-md
                text-muted-foreground
                hover:bg-muted
                hover:text-foreground
              "
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Emoji content */}
      <div
        className="
          h-[280px]
          overflow-y-auto
          overscroll-contain
          px-3 py-2
          scrollbar-thin
          scrollbar-thumb-muted-foreground/20
          scrollbar-track-transparent
        "
      >
        {filteredCategories.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Smile className="h-6 w-6 text-muted-foreground" />
            </div>

            <p className="text-sm font-medium">
              No emojis found
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Try another search
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCategories.map((category) => (
              <section key={category.name}>
                {/* Category title */}
                <div className="sticky top-0 z-10 mb-1 bg-background/90 py-1 backdrop-blur-xl">
                  <p className="px-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {category.name}
                  </p>
                </div>

                {/* Emojis */}
                <div className="grid grid-cols-8 gap-0.5">
                  {category.emojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => onSelect(emoji)}
                      aria-label={`Select ${emoji}`}
                      className="
                        group
                        flex aspect-square
                        items-center justify-center
                        rounded-lg
                        text-xl
                        transition-all
                        duration-100
                        hover:bg-muted
                        hover:scale-110
                        active:scale-90
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-ring
                      "
                    >
                      <span
                        className="
                          transition-transform
                          duration-100
                          group-hover:scale-110
                        "
                      >
                        {emoji}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border/50 bg-muted/20 px-3 py-2">
        <p className="text-center text-[10px] text-muted-foreground">
          Click an emoji to add it to your message
        </p>
      </div>
    </div>
  );
}