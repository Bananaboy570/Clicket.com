import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { BlookArt, BlooketTokenIcon } from './BlookArt';

export interface TradeHistoryItem {
  id: string;
  timestamp: string;
  partnerUsername: string;
  gaveBlookId: string;
  receivedBlookId: string;
}

export interface AuthenticatedUser {
  id: string;
  username: string;
  email: string;
  verified: boolean;
  tokens: number;
  inventory: Record<string, number>;
  clickUpgradeLevel: number;
  bestDailyClicks: number;
  equippedBlookId: string;
  lastDailyPlayAt?: number | null;
  lastWheelSpinAt?: number | null;
  tradeHistory?: TradeHistoryItem[];
}

interface AuthScreenProps {
  onAuthenticated: (user: AuthenticatedUser, sessionToken: string) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticated }) => {
  const [mode, setMode] = useState<'SIGNUP' | 'LOGIN'>('SIGNUP');

  // Form fields (Username and Password only)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUsername = username.trim();
    if (cleanUsername.length < 2) {
      setError('Username must be at least 2 characters.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: cleanUsername,
          password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Sign up failed.');
        return;
      }

      onAuthenticated(data.user, data.sessionToken);
    } catch {
      setError('Network error while creating account.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUsername = username.trim();
    if (!cleanUsername || !password) {
      setError('Please enter your username and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: cleanUsername,
          password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed.');
        return;
      }

      onAuthenticated(data.user, data.sessionToken);
    } catch {
      setError('Network error while logging in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#f87171] flex flex-col items-center justify-center p-4 relative overflow-y-auto select-none">
      {/* Subtle Checkered Background Pattern */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.09]"
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.6) 2px, transparent 2px), linear-gradient(15deg, rgba(255,255,255,0.22) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.22) 75%, transparent 75%, transparent)`,
          backgroundSize: '110px 110px',
        }}
      />

      {/* Top Red Bar with CLICKET Logo */}
      <div className="fixed top-0 inset-x-0 h-16 bg-[#dc2626] shadow-[0_4px_15px_rgba(0,0,0,0.18)] flex items-center justify-between px-6 z-20">
        <span
          className="text-white tracking-wide drop-shadow-[0_2px_0_rgba(0,0,0,0.2)]"
          style={{
            fontFamily: "'Lexend', sans-serif",
            fontWeight: 'bold',
            fontSize: '33px',
            lineHeight: '57px',
          }}
        >
          CLICKET
        </span>
        <div className="flex items-center gap-2 text-white/90 font-nunito font-extrabold text-sm">
          <BlooketTokenIcon className="w-5 h-5" />
          <span>Circus Pack Edition</span>
        </div>
      </div>

      {/* Main Auth Container */}
      <div className="relative z-10 w-full max-w-md mt-16">
        {/* Decorative Blooks Peeking Above Card */}
        <div className="flex items-end justify-center gap-4 -mb-4 relative z-20 pointer-events-none">
          <div className="w-16 h-16 -rotate-12 drop-shadow-md">
            <BlookArt id="tightrope-walker" className="w-full h-full" />
          </div>
          <div className="w-20 h-20 drop-shadow-lg">
            <BlookArt id="jester" className="w-full h-full" />
          </div>
          <div className="w-16 h-16 rotate-12 drop-shadow-md">
            <BlookArt id="magician" className="w-full h-full" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-7 shadow-[0_10px_0_rgba(0,0,0,0.18)] border-4 border-[#dc2626]/20">
          {/* Segmented Sign Up / Log In Switch */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('SIGNUP');
                setError(null);
              }}
              className={`py-2.5 rounded-xl font-titan text-lg transition-all cursor-pointer ${
                mode === 'SIGNUP'
                  ? 'bg-[#dc2626] text-white shadow-[0_3px_0_#991b1b]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('LOGIN');
                setError(null);
              }}
              className={`py-2.5 rounded-xl font-titan text-lg transition-all cursor-pointer ${
                mode === 'LOGIN'
                  ? 'bg-[#dc2626] text-white shadow-[0_3px_0_#991b1b]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Log In
            </button>
          </div>

          {error && (
            <div className="mb-4 px-4 py-2.5 rounded-xl bg-rose-50 border-2 border-rose-200 text-rose-700 font-nunito font-extrabold text-sm">
              {error}
            </div>
          )}

          {/* SIGN UP OR LOG IN FORM (USERNAME + PASSWORD ONLY) */}
          <form
            onSubmit={mode === 'SIGNUP' ? handleSignUp : handleLogIn}
            className="flex flex-col gap-4"
          >
            <div>
              <label className="block font-nunito font-black text-xs text-slate-500 mb-1">
                USERNAME
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  maxLength={30}
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={mode === 'SIGNUP' ? 'Choose a unique username' : 'Enter your username'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-slate-200 font-nunito font-bold text-slate-800 focus:outline-none focus:border-[#dc2626]"
                />
              </div>
              {mode === 'SIGNUP' && (
                <p className="mt-1 font-nunito font-bold text-[11px] text-slate-400">
                  Every player must have a unique username.
                </p>
              )}
            </div>

            <div>
              <label className="block font-nunito font-black text-xs text-slate-500 mb-1">
                PASSWORD
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border-2 border-slate-200 font-nunito font-bold text-slate-800 focus:outline-none focus:border-[#dc2626]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full py-3 rounded-2xl bg-[#f87171] hover:brightness-105 active:translate-y-0.5 active:shadow-none shadow-[0_5px_0_#dc2626] text-white font-titan text-xl tracking-wide cursor-pointer transition-all disabled:opacity-60"
            >
              {loading
                ? mode === 'SIGNUP'
                  ? 'Creating Account...'
                  : 'Logging In...'
                : mode === 'SIGNUP'
                ? 'Sign Up & Enter CLICKET'
                : 'Log In to CLICKET'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
