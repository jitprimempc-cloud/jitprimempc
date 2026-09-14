import React, { useState } from 'react';
import { Lock, Sparkles, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AdminLoginProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onCancel }) => {
  const { login, settings } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLoginWithCreds = async (u: string, p: string) => {
    setLoading(true);
    setError(null);

    const cleanUser = u.trim();
    const cleanPass = p.trim();

    if (!cleanUser || !cleanPass) {
      setError('ইউজারনেম/ইমেইল এবং পাসওয়ার্ড আবশ্যক (Username/email and password required)');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUser, password: cleanPass })
      });
      if (res.ok) {
        const ct = res.headers.get('content-type');
        if (ct && ct.includes('application/json')) {
          const data = await res.json();
          if (data.success && data.token) {
            login(data.token, data.user);
            onSuccess();
            return;
          }
        }
      }
    } catch {
      // Backend not running or static host (Netlify / GitHub Pages) - seamlessly fallback
    }

    // Static / Offline Fallback Authentication (for Netlify, GitHub Pages, or offline mode)
    const customPwd = localStorage.getItem('jit_admin_custom_pwd');

    const validUsers = [
      { username: 'admin', email: 'admin@gmail.com', pass: ['Jit@123', 'admin123'], name: 'Admin', role: 'superadmin' },
      { username: 'admin', email: 'admin@jitprime.com', pass: ['Jit@123', 'admin123'], name: 'Admin', role: 'superadmin' },
      { username: 'monojit', email: 'monojitdey189@gmail.com', pass: ['jitprime85219', 'Jit@123'], name: 'Monojit Dey', role: 'superadmin' }
    ];

    const matched = validUsers.find(acc => {
      const userMatches = acc.username.toLowerCase() === cleanUser.toLowerCase() || 
                          acc.email.toLowerCase() === cleanUser.toLowerCase();
      if (!userMatches) return false;

      // Match default passwords or custom password updated from admin settings
      const passMatches = acc.pass.includes(cleanPass) || (customPwd && cleanPass === customPwd);
      return passMatches;
    });

    if (matched) {
      const demoToken = 'jit_admin_token_' + Date.now();
      login(demoToken, {
        id: 'admin-' + matched.username,
        username: matched.username,
        email: matched.email,
        role: matched.role
      });
      onSuccess();
    } else {
      setError('ভুল ইউজারনেম/ইমেইল বা পাসওয়ার্ড। অনুগ্রহ করে সঠিক পাসওয়ার্ড দিয়ে চেষ্টা করুন। (Invalid credentials)');
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLoginWithCreds(username, password);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden">
        
        {/* Header */}
        <div className="bg-linear-to-r from-[#0B1A30] to-[#152E54] text-white p-6 sm:p-8 border-b-2 border-amber-400 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center mx-auto mb-3 shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold font-serif-heading">Admin Management Portal</h2>
          <p className="text-xs text-slate-300 mt-1">
            {settings?.companyName || 'Jit Prime MPC Company'} &bull; {settings?.ownerName || 'Monojit Dey'}
          </p>
        </div>

        {/* Form */}
        <div className="p-6 sm:p-8 space-y-5">
          {error && (
            <div className="p-3.5 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Admin Username or Email (ইউজারনেম বা ইমেইল)
              </label>
              <input
                type="text"
                required
                autoComplete="username"
                placeholder="admin@gmail.com বা monojitdey189@gmail.com"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 outline-hidden text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Password (পাসওয়ার্ড)
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                placeholder="আপনার অ্যাডমিন পাসওয়ার্ড লিখুন"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 outline-hidden text-slate-900 font-medium"
              />
            </div>

            <div className="pt-3 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl text-xs cursor-pointer transition-colors"
              >
                Back to Website
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Verifying...' : 'Sign In (লগইন করুন)'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};
