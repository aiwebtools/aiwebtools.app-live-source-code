import { useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { hasAngelUnlock, saveAngelUnlock } from '@/utils/angelUnlock';

const safeStorage = (kind: 'localStorage' | 'sessionStorage') => ({
  getItem: (key: string) => { try { return window[kind].getItem(key); } catch { return null; } },
  setItem: (key: string, value: string) => { try { window[kind].setItem(key, value); } catch { /* other storage remains available */ } },
});
export default function AngelNumberGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(() => hasAngelUnlock(safeStorage('localStorage'), safeStorage('sessionStorage')));
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  if (unlocked) return <>{children}</>;
  return <main className="fixed inset-0 z-[2147483647] flex items-center justify-center overflow-y-auto bg-background px-6 py-10 text-foreground" aria-label="Angel Number Gate">
    <form className="w-full max-w-md space-y-6 text-center" onSubmit={event => {
      event.preventDefault();
      if (saveAngelUnlock(code.trim(), safeStorage('localStorage'), safeStorage('sessionStorage'))) setUnlocked(true);
      else setError('That number is not correct. Please try again.');
    }}>
      <p className="text-lg font-bold text-primary">AIWEBTOOLS.AI</p>
      <h1 className="text-3xl font-bold">Angel Number Gate</h1>
      <label htmlFor="angel-number" className="block text-muted-foreground">Enter the angel number · 1111</label>
      <Input id="angel-number" autoFocus inputMode="numeric" autoComplete="off" maxLength={4} value={code} onChange={event => { setCode(event.target.value.replace(/\D/g,'')); setError(''); }} className="h-14 text-center text-2xl" />
      {error && <p role="alert" className="text-foreground">{error}</p>}
      <Button type="submit" className="h-12 w-full">Enter AI Web Tools</Button>
    </form>
  </main>;
}