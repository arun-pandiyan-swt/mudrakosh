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

export const ROLES = [
  { id: 'Gate Guard', label: 'Security Gate Guard', tag: 'Weighbridge & Gate Pass' },
  { id: 'Warehouse Storekeeper', label: 'Warehouse Floor Storekeeper', tag: 'Intake & QR Tagging' },
  { id: 'Delivery Driver', label: 'Delivery Carrier Driver', tag: 'Route & e-Challan POD' },
  { id: 'Recipient DDO', label: 'Recipient Dept DDO', tag: 'Online Indent & POD' },
  { id: 'Director', label: 'Directorate Leadership (Director)', tag: 'Sanction Authority' },
  { id: 'Store Officer', label: 'Store Officer', tag: 'Verification & Audit' },
  { id: 'Press Supervisor', label: 'Press Floor Supervisor', tag: 'Requisition & Spoilage' },
  { id: 'Super Admin', label: 'Super Admin', tag: 'Full Control' }
];

interface LoginViewProps {
  onLogin: (role: string, username: string) => void;
  lang: 'en' | 'as';
  setLang: (lang: 'en' | 'as') => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, lang, setLang }) => {
  const [selectedRole, setSelectedRole] = useState('Gate Guard');
  const [identifier, setIdentifier] = useState('gate.security@assam.gov.in');
  const [password, setPassword] = useState('MudraKosh@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaInput, setCaptchaInput] = useState('');
  const [generatedCaptcha, setGeneratedCaptcha] = useState('7K9P4');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [authMethod, setAuthMethod] = useState<'password' | 'otp' | 'parichay'>('password');
  const [otpSent, setOtpSent] = useState(false);

  const roleCredentials: Record<string, { email: string; name: string }> = {
    'Gate Guard': { email: 'gate.security@assam.gov.in', name: 'Havildar T. Gogoi' },
    'Warehouse Storekeeper': { email: 'storekeeper.guw@assam.gov.in', name: 'Pranjal Saikia' },
    'Delivery Driver': { email: 'driver.fleet@assam.gov.in', name: 'Rupam Borah' },
    'Recipient DDO': { email: 'gad.nodal@assam.gov.in', name: 'Kabita Das, ACS' },
    'Director': { email: 'director.dps@assam.gov.in', name: 'S. N. Talukdar, IAS' },
    'Store Officer': { email: 'storeofficer.dps@assam.gov.in', name: 'D. K. Baruah' },
    'Press Supervisor': { email: 'press.supervisor@assam.gov.in', name: 'Manabendra Sarma' },
    'Super Admin': { email: 'admin.mudrakosh@assam.gov.in', name: 'System Administrator' }
  };

  const handleRoleChange = (roleId: string) => {
    setSelectedRole(roleId);
    if (roleCredentials[roleId]) {
      setIdentifier(roleCredentials[roleId].email);
    }
  };

  const refreshCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedCaptcha(code);
    setCaptchaInput('');
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
            Directorate of Printing & Stationery · Field Mobile Access (Port 5173)
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setLang(lang === 'en' ? 'as' : 'en')}
            className="flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold rounded bg-navy-800 border border-navy-700 text-gold-300 hover:text-white transition"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'অসমীয়া' : 'English'}</span>
          </button>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
          {/* Card Banner */}
          <div className="bg-navy-900 text-white p-6 relative">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gold-500 text-navy-950 flex items-center justify-center font-black text-2xl shadow-lg border border-gold-300">
                ম
              </div>
              <div>
                <h1 className="text-xl font-black text-white flex items-center space-x-2">
                  <span>MudraKosh</span>
                  <span className="text-gold-400 text-lg font-bold">(মুদ্ৰাকোষ)</span>
                </h1>
                <p className="text-xs text-slate-300">
                  {lang === 'en' 
                    ? 'Field Mobile Gateway · Port 5173' 
                    : 'ক্ষেত্ৰভিত্তিক মʼবাইল প্ৰৱেশদ্বাৰ · পʼৰ্ট ৫১৭৩'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-[11px] text-gold-300/90 font-mono mt-3 pt-2 border-t border-navy-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>GIGW 3.0 & e-Pramaan Single Sign-On Verified</span>
            </div>
          </div>

          {/* Form Area */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Persona Quick Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {lang === 'en' ? 'Select Official Persona / Role' : 'চৰকাৰী পদবী বা ভূমিকা বাছক'}
              </label>
              <select
                value={selectedRole}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:outline-none"
              >
                {ROLES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label} ({r.tag})
                  </option>
                ))}
              </select>
            </div>

            {/* Auth Method Tabs */}
            <div className="flex border-b border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setAuthMethod('password')}
                className={`flex-1 py-2 text-center border-b-2 transition ${
                  authMethod === 'password'
                    ? 'border-navy-900 text-navy-900'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {lang === 'en' ? 'Password Auth' : 'পাছৱৰ্ড প্ৰৱেশ'}
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('otp')}
                className={`flex-1 py-2 text-center border-b-2 transition ${
                  authMethod === 'otp'
                    ? 'border-navy-900 text-navy-900'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {lang === 'en' ? 'Aadhaar / Mobile OTP' : 'মʼবাইল অʼটিপি'}
              </button>
            </div>

            {/* Email / ID Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {lang === 'en' ? 'Government Email / Gov ID' : 'চৰকাৰী ইমেইল বা পৰিচয় পত্ৰ'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full text-xs font-medium pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  placeholder="name.dept@assam.gov.in"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Password Field or OTP */}
            {authMethod === 'password' ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'en' ? 'Secure Password' : 'সুৰক্ষিত পাছৱৰ্ড'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs font-medium pl-9 pr-10 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:outline-none"
                    placeholder="••••••••••••"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'en' ? '6-Digit OTP' : '৬-সংখ্যাৰ অʼটিপি'}
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="847291"
                    className="flex-1 text-xs font-mono tracking-widest px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    className="px-3 py-2 text-xs font-bold bg-navy-800 text-white rounded-lg hover:bg-navy-900 transition"
                  >
                    {otpSent ? (lang === 'en' ? 'Resend' : 'পুনৰ প্ৰেৰণ') : (lang === 'en' ? 'Get OTP' : 'অʼটিপি লওক')}
                  </button>
                </div>
              </div>
            )}

            {/* Captcha Verification */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {lang === 'en' ? 'Security Captcha Verification' : 'সুৰক্ষা কেপচা সত্যাপন'}
              </label>
              <div className="flex items-center space-x-3">
                <div className="bg-slate-200 border border-slate-300 px-3 py-1.5 rounded-lg font-mono font-black text-sm tracking-widest text-navy-950 select-none shadow-inner">
                  {generatedCaptcha}
                </div>
                <button
                  type="button"
                  onClick={refreshCaptcha}
                  className="p-1.5 rounded-lg border border-slate-300 text-slate-500 hover:text-navy-900 hover:bg-slate-100 transition"
                  title="Generate New Captcha"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  placeholder={lang === 'en' ? 'Enter Captcha' : 'কেপচা দিয়ক'}
                  maxLength={5}
                  className="flex-1 text-xs font-mono font-bold uppercase px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-navy-900 to-navy-800 hover:from-navy-950 hover:to-navy-900 text-white font-bold text-xs rounded-xl shadow-lg border border-gold-500/30 flex items-center justify-center space-x-2 transition transform active:scale-[0.99]"
            >
              <span>{lang === 'en' ? 'Sign In to MudraKosh' : 'মুদ্ৰাকোষত প্ৰৱেশ কৰক'}</span>
              <ArrowRight className="w-4 h-4 text-gold-400" />
            </button>
          </form>

          {/* Credentials Helper Footer */}
          <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
            <span className="font-semibold text-slate-500">
              Demo PIN: <code className="text-navy-900 font-bold bg-white px-1.5 py-0.5 rounded border">MudraKosh@2026</code>
            </span>
            <span className="text-[10px] text-emerald-700 font-bold flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>TLS 1.3 256-Bit</span>
            </span>
          </div>
        </div>
      </main>

      {/* Gov Footer */}
      <footer className="bg-navy-950 text-slate-400 py-3 px-4 text-center text-xs border-t border-navy-800 z-10">
        <div>
          Directorate of Printing & Stationery · Department of Information, Public Relations, Printing & Stationery, Assam
        </div>
        <div className="text-[10px] text-slate-500 mt-0.5">
          Standardized Single Port 5173 for Web and Mobile Handheld Clients
        </div>
      </footer>
    </div>
  );
};
