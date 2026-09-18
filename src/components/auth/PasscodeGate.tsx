import React, { useState, useEffect, useRef } from 'react';
import { Lock, ArrowRight } from 'lucide-react';

interface PasscodeGateProps {
  onUnlock: () => void;
  onComplete?: () => void;
}

export const PasscodeGate: React.FC<PasscodeGateProps> = ({ onUnlock, onComplete }) => {
  const [pin, setPin] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const verify = (code: string) => {
    if (code === '7788') {
      setIsError(false);
      setIsSuccess(true);
      onUnlock();

      // Graceful pacing: let the 4th dot clearly appear and turn emerald, then dissolve even slower & smoother
      setTimeout(() => {
        setIsExiting(true);
      }, 400);

      setTimeout(() => {
        onComplete?.();
      }, 1900);
    } else if (code.length >= 4) {
      setIsError(true);
      setTimeout(() => {
        setPin('');
        setIsError(false);
      }, 500);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPin(val);
    setIsError(false);
    if (val === '7788') {
      verify(val);
    } else if (val.length === 4) {
      verify(val);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verify(pin);
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-slate-950 flex items-center justify-center p-4 selection:bg-slate-700 transition-all duration-[1400ms] ease-[cubic-bezier(0.25,1,0.35,1)] ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      onClick={() => inputRef.current?.focus()}
    >
      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-xs bg-slate-900 border rounded-2xl p-6 shadow-2xl transition-all duration-[1400ms] ease-[cubic-bezier(0.25,1,0.35,1)] transform ${
          isExiting
            ? 'scale-[0.96] opacity-0 -translate-y-1.5 border-emerald-500/80 shadow-emerald-500/20'
            : isError
            ? 'border-red-500/60 shadow-red-500/10 animate-shake'
            : isSuccess
            ? 'border-emerald-500/70 shadow-emerald-500/10 scale-[1.02]'
            : 'border-slate-800 hover:border-slate-700'
        }`}
      >
        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center mb-5 transition-colors duration-300 ${
              isError
                ? 'bg-red-500/10 text-red-400'
                : isSuccess
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            <Lock className="w-4 h-4" />
          </div>

          {/* Sleek 4-digit indicators */}
          <div className="flex items-center justify-center gap-3 mb-6">
            {[0, 1, 2, 3].map((idx) => {
              const hasChar = Boolean(pin[idx]);
              return (
                <div
                  key={idx}
                  className={`w-11 h-12 rounded-xl border flex items-center justify-center transition-all duration-300 ease-out ${
                    isError
                      ? 'border-red-500/60 bg-red-500/10'
                      : isSuccess
                      ? 'border-emerald-500/70 bg-emerald-500/10'
                      : hasChar
                      ? 'border-slate-400 bg-slate-800 shadow-inner'
                      : 'border-slate-800 bg-slate-950/60'
                  }`}
                >
                  {hasChar && (
                    <span
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ease-out transform ${
                        isError
                          ? 'bg-red-400'
                          : isSuccess
                          ? 'bg-emerald-400 scale-110'
                          : 'bg-white scale-100'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Hidden functional input */}
          <input
            ref={inputRef}
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            value={pin}
            onChange={handleChange}
            className="sr-only"
            autoComplete="off"
            autoFocus
          />

          {/* Sleek action row */}
          <button
            type="submit"
            disabled={pin.length < 4}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-medium tracking-wide flex items-center justify-center space-x-1.5 transition-all ${
              isSuccess
                ? 'bg-emerald-600 text-white'
                : pin.length === 4
                ? 'bg-slate-100 hover:bg-white text-slate-900 shadow-md cursor-pointer'
                : 'bg-slate-800/80 text-slate-500 cursor-default'
            }`}
          >
            <span>Continue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
