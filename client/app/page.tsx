import Link from 'next/link'
import { ChevronDown, ChevronRight, Search, Bell, ShieldCheck, Eye, TrendingUp, Ban, AlertTriangle, Shield, CheckCircle, Zap, Activity } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden font-sans flex flex-col">
      {/* Background Glow Effect - Pulsing */}
      <div 
        className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] bg-primary/25 blur-[140px] rounded-full pointer-events-none animate-pulse" 
        style={{ animationDuration: '4s' }} 
      />
      
      {/* Particle Texture (CSS dots) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04]" 
        style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
      />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto flex flex-col flex-1">
        {/* Navbar */}
        <header className="flex items-center justify-between px-6 py-6 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(201,138,62,0.4)]">
              <ShieldCheck className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">IP Guardian</span>
          </div>
          
          <nav className="hidden lg:flex items-center gap-8">
            {['Product', 'Pricing', 'Use Cases', 'Program', 'Blog'].map((item) => (
              <button key={item} className="flex items-center gap-1.5 text-[15px] font-medium text-muted-foreground hover:text-foreground transition-colors">
                {item} <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>
            ))}
          </nav>
          
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block px-6 py-2.5 rounded-lg text-sm font-semibold text-primary-foreground bg-primary hover:brightness-110 transition-all shadow-[0_0_20px_rgba(201,138,62,0.3)] hover:shadow-[0_0_30px_rgba(201,138,62,0.5)]">
              Log In
            </Link>
            <Link href="/register" className="px-6 py-2.5 rounded-lg text-sm font-semibold text-foreground border border-muted-foreground/30 hover:bg-accent transition-all hover:scale-105">
              Sign Up
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex flex-col items-center text-center px-6 pt-24 pb-0 lg:pt-32 flex-1 relative">
          
          {/* Eyebrow - Float animation */}
          <span className="text-primary font-semibold tracking-[0.25em] text-[11px] uppercase mb-8 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 shadow-[0_0_15px_rgba(201,138,62,0.15)] animate-bounce" style={{ animationDuration: '3s' }}>
            Welcome to IP Guardian
          </span>
          
          <h1 className="text-5xl md:text-6xl lg:text-[72px] font-extrabold text-foreground tracking-tight leading-[1.05] max-w-4xl mb-8 transform transition-all duration-700 hover:scale-[1.02]">
            Secure Your Network with <br className="hidden md:block" /> Real-Time IP Intelligence
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed opacity-90">
            Enterprise-grade proxy and infrastructure management. Monitor bandwidth, enforce targeting, and block threats before they hit your edge.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-24">
            <Link href="/register" className="px-8 py-4 rounded-xl text-base font-bold text-primary-foreground bg-primary hover:brightness-110 transition-all shadow-[0_0_30px_rgba(201,138,62,0.4)] hover:shadow-[0_0_45px_rgba(201,138,62,0.6)] hover:-translate-y-1">
              Get in Touch
            </Link>
          </div>

          {/* Product Preview Mockup */}
          <div className="w-full max-w-[1000px] mx-auto rounded-t-2xl border border-border bg-card shadow-[0_-20px_80px_rgba(201,138,62,0.15)] overflow-hidden relative translate-y-px transform transition-all duration-1000 hover:shadow-[0_-30px_100px_rgba(201,138,62,0.25)]">
            
            {/* Inner Top Glow for Mockup */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
            
            {/* Mockup Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive/80 hover:bg-destructive transition-colors cursor-pointer" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors cursor-pointer" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors cursor-pointer" />
                </div>
                <div className="relative ml-6">
                  <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input disabled className="bg-background border border-border rounded-lg pl-9 pr-4 py-1.5 text-sm w-72 text-muted-foreground cursor-not-allowed" placeholder="Search resources..." />
                </div>
              </div>
              <div className="flex items-center gap-5">
                <Bell className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
                <div className="w-8 h-8 rounded-full border border-primary/50 bg-background flex items-center justify-center shadow-[0_0_10px_rgba(201,138,62,0.2)] hover:shadow-[0_0_15px_rgba(201,138,62,0.4)] transition-all cursor-pointer">
                  <div className="w-6 h-6 rounded-full bg-primary/20" />
                </div>
              </div>
            </div>
            
            {/* Mockup Body */}
            <div className="flex h-72">
              {/* Sidebar */}
              <div className="w-56 border-r border-border p-4 space-y-3 bg-card">
                <div className="h-9 rounded-lg bg-primary/15 border border-primary/30" />
                <div className="h-9 rounded-lg bg-accent/50 hover:bg-accent transition-colors cursor-pointer" />
                <div className="h-9 rounded-lg bg-accent/50 hover:bg-accent transition-colors cursor-pointer" />
                <div className="h-9 rounded-lg bg-accent/50 hover:bg-accent transition-colors cursor-pointer" />
                <div className="h-9 rounded-lg bg-accent/50 hover:bg-accent transition-colors cursor-pointer" />
              </div>
              {/* Main Content */}
              <div className="flex-1 p-8">
                <div className="grid grid-cols-4 gap-4">
                  {/* Card 1 */}
                  <div className="p-5 rounded-2xl border border-border bg-card shadow-lg hover:border-primary/30 hover:shadow-[0_0_20px_rgba(201,138,62,0.1)] transition-all cursor-default">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Total IPs Analyzed</p>
                        <p className="text-2xl font-bold text-foreground">2</p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Eye className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex items-center text-sm">
                      <TrendingUp className="mr-1 h-4 w-4 text-green-400" />
                      <span className="text-green-400">+12%</span>
                      <span className="text-muted-foreground ml-1">from last month</span>
                    </div>
                  </div>
                  {/* Card 2 */}
                  <div className="p-5 rounded-2xl border border-border bg-card shadow-lg hover:border-primary/30 hover:shadow-[0_0_20px_rgba(201,138,62,0.1)] transition-all cursor-default">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Blocked IPs</p>
                        <p className="text-2xl font-bold text-foreground">5</p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
                        <Ban className="h-5 w-5 text-red-400" />
                      </div>
                    </div>
                    <div className="flex items-center text-sm">
                      <AlertTriangle className="mr-1 h-4 w-4 text-yellow-400" />
                      <span className="text-yellow-400">+5</span>
                      <span className="text-muted-foreground ml-1">today</span>
                    </div>
                  </div>
                  {/* Card 3 */}
                  <div className="p-5 rounded-2xl border border-border bg-card shadow-lg hover:border-primary/30 hover:shadow-[0_0_20px_rgba(201,138,62,0.1)] transition-all cursor-default">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Threats Blocked</p>
                        <p className="text-2xl font-bold text-foreground">5</p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
                        <Shield className="h-5 w-5 text-secondary" />
                      </div>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="mr-1 h-4 w-4 text-green-400" />
                      <span className="text-green-400">All blocked</span>
                    </div>
                  </div>
                  {/* Card 4 */}
                  <div className="p-5 rounded-2xl border border-border bg-card shadow-lg hover:border-primary/30 hover:shadow-[0_0_20px_rgba(201,138,62,0.1)] transition-all cursor-default">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">System Uptime</p>
                        <p className="text-2xl font-bold text-foreground">0.48%</p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                        <Zap className="h-5 w-5 text-green-400" />
                      </div>
                    </div>
                    <div className="flex items-center text-sm">
                      <Activity className="mr-1 h-4 w-4 text-green-400" />
                      <span className="text-green-400">Excellent</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Fade Out Gradient at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />
          </div>
        </main>
      </div>
    </div>
  )
}

