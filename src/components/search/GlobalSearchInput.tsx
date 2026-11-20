
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { memo, useCallback, useEffect, useRef, useState } from "react";

const getInputDispatchDelay = (value: string, gapMs: number): number => {
  // Keep the text field feeling native: deletion must be instant, while
  // rapid typing gets only a tiny batch window so React never fights the caret.
  if (!value.trim()) return 0;
  if (gapMs >= 160) return 0;
  if (value.length > 80) return 70;
  if (value.length > 40) return 45;
  return 18;
};

interface GlobalSearchInputProps {
  autoFocus?: boolean;
  searchTerm: string;
  toolStats: { marketing: string };
  prediction?: string;
  onSearchChange: (value: string) => void;
  onFocus?: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onClear: () => void;
  onAcceptPrediction?: () => void;
}

const GlobalSearchInput = memo(({
  autoFocus = false,
  searchTerm,
  toolStats,
  prediction,
  onSearchChange,
  onFocus,
  onKeyDown,
  onClear,
  onAcceptPrediction,
}: GlobalSearchInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const queuedSearchIdRef = useRef(0);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastKeystrokeRef = useRef(0);

  // Keep visual typing fully local and instant
  const [localValue, setLocalValue] = useState(searchTerm);

  // Caret appears without a second tap when opened from a menu.
  useEffect(() => {
    if (!autoFocus) return;
    const id = requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(id);
  }, [autoFocus]);

  // Sync external changes (clear, navigation, prediction accept) without
  // letting the intentionally-debounced parent value overwrite fast typing.
  useEffect(() => {
    const inputIsFocused = document.activeElement === inputRef.current;
    const shouldSync = searchTerm === "" || !inputIsFocused;
    if (shouldSync && searchTerm !== localValue) {
      setLocalValue(searchTerm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // Zero-delay local paint, then debounce the parent state update so rapid
  // typing never thrashes React re-renders / blocks the input thread.
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value;
      const requestId = ++queuedSearchIdRef.current;

      setLocalValue(next);

      // Adaptive debounce: rapid keystrokes get lightly batched; slow typing and deleting stay instant.
      const now = performance.now();
      const gap = now - lastKeystrokeRef.current;
      lastKeystrokeRef.current = now;
      const delay = getInputDispatchDelay(next, gap);

      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      const dispatch = () => {
        if (queuedSearchIdRef.current === requestId) {
          onSearchChange(next);
        }
      };
      debounceTimerRef.current = setTimeout(dispatch, delay);
    },
    [onSearchChange]
  );

  // Cleanup pending debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  // Handle Tab key to accept prediction
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Tab" && prediction && onAcceptPrediction) {
        e.preventDefault();
        setLocalValue(prediction);
        onAcceptPrediction();
        return;
      }
      onKeyDown(e);
    },
    [prediction, onAcceptPrediction, onKeyDown]
  );

  const ghostText =
    prediction && localValue && prediction.toLowerCase().startsWith(localValue.toLowerCase())
      ? prediction.slice(localValue.length)
      : null;

  const handleContainerClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    queuedSearchIdRef.current += 1;
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    setLocalValue("");
    onClear();
  }, [onClear]);

  return (
    <div
      className="relative rounded-lg border-2 border-emerald-500/70 cursor-text overflow-hidden shadow-[0_0_18px_rgba(16,185,129,0.25)]"
      style={{ backgroundColor: "#ffffff" }}
      onClick={handleContainerClick}
      onPointerDown={onFocus}
      onPointerEnter={onFocus}
    >
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-600 w-4 h-4 pointer-events-none z-10" />

      {ghostText && (
        <div className="absolute inset-0 flex items-center pointer-events-none z-[2]">
          <span className="pl-10 text-transparent select-none">{localValue}</span>
          <span className="text-emerald-700/80 font-medium">
            {ghostText}
          </span>
          <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide text-emerald-800 bg-emerald-500/15 border border-emerald-600/40 hidden sm:inline">
            Tab ↹
          </span>
        </div>
      )}

      <Input
        ref={inputRef}
        type="text"
        placeholder={`Search ${toolStats.marketing} AI tools...`}
        value={localValue}
        onChange={handleChange}
        onFocus={onFocus}
        onKeyDown={handleKeyDown}
        className="pl-10 pr-10 border-0 bg-transparent text-neutral-900 placeholder:text-neutral-500 focus:ring-0 focus:outline-none rounded-lg relative z-[1] cursor-text font-medium"
        autoComplete="off"
        spellCheck={false}
        inputMode="search"
        autoCapitalize="none"
        autoCorrect="off"
        data-testid="global-search-input"
        aria-label="Search AI tools"
        aria-describedby="search-help"
      />

      <div id="search-help" className="sr-only">
        Use arrow keys to navigate results, Enter to open, Tab to accept suggestion, Escape to close
      </div>

      {localValue && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-foreground bg-card z-[10001]"
          aria-label="Clear search"
        >
          <X className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
});

GlobalSearchInput.displayName = "GlobalSearchInput";
export default GlobalSearchInput;
