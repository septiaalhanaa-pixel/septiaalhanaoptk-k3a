import React, { useState } from 'react';
import { Lock, Mail, ShieldCheck, X, Ship, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { UserSession } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserSession) => void;
  onLoginApi: (email: string, pass: string) => Promise<{ success: boolean; user?: UserSession; message?: string }>;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onLoginApi
}) => {
  const [email, setEmail] = useState('admin@pelayaran.co.id');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await onLoginApi(email, password);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
        onClose();
      } else {
        setErrorMsg(res.message || 'Login gagal. Silakan periksa kredensial Anda.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem saat otentikasi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (role: 'admin' | 'supervisor' | 'customer') => {
    if (role === 'admin') {
      setEmail('admin@pelayaran.co.id');
      setPassword('admin123');
    } else if (role === 'supervisor') {
      setEmail('supervisor@pelayaran.co.id');
      setPassword('spv123');
    } else {
      setEmail('logistik@customer.com');
      setPassword('cust123');
    }
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Ship className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Portal Login TOS Maritim</h2>
              <p className="text-xs text-slate-400">Terminal Operating System Pelayaran</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-2">
            Masuk untuk mengakses otoritas operasional terminal peti kemas, gate control, manifest kapal, dan analitik.
          </p>
        </div>

        {/* Quick Demo Credentials */}
        <div className="bg-slate-50 border-b border-slate-200 p-4">
          <div className="text-xs font-semibold text-slate-600 mb-2 flex items-center justify-between">
            <span>Pilih Akun Demo Cepat:</span>
            <span className="text-[10px] text-blue-600 font-normal">Klik untuk mengisi form</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              className={`text-xs p-2 rounded-lg border text-left transition-all ${
                email.includes('admin')
                  ? 'bg-blue-50 border-blue-400 text-blue-800 font-semibold'
                  : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="font-bold flex items-center gap-1">
                Admin
                {email.includes('admin') && <Check className="w-3 h-3 text-blue-600" />}
              </div>
              <div className="text-[10px] text-slate-500 truncate">Akses Penuh CRUD</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('supervisor')}
              className={`text-xs p-2 rounded-lg border text-left transition-all ${
                email.includes('supervisor')
                  ? 'bg-blue-50 border-blue-400 text-blue-800 font-semibold'
                  : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="font-bold flex items-center gap-1">
                Supervisor
                {email.includes('supervisor') && <Check className="w-3 h-3 text-blue-600" />}
              </div>
              <div className="text-[10px] text-slate-500 truncate">Vessel & Gate</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('customer')}
              className={`text-xs p-2 rounded-lg border text-left transition-all ${
                email.includes('customer') || email.includes('indofood')
                  ? 'bg-blue-50 border-blue-400 text-blue-800 font-semibold'
                  : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="font-bold flex items-center gap-1">
                Pelanggan
                {(email.includes('customer') || email.includes('indofood')) && <Check className="w-3 h-3 text-blue-600" />}
              </div>
              <div className="text-[10px] text-slate-500 truncate">Lacak & Notifikasi</div>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Username atau Email Operasional
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="input-login-email"
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@pelayaran.co.id"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="input-login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <span>Ingat sesi terminal</span>
            </label>
            <span className="text-blue-600 hover:underline cursor-pointer">Lupa PIN/Sandi?</span>
          </div>

          <button
            id="btn-submit-login"
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white py-2.5 px-4 rounded-lg font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
          >
            {isLoading ? (
              <span>Memverifikasi Database...</span>
            ) : (
              <>
                <span>Masuk ke Sistem TOS</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
