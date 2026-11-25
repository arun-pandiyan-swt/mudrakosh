import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  RotateCw, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  ArrowRight,
  Eye,
  EyeOff,
  Globe
} from 'lucide-react';
import { ROLES } from './Header';

interface LoginViewProps {
  onLogin: (role: string, username: string) => void;
  lang: 'en' | 'as';
  setLang: (lang: 'en' | 'as') => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, lang, setLang }) => {
  const [selectedRole, setSelectedRole] = useState('Director');
  const [identifier, setIdentifier] = useState('director.dps@assam.gov.in');
  const [password, setPassword] = useState('MudraKosh@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [generatedCaptcha, setGeneratedCaptcha] = useState('7K9P4');
  const [captchaInput, setCaptchaInput] = useState('7K9P4');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [authMethod, setAuthMethod] = useState<'password' | 'otp' | 'parichay'>('password');
  const [otpSent, setOtpSent] = useState(false);

  const roleCredentials: Record<string, { email: string; name: string }> = {
    'Director': { email: 'director.dps@assam.gov.in', name: 'S. N. Talukdar, IAS' },
    'Store Officer': { email: 'storeofficer.dps@assam.gov.in', name: 'D. K. Baruah' },
    'Storekeeper': { email: 'storekeeper.guw@assam.gov.in', name: 'Pranjal Saikia' },
    'Press Supervisor': { email: 'press.supervisor@assam.gov.in', name: 'Manabendra Sarma' },
    'Gate Guard': { email: 'gate.security@assam.gov.in', name: 'Havildar T. Gogoi' },
    'Delivery Driver': { email: 'driver.fleet@assam.gov.in', name: 'Rupam Borah' },
    'Recipient DDO': { email: 'gad.nodal@assam.gov.in', name: 'Kabita Das, ACS' },
    'Super Admin': { email: 'admin.mudrakosh@assam.gov.in', name: 'System Administrator' }
  };

  const handleRoleChange = (roleId: string) => {
    setSelectedRole(roleId);
    if (roleCredentials[roleId]) {
      setIdentifier(roleCredentials[roleId].email);
    }
    setCaptchaInput(generatedCaptcha);
  };

  const refreshCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedCaptcha(code);
    setCaptchaInput(code);
  };

  const handleSendOTP = () => {
    setOtpSent(true);
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier.trim()) {
      setErrorMessage(lang === 'en' ? 'Please enter your Government Email or Employee ID.' : 'অনুগ্ৰহ কৰি আপোনাৰ চৰকাৰী ইমেইল বা কৰ্মচাৰী আই.ডি. দিয়ক।');
      return;
    }

    if (authMethod === 'password' && !password) {
      setErrorMessage(lang === 'en' ? 'Please enter your password.' : 'অনুগ্ৰহ কৰি আপোনাৰ পাছৱৰ্ড দিয়ক।');
      return;
    }

    if (captchaInput.trim().toUpperCase() !== generatedCaptcha) {
      setErrorMessage(lang === 'en' ? 'Security Captcha code does not match. Please try again.' : 'সুৰক্ষা কেপচা কʼড মিল নাই। পুনৰ চেষ্টা কৰক।');
      refreshCaptcha();
      return;
    }

    setErrorMessage(null);
    const userName = roleCredentials[selectedRole]?.name || identifier.split('@')[0];
    onLogin(selectedRole, userName);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Subtle Gradient & Watermark */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D49B24_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

      {/* Top Gov Header */}
      <header className="bg-navy-950/90 border-b border-navy-800 text-white px-4 py-2.5 backdrop-blur-md z-10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-gold-500 text-navy-950 uppercase">
            Govt. of Assam
          </span>
          <span className="text-xs text-slate-300 font-medium hidden sm:inline">
            Directorate of Printing & Stationery · Bamunimaidam, Guwahati
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Globe className="w-3.5 h-3.5 text-gold-400" />
          <button
            onClick={() => setLang(lang === 'en' ? 'as' : 'en')}
            className="text-xs font-bold px-2 py-1 rounded bg-navy-800 text-gold-300 hover:text-white border border-navy-700"
          >
            {lang === 'en' ? 'অসমীয়া' : 'English'}
          </button>
        </div>
      </header>

      {/* Main Content Card */}
      <div className="flex-1 flex items-center justify-center p-4 z-10 my-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-navy-900 text-white p-6 border-b-4 border-gold-500 text-center relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-600 text-navy-950 font-black text-3xl mx-auto flex items-center justify-center shadow-lg border border-gold-300 mb-3">
              ম
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center space-x-2">
              <span>MudraKosh</span>
              <span className="text-gold-400 text-xl font-bold">(মুদ্ৰাকোষ)</span>
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
              {lang === 'en'
                ? 'Digital Inventory & Movement Tracking for Government Press and Stationery'
                : 'চৰকাৰী মুদ্ৰণ আৰু লেখন-সামগ্ৰীৰ ডিজিটেল মজুত আৰু চলাচল নিৰীক্ষণ প্ৰণালী'}
            </p>
            <div className="mt-2 inline-block bg-navy-950 text-gold-400 text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-navy-700">
              Assam State Gov-Tech Gateway · NESFIC-D-39
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Role Selection via Prominent 1-Tap Chips */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  {lang === 'en' ? 'Select User Role' : 'ব্যৱহাৰকাৰী ভূমিকা বাছক'}
                </label>
                <span className="text-[11px] font-semibold text-gold-600 bg-gold-50 px-2 py-0.5 rounded border border-gold-200">
                  Quick 1-Tap Roles
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ROLES.map((r) => {
                  const isSelected = selectedRole === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleRoleChange(r.id)}
                      className={`px-3 py-2.5 rounded-lg text-xs font-bold text-center transition-all duration-150 border ${
                        isSelected
                          ? 'bg-navy-950 text-gold-400 border-navy-950 shadow-md ring-2 ring-gold-400/40 transform scale-[1.02]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <div className="truncate text-xs font-bold">{r.id}</div>
                      <div className={`text-[10px] font-normal truncate mt-0.5 ${
                        isSelected ? 'text-slate-300' : 'text-slate-500'
                      }`}>
                        {r.tag}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Auth Method Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setAuthMethod('password')}
                className={`flex-1 py-1.5 rounded-md font-bold transition ${
                  authMethod === 'password' ? 'bg-white text-navy-950 shadow-sm' : 'text-slate-600'
                }`}
              >
                Password
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('otp')}
                className={`flex-1 py-1.5 rounded-md font-bold transition ${
                  authMethod === 'otp' ? 'bg-white text-navy-950 shadow-sm' : 'text-slate-600'
                }`}
              >
                Mobile OTP
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('parichay')}
                className={`flex-1 py-1.5 rounded-md font-bold transition ${
                  authMethod === 'parichay' ? 'bg-white text-navy-950 shadow-sm' : 'text-slate-600'
                }`}
              >
                Parichay SSO
              </button>
            </div>

            {/* User Identifier */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                {lang === 'en' ? 'Official Email / Employee ID' : 'চৰকাৰী ইমেইল / কৰ্মচাৰী আই.ডি.'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="name.dept@assam.gov.in"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-900 font-medium bg-white"
                  required
                />
              </div>
            </div>

            {/* Password or OTP or SSO */}
            {authMethod === 'password' && (
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {lang === 'en' ? 'Password' : 'পাছৱৰ্ড'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-9 pr-9 py-2 text-xs border border-slate-300 rounded-lg text-slate-900 font-medium bg-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {authMethod === 'otp' && (
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  One Time Password (OTP)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono text-slate-900 bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    className="px-3 py-2 bg-navy-800 text-gold-400 font-bold text-xs rounded-lg hover:bg-navy-900"
                  >
                    {otpSent ? 'Resend OTP' : 'Send OTP'}
                  </button>
                </div>
                {otpSent && (
                  <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
                    ✓ OTP sent to registered Assam Gov mobile number.
                  </span>
                )}
              </div>
            )}

            {authMethod === 'parichay' && (
              <div className="p-3 bg-navy-50 rounded-lg border border-navy-200 text-xs text-navy-900 space-y-1">
                <span className="font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-navy-800" />
                  <span>National Single Sign-On (Parichay / e-Pramaan)</span>
                </span>
                <p className="text-[11px] text-slate-600">
                  Clicking "Sign In" will authenticate via Assam Government SSO credentials.
                </p>
              </div>
            )}

            {/* Indian Gov Security Captcha */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Security Verification</span>
                <button
                  type="button"
                  onClick={refreshCaptcha}
                  className="text-[11px] text-navy-700 hover:text-navy-950 font-bold flex items-center space-x-1"
                >
                  <RotateCw className="w-3 h-3" />
                  <span>Refresh Code</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-navy-950 px-4 py-2 rounded-lg tracking-widest font-mono font-black text-gold-400 text-base select-none border border-navy-800 shadow-inner">
                  {generatedCaptcha}
                </div>
                <input
                  type="text"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  placeholder="Enter 5-character code"
                  className="flex-1 uppercase font-mono font-bold text-xs border border-slate-300 rounded-lg px-3 py-2 text-slate-900 bg-white"
                  required
                />
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              className="w-full bg-navy-900 hover:bg-navy-950 text-gold-400 hover:text-gold-300 font-black py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg transition"
            >
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              <span>
                {lang === 'en' ? 'Authenticate & Enter MudraKosh' : 'প্ৰৱেশ নিশ্চিত কৰক'}
              </span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </form>

          {/* Footer security notes */}
          <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-center text-[11px] text-slate-500">
            Compliant with GIGW 3.0 & Digital Personal Data Protection Act 2023 · Hosted on State Data Centre (SDC) Assam
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <footer className="text-center py-3 text-slate-400 text-xs border-t border-navy-800 bg-navy-950/80 z-10">
        Directorate of Printing & Stationery · Department of Information, Public Relations, Printing & Stationery, Govt. of Assam
      </footer>
    </div>
  );
};
