import { X } from "lucide-react";
import { EMOJI_CATEGORIES } from "@/constants/chat.constants";

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

export function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  return (
    <div className="absolute bottom-18 left-4 z-30 w-80 bg-background/95 backdrop-blur border rounded-2xl shadow-xl p-3 flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
      <div className="flex items-center justify-between border-b pb-2 px-1 shrink-0">
        <span className="text-xs font-semibold text-muted-foreground">Emojis</span>
        <button
          type="button"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="max-h-60 overflow-y-auto pr-1 flex flex-col gap-3">
        {EMOJI_CATEGORIES.map((cat) => (
          <div key={cat.name}>
            <p className="text-[10px] font-semibold text-muted-foreground mb-1 px-1 sticky top-0 bg-background/95 py-1 z-10 backdrop-blur">
              {cat.name}
            </p>
            <div className="grid grid-cols-7 gap-1">
              {cat.emojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => onSelect(emoji)}
                  className="h-8 w-8 flex items-center justify-center text-lg rounded-md hover:bg-muted hover:scale-125 transition-all cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
