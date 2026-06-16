import React, { useState } from 'react';
import { 
  Building, 
  Shield, 
  CheckCircle, 
  ArrowRight, 
  Home, 
  Users, 
  FileText, 
  BarChart3, 
  PieChart, 
  Folder, 
  Calendar, 
  ChevronDown, 
  Bell, 
  Star, 
  Quote,
  Activity,
  User,
  ExternalLink,
  Lock
} from 'lucide-react';

interface LandingPageViewProps {
  onStartTrial: () => void;
}

const LandingPageView: React.FC<LandingPageViewProps> = ({ onStartTrial }) => {
  const [emailInput, setEmailInput] = useState('');

  const handleSubmitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    onStartTrial();
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-slate-800 font-sans selection:bg-indigo-200 selection:text-slate-900 overflow-x-hidden">
      
      {/* HEADER NAVIGATION */}
      <header className="sticky top-0 z-50 bg-[#faf9f6]/90 backdrop-blur-md border-b border-stone-200/60 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={onStartTrial}>
            <div className="relative w-9 h-9 flex items-center justify-center bg-indigo-600 rounded-lg shadow-md group-hover:scale-105 transition-all duration-200">
              {/* Overlapping clean circle vectors */}
              <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-amber-400 opacity-80 mix-blend-multiply"></div>
              <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-cyan-400 opacity-85 mix-blend-multiply"></div>
              <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-rose-400 opacity-90 mix-blend-multiply"></div>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
              Realty-OS
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <div className="relative group cursor-pointer flex items-center space-x-1 hover:text-slate-900 transition-colors">
              <span>Product</span>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
            </div>
            <span className="cursor-pointer hover:text-slate-900 transition-colors" onClick={onStartTrial}>Features</span>
            <span className="cursor-pointer hover:text-slate-900 transition-colors" onClick={onStartTrial}>Pricing</span>
            <div className="relative group cursor-pointer flex items-center space-x-1 hover:text-slate-900 transition-colors">
              <span>Resources</span>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
            </div>
            <span className="cursor-pointer hover:text-slate-900 transition-colors" onClick={onStartTrial}>About</span>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-5 text-sm font-semibold">
            <span onClick={onStartTrial} className="cursor-pointer text-slate-700 hover:text-slate-900 transition-colors">
              Log in
            </span>
            <button 
              onClick={onStartTrial}
              className="bg-slate-950 text-white px-5 py-2.5 rounded-lg hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all active:translate-y-0 duration-200"
            >
              Start Free Trial
            </button>
          </div>

        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative px-6 py-12 lg:py-20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column Copy */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            Manage rentals.<br />
            Grow income.<br />
            <span className="text-indigo-600">Stress less.</span>
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed max-w-lg">
            Realty-OS is the all-in-one rental management SaaS for property managers and landlords. Simplify operations. Get paid faster. Make smarter decisions.
          </p>
          <div className="flex items-center pt-2">
            <button 
              onClick={onStartTrial}
              className="bg-[#0b132b] text-white font-semibold px-7 py-4 rounded-xl flex items-center space-x-2.5 hover:bg-indigo-600 hover:scale-[1.03] active:scale-[0.98] shadow-md hover:shadow-indigo-100 transition-all duration-300 group"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </button>
            <button 
              onClick={onStartTrial}
              className="font-bold text-slate-800 px-6 py-3.5 hover:underline decoration-indigo-500 decoration-2 underline-offset-4 cursor-pointer"
            >
              Book a Demo
            </button>
          </div>

          {/* Trust Badges */}
          <div className="pt-6 grid grid-cols-3 gap-3 border-t border-stone-200/80">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-extrabold text-[10px]">
                M-PESA
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">MPESA</span>
                <span className="text-[11px] font-bold text-slate-800 leading-tight">INTEGRATED</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Shield className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">BANK GRADE</span>
                <span className="text-[11px] font-bold text-slate-800 leading-tight">SECURITY</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">99.9%</span>
                <span className="text-[11px] font-bold text-slate-800 leading-tight">UPTIME</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column Visual Artwork & Mockup Overlapping */}
        <div className="lg:col-span-7 relative h-[520px] sm:h-[600px] lg:h-[640px] flex items-center justify-center">
          <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-stone-200/60 bg-white p-4 flex items-center justify-center group hover:shadow-indigo-150/40 transition-all duration-300 transform hover:scale-[1.01]">
            <img 
              src="/src/assets/images/property_hero_1781369913688.jpg" 
              alt="RealtyOS Modern Real Estate Art" 
              className="w-full h-full object-cover rounded-2xl" 
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* FEATURING KEY PILLARS HORIZONTAL BRUSH BANNER */}
      <section className="bg-slate-950 py-7 text-white/90 border-t border-b border-indigo-950 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center space-x-8 min-w-[900px]">
          
          {[
            { label: 'Property Portfolios', icon: <Home className="w-5 h-5 text-indigo-400" /> },
            { label: 'Tenant Lifecycle', icon: <Users className="w-5 h-5 text-cyan-400" /> },
            { label: 'Invoicing & Payments', icon: <FileText className="w-5 h-5 text-rose-400" /> },
            { label: 'Financial Dashboards', icon: <PieChart className="w-5 h-5 text-amber-400" /> },
            { label: 'Team Collaboration', icon: <Users className="w-5 h-5 text-purple-400" /> },
            { label: 'Audit Trails', icon: <Shield className="w-5 h-5 text-emerald-400" /> },
            { label: 'MPESA Payments', icon: <span className="text-xs tracking-wider whitespace-nowrap bg-emerald-700/85 px-1.5 py-0.5 rounded text-white font-black font-sans">M-PESA</span> }
          ].map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center justify-center space-y-2 group cursor-pointer" onClick={onStartTrial}>
              <div className="p-2.5 rounded-full bg-slate-900 group-hover:scale-110 group-hover:bg-indigo-900/40 transition-all duration-300">
                {item.icon}
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 group-hover:text-white transition-colors">{item.label}</span>
            </div>
          ))}

        </div>
      </section>

      {/* "EVERYTHING YOU NEED. ALL IN ONE PLACE." GRID SECTION */}
      <section className="py-20 lg:py-28 px-6 bg-stone-50 border-b border-stone-200/50">
        <div className="max-w-7xl mx-auto flex flex-col space-y-16">
          
          {/* Header 2 cols row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Everything you need.<br />
                <span className="relative inline-block mt-1">
                  All in one place.
                  <span className="absolute left-0 bottom-1 w-full h-2.5 bg-indigo-500/20 -skew-x-6"></span>
                </span>
              </h2>
            </div>
            <div>
              <p className="text-slate-600 text-[17px] leading-relaxed max-w-xl">
                Realty-OS brings your people, properties and payments together in a single, powerful platform built for the realities of modern property management.
              </p>
            </div>
          </div>

          {/* Feature Bento Grid (8 major features) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Feature 1 */}
            <div className="bg-white border border-stone-200/60 shadow-sm rounded-2xl p-6 flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 mb-5">
                  <Home className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Property Portfolios</h3>
                <p className="text-slate-500 text-[14px] leading-relaxed">
                  Centralize all your properties, units and lease details with ease.
                </p>
              </div>
              <div onClick={onStartTrial} className="mt-6 flex items-center space-x-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-wider cursor-pointer">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white border border-stone-200/60 shadow-sm rounded-2xl p-6 flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-600 mb-5">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Tenant Lifecycle</h3>
                <p className="text-slate-500 text-[14px] leading-relaxed">
                  Manage leads, screening, leases, renewals and move-outs seamlessly.
                </p>
              </div>
              <div onClick={onStartTrial} className="mt-6 flex items-center space-x-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-wider cursor-pointer">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white border border-stone-200/60 shadow-sm rounded-2xl p-6 flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 mb-5">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Invoicing & Payments</h3>
                <p className="text-slate-500 text-[14px] leading-relaxed">
                  Generate invoices, track payments and automate reminders.
                </p>
              </div>
              <div onClick={onStartTrial} className="mt-6 flex items-center space-x-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-wider cursor-pointer">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 4: MPESA */}
            <div className="bg-white border border-stone-200/60 shadow-sm rounded-2xl p-6 flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-extrabold text-[12px] tracking-tight mb-5 select-none">
                  M-PESA
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">MPESA Integration</h3>
                <p className="text-slate-500 text-[14px] leading-relaxed">
                  Accept payments via MPESA and reconcile automatically.
                </p>
              </div>
              <div onClick={onStartTrial} className="mt-6 flex items-center space-x-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-wider cursor-pointer">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 5 */}
            <div className="bg-white border border-stone-200/60 shadow-sm rounded-2xl p-6 flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 mb-5">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Financial Dashboards</h3>
                <p className="text-slate-500 text-[14px] leading-relaxed">
                  Real-time insights on income, expenses, occupancy and arrears.
                </p>
              </div>
              <div onClick={onStartTrial} className="mt-6 flex items-center space-x-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-wider cursor-pointer">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 6 */}
            <div className="bg-white border border-stone-200/60 shadow-sm rounded-2xl p-6 flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 mb-5">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Team Collaboration</h3>
                <p className="text-slate-500 text-[14px] leading-relaxed">
                  Assign tasks, share notes and stay aligned with your team.
                </p>
              </div>
              <div onClick={onStartTrial} className="mt-6 flex items-center space-x-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-wider cursor-pointer">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 7 */}
            <div className="bg-white border border-stone-200/60 shadow-sm rounded-2xl p-6 flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 mb-5">
                  <Folder className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Documents</h3>
                <p className="text-slate-500 text-[14px] leading-relaxed">
                  Store, organize and share important documents securely.
                </p>
              </div>
              <div onClick={onStartTrial} className="mt-6 flex items-center space-x-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-wider cursor-pointer">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 8 */}
            <div className="bg-white border border-stone-200/60 shadow-sm rounded-2xl p-6 flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 mb-5">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Audit Trails</h3>
                <p className="text-slate-500 text-[14px] leading-relaxed">
                  Track every action with tamper-proof audit logs.
                </p>
              </div>
              <div onClick={onStartTrial} className="mt-6 flex items-center space-x-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-wider cursor-pointer">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* TESTIMONIALS, STATS & TRUSTED PARTNERS GRID BLOCK */}
      <section className="relative w-full border-b border-stone-200/50">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          {/* Testimonial Panel (Yellow block) */}
          <div className="lg:col-span-4 bg-[#facc15] px-10 py-16 flex flex-col justify-between">
            <div>
              <Quote className="w-14 h-14 text-slate-900 opacity-20 mb-6" />
              <p className="text-slate-900 text-xl font-bold leading-relaxed mb-8">
                "Realty-OS has transformed how we manage our properties. Payments are faster, tenants are happier, and our reports are accurate."
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" 
                alt="Brian Mwangi author" 
                className="w-12 h-12 rounded-full object-cover border-2 border-slate-900"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col">
                <span className="font-extrabold text-sm text-slate-900">Brian Mwangi</span>
                <span className="text-xs font-semibold text-slate-800">Property Manager, Nairobi</span>
                <div className="flex items-center space-x-0.5 mt-1 text-slate-900">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Metrics (Deep Blue background matching the design app palette) */}
          <div className="lg:col-span-4 bg-[#1e293b] text-white px-10 py-16 flex flex-col justify-center space-y-12 border-t lg:border-t-0 border-slate-800">
            
            <div className="flex flex-col space-y-1">
              <span className="text-5xl font-black text-indigo-400">2,500+</span>
              <span className="text-sm font-bold uppercase tracking-wider text-slate-400">Properties Managed</span>
            </div>

            <div className="flex flex-col space-y-1">
              <span className="text-5xl font-black text-cyan-400">98%</span>
              <span className="text-sm font-bold uppercase tracking-wider text-slate-400">Customer Satisfaction</span>
            </div>

            <div className="flex flex-col space-y-1">
              <span className="text-5xl font-black text-amber-400">KES 2.4B+</span>
              <span className="text-sm font-bold uppercase tracking-wider text-slate-400 leading-tight">Rent Collected Through Platform</span>
            </div>

          </div>

          {/* Kenyan logos and right-hand cut visual block (Soft salmon color) */}
          <div className="lg:col-span-4 bg-[#fed7aa] px-10 py-16 flex flex-col justify-between relative overflow-hidden">
            
            <div className="flex flex-col space-y-6 z-10">
              <span className="text-xs uppercase tracking-widest font-black text-stone-600 block">Trusted by</span>
              <h3 className="text-slate-800 text-lg font-bold leading-tight max-w-[200px]">
                property professionals across Kenya
              </h3>

              {/* Grid of clean mock client logos */}
              <div className="space-y-4 pt-4">
                
                {/* Logo 1 */}
                <div className="flex items-center space-x-2 bg-white/75 px-4 py-2 rounded-xl backdrop-blur border border-stone-200/45 w-fit">
                  <div className="w-4 h-4 bg-[#ca8a04] rounded-sm transform rotate-45 flex items-center justify-center">
                    <span className="text-[6px] text-white font-mono font-bold -rotate-45">E</span>
                  </div>
                  <span className="text-[12px] font-black tracking-tight text-[#ca8a04]">Elevate</span>
                  <span className="text-[10px] font-semibold text-slate-500">PROPERTIES</span>
                </div>

                {/* Logo 2 */}
                <div className="flex items-center space-x-2 bg-white/75 px-4 py-2 rounded-xl backdrop-blur border border-stone-200/45 w-fit">
                  <div className="w-4 h-4 bg-[#090d1f] rounded-full flex items-center justify-center">
                    <span className="text-[8px] text-white font-mono font-bold">U</span>
                  </div>
                  <span className="text-[12px] font-black tracking-tight text-slate-900">UrbanHaus</span>
                </div>

                {/* Logo 3 */}
                <div className="flex items-center space-x-2 bg-white/75 px-4 py-2 rounded-xl backdrop-blur border border-stone-200/45 w-fit">
                  <span className="text-[11px] font-extrabold tracking-widest text-emerald-800 uppercase font-sans">Greenhaven</span>
                  <span className="text-[9px] font-semibold text-slate-400">MANAGEMENT</span>
                </div>

              </div>
            </div>

            {/* HALF-CUT APARTMENT ARTWORK ON BOTTOM RIGHT */}
            <div className="absolute right-0 bottom-0 top-1/2 left-1/2 pointer-events-none select-none">
              <svg viewBox="0 0 200 200" className="w-full h-full object-contain object-bottom-right">
                {/* Sun */}
                <circle cx="150" cy="50" r="30" fill="#f59e0b" />
                {/* Building slice */}
                <rect x="70" y="60" width="130" height="140" fill="#2563eb" />
                <rect x="110" y="60" width="90" height="140" fill="#1d4ed8" />
                {/* balcony row */}
                <line x1="70" y1="100" x2="200" y2="100" stroke="#f43f5e" strokeWidth="4" />
                <line x1="70" y1="140" x2="200" y2="140" stroke="#f43f5e" strokeWidth="4" />
                <line x1="70" y1="180" x2="200" y2="180" stroke="#f43f5e" strokeWidth="4" />
              </svg>
            </div>

          </div>

        </div>
      </section>

      {/* BOTTOM CTA BANNER (READY TO SIMPLIFY) */}
      <section className="bg-white py-20 lg:py-28 text-slate-800 px-6">
        <div className="max-w-5xl mx-auto rounded-3xl bg-[#faf9f6] border border-stone-200/80 p-8 sm:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
          
          <div className="flex flex-col space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Ready to simplify<br />
              rental management?
            </h2>
            <p className="text-slate-500 text-sm font-semibold max-w-sm">
              Join thousands of property professionals who trust Realty-OS.
            </p>
          </div>

          <div className="w-full md:w-auto flex flex-col space-y-3">
            <form onSubmit={handleSubmitEmail} className="flex flex-col sm:flex-row items-stretch gap-2.5">
              <input 
                type="email" 
                placeholder="Enter your work email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="bg-white border border-stone-300 rounded-xl px-5 py-3.5 text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64" 
              />
              <button 
                type="submit"
                className="bg-slate-950 text-white font-semibold text-sm px-6 py-3.5 rounded-xl hover:bg-slate-800 transition duration-200 whitespace-nowrap whitespace-nowrap"
              >
                Start Free Trial
              </button>
            </form>
            
            {/* CTA checks */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500 text-xs font-bold font-sans">
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-3.5 h-3.5 text-indigo-500" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-3.5 h-3.5 text-indigo-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-3.5 h-3.5 text-indigo-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 rounded bg-indigo-600 flex items-center justify-center font-bold text-xs">
                R
              </div>
              <span className="text-lg font-black tracking-tight uppercase text-white">Realty-OS</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              The all-in-one rental management SaaS for property managers and landlords.
            </p>
            {/* Social Icons row */}
            <div className="flex items-center space-x-4 text-slate-500 pt-2">
              <span className="hover:text-white transition-colors cursor-pointer text-sm font-bold">Facebook</span>
              <span className="hover:text-white transition-colors cursor-pointer text-sm font-bold">X</span>
              <span className="hover:text-white transition-colors cursor-pointer text-sm font-bold">LinkedIn</span>
              <span className="hover:text-white transition-colors cursor-pointer text-sm font-bold">Instagram</span>
            </div>
          </div>

          {/* Product Col */}
          <div className="flex flex-col space-y-3 font-semibold text-sm">
            <span className="text-xs uppercase tracking-widest text-[#ca8a04] font-bold">Product</span>
            <span onClick={onStartTrial} className="text-slate-400 hover:text-white transition-colors cursor-pointer">Features</span>
            <span onClick={onStartTrial} className="text-slate-400 hover:text-white transition-colors cursor-pointer">Integrations</span>
            <span onClick={onStartTrial} className="text-slate-400 hover:text-white transition-colors cursor-pointer">Pricing</span>
            <span onClick={onStartTrial} className="text-slate-400 hover:text-white transition-colors cursor-pointer">Changelog</span>
          </div>

          {/* Resources Col */}
          <div className="flex flex-col space-y-3 font-semibold text-sm">
            <span className="text-xs uppercase tracking-widest text-[#ca8a04] font-bold">Resources</span>
            <span onClick={onStartTrial} className="text-slate-400 hover:text-white transition-colors cursor-pointer">Help Center</span>
            <span onClick={onStartTrial} className="text-slate-400 hover:text-white transition-colors cursor-pointer">Guides</span>
            <span onClick={onStartTrial} className="text-slate-400 hover:text-white transition-colors cursor-pointer">Templates</span>
            <span onClick={onStartTrial} className="text-slate-400 hover:text-white transition-colors cursor-pointer">Blog</span>
          </div>

          {/* Company Col */}
          <div className="flex flex-col space-y-3 font-semibold text-sm">
            <span className="text-xs uppercase tracking-widest text-[#ca8a04] font-bold">Company</span>
            <span onClick={onStartTrial} className="text-slate-400 hover:text-white transition-colors cursor-pointer">About Us</span>
            <span onClick={onStartTrial} className="text-slate-400 hover:text-white transition-colors cursor-pointer">Careers</span>
            <span onClick={onStartTrial} className="text-slate-400 hover:text-white transition-colors cursor-pointer">Contact Us</span>
            <span onClick={onStartTrial} className="text-slate-400 hover:text-white transition-colors cursor-pointer">Partners</span>
          </div>

          {/* Legal Col */}
          <div className="flex flex-col space-y-3 font-semibold text-sm">
            <span className="text-xs uppercase tracking-widest text-[#ca8a04] font-bold">Legal</span>
            <span onClick={onStartTrial} className="text-slate-400 hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span onClick={onStartTrial} className="text-slate-400 hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            <span onClick={onStartTrial} className="text-slate-400 hover:text-white transition-colors cursor-pointer">Security</span>
            <span onClick={onStartTrial} className="text-slate-400 hover:text-white transition-colors cursor-pointer">Cookie Policy</span>
          </div>

        </div>

        {/* copyright separator */}
        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-slate-800 text-center text-slate-500 text-xs">
          <span>© 2024 Realty-OS. All rights reserved.</span>
        </div>
      </footer>

    </div>
  );
};

export default LandingPageView;
