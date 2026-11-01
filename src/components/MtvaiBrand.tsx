import wordmark from '@/assets/mtvai-live-wordmark.png';
import { cn } from '@/lib/utils';

/** A shared channel signature; existing AIWebTools marks and footage remain intact. */
export default function MtvaiBrand({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn('mtvai-brand inline-flex flex-col items-center shrink-0', compact ? 'w-[116px]' : 'w-[190px] sm:w-[220px]', className)}>
      <img src={wordmark} alt="MTVAI.live" width={1459} height={282} className="block w-full h-auto" draggable={false} />
      <span className={cn('block font-mono text-center text-muted-foreground leading-tight whitespace-nowrap', compact ? 'text-[7px]' : 'text-[10px]')}>Presented by <span className="text-primary">aiwebtools.app</span></span>
    </span>
  );
}