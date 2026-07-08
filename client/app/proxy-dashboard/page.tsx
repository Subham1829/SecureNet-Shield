
"use client"

import React from "react"
import { ThemeToggle } from "@/components/ThemeToggle"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ProxyDashboard() {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      

<aside className="h-screen w-64 fixed left-0 top-0 bg-background dark:bg-background flex flex-col h-full py-lg px-md z-50">
<div className="flex items-center gap-md mb-xl">
<div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
<span className="material-symbols-outlined" >dataset</span>
</div>
<div>
<h1 className="text-2xl font-semibold text-primary dark:text-primary leading-tight">ProxyFlow</h1>
<p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Enterprise Proxy</p>
</div>
</div>
<nav className="flex-1 space-y-xs overflow-y-auto custom-scrollbar">

<a className="flex items-center gap-md px-md py-sm rounded-lg text-primary dark:text-primary font-bold border-r-4 border-primary bg-accent transition-colors" href="#">
<span className="material-symbols-outlined">dashboard</span>
<span className="font-medium uppercase tracking-wider text-xs">Dashboard</span>
</a>
<a className="flex items-center gap-md px-md py-sm rounded-lg text-muted-foreground dark:text-muted-foreground hover:bg-accent transition-colors" href="#">
<span className="material-symbols-outlined">public</span>
<span className="font-medium uppercase tracking-wider text-xs">IP Addresses</span>
</a>
<a className="flex items-center gap-md px-md py-sm rounded-lg text-muted-foreground dark:text-muted-foreground hover:bg-accent transition-colors" href="#">
<span className="material-symbols-outlined">data_usage</span>
<span className="font-medium uppercase tracking-wider text-xs">Bandwidth</span>
</a>
<a className="flex items-center gap-md px-md py-sm rounded-lg text-muted-foreground dark:text-muted-foreground hover:bg-accent transition-colors" href="#">
<span className="material-symbols-outlined">location_on</span>
<span className="font-medium uppercase tracking-wider text-xs">Targeting</span>
</a>
<a className="flex items-center gap-md px-md py-sm rounded-lg text-muted-foreground dark:text-muted-foreground hover:bg-accent transition-colors" href="#">
<span className="material-symbols-outlined">code</span>
<span className="font-medium uppercase tracking-wider text-xs">API & Docs</span>
</a>
<a className="flex items-center gap-md px-md py-sm rounded-lg text-muted-foreground dark:text-muted-foreground hover:bg-accent transition-colors" href="#">
<span className="material-symbols-outlined">settings</span>
<span className="font-medium uppercase tracking-wider text-xs">Settings</span>
</a>
</nav>
<div className="mt-auto pt-lg border-t border-border">
<button className="w-full py-md px-lg bg-primary text-primary-foreground font-bold rounded-xl active:scale-95 duration-200 shadow-lg">
                Upgrade Plan
            </button>
</div>
</aside>

<div className="ml-64 flex flex-col h-screen">

<header className="fixed top-0 right-0 w-[calc(100%-16rem)] z-40 bg-background dark:bg-background bg-background dark:bg-background shadow-sm flex justify-between items-center px-lg h-16">
<div className="flex items-center gap-md">
<div className="relative group">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">search</span>
<input className="bg-card border-none rounded-full pl-10 pr-lg py-xs text-sm focus:ring-2 focus:ring-primary w-64 transition-all" placeholder="Search resources..." type="text"/>
</div>
</div>
<div className="flex items-center gap-lg">
<div className="flex items-center gap-sm px-md py-xs bg-secondary rounded-full border border-border">
<span className="material-symbols-outlined text-primary text-sm">database</span>
<span className="font-medium uppercase tracking-wider text-xs text-foreground">Balance: 45.2 GB</span>
</div>
<button className="relative p-2 text-muted-foreground hover:text-primary transition-all active:scale-95">
<span className="material-symbols-outlined">notifications</span>
<span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
</button>
<div className="flex items-center gap-sm border-l border-border pl-lg">
<div className="text-right hidden xl:block">
<p className="font-medium uppercase tracking-wider text-xs text-foreground">Alex Rivera</p>
<p className="text-xs text-muted-foreground">Pro Plan</p>
</div>
<img className="w-10 h-10 rounded-full border-2 border-primary-container object-cover" data-alt="A professional headshot of a Hispanic male software engineer in his late 20s, wearing a minimalist black turtleneck, against a warm earthy brown studio background. The lighting is dramatic with soft amber key light highlighting his face. High-end professional photography style, sharp focus, 8k resolution, maintaining the amber and earth aesthetic of the ProxyFlow brand." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAibitkabF_S7lazLBupeQ6BRar1Jjf5go0DHkQd9RQG5c20n8fk2udidG1RgbDjI8rXdFsbZrWHW9sJOpLebedc_eXM7oGGmi5EUKxOijgR71T2QVEt_muvuL7ynmADcnwyJCOXJp8Ud4QQ9k2c1izsJ6aKAUdKmdZG6fK9_gFCDzUHtt9JArcM2OKoOD2nWoHxE6CujyGRmVbX68M5agrgWQ1BaeTNr-itfZCm6Nz7nFFg5N0et0FN7asfUoW7XiET6Mz8XrMXEU"/>
</div>
</div>
</header>

<main className="mt-16 p-lg overflow-y-auto h-full space-y-lg custom-scrollbar">

<section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">

<div className="bg-card p-lg rounded-xl border border-border flex flex-col justify-between">
<div className="flex justify-between items-start mb-md">
<span className="text-muted-foreground font-medium uppercase tracking-wider">Total Bandwidth</span>
<div className="p-xs bg-primary/20 rounded-lg">
<span className="material-symbols-outlined text-primary text-md">speed</span>
</div>
</div>
<div>
<h2 className="text-3xl font-bold text-foreground">1.2 TB</h2>
<div className="flex items-center gap-xs mt-xs text-primary">
<span className="material-symbols-outlined text-sm">trending_up</span>
<span className="text-xs font-bold">+12.5% this month</span>
</div>
</div>
</div>

<div className="bg-card p-lg rounded-xl border border-border flex flex-col justify-between">
<div className="flex justify-between items-start mb-md">
<span className="text-muted-foreground font-medium uppercase tracking-wider">Active IPs</span>
<div className="p-xs bg-blue-500/20 rounded-lg">
<span className="material-symbols-outlined text-blue-500 text-md">hub</span>
</div>
</div>
<div>
<h2 className="text-3xl font-bold text-foreground">854</h2>
<div className="flex items-center gap-xs mt-xs text-blue-500">
<span className="material-symbols-outlined text-sm">sync</span>
<span className="text-xs font-bold">Real-time status</span>
</div>
</div>
</div>

<div className="bg-card p-lg rounded-xl border border-border flex flex-col justify-between">
<div className="flex justify-between items-start mb-md">
<span className="text-muted-foreground font-medium uppercase tracking-wider">Requests Served</span>
<div className="p-xs bg-purple-500/20 rounded-lg">
<span className="material-symbols-outlined text-purple-500 text-md">bolt</span>
</div>
</div>
<div>
<h2 className="text-3xl font-bold text-foreground">2.4M</h2>
<div className="flex items-center gap-xs mt-xs text-muted-foreground">
<span className="text-xs">Avg. 140 req/sec</span>
</div>
</div>
</div>

<div className="bg-card p-lg rounded-xl border border-border flex flex-col justify-between">
<div className="flex justify-between items-start mb-md">
<span className="text-muted-foreground font-medium uppercase tracking-wider">Success Rate</span>
<div className="p-xs bg-emerald-500/10 rounded-lg">
<span className="material-symbols-outlined text-emerald-400 text-md">verified</span>
</div>
</div>
<div>
<h2 className="text-3xl font-bold text-foreground">99.8%</h2>
<div className="flex items-center gap-xs mt-xs text-emerald-400">
<span className="text-xs font-bold">Above SLA threshold</span>
</div>
</div>
</div>
</section>

<section className="grid grid-cols-1 lg:grid-cols-3 gap-lg h-[400px]">

<div className="lg:col-span-2 bg-card p-lg rounded-xl border border-border relative overflow-hidden flex flex-col">
<div className="flex justify-between items-center mb-xl">
<div>
<h3 className="text-base font-semibold text-foreground">Bandwidth Usage</h3>
<p className="text-xs text-muted-foreground">Consumption trends over the last 24 hours</p>
</div>
<div className="flex gap-sm">
<button className="px-md py-xs bg-secondary rounded text-xs text-foreground border border-border">24H</button>
<button className="px-md py-xs bg-background rounded text-xs text-muted-foreground hover:bg-secondary transition-colors">7D</button>
</div>
</div>
<div className="flex-1 relative">

<div className="absolute inset-0 flex items-end justify-between gap-sm pt-lg">
<div className="w-full bg-primary/20 rounded-t-sm animate-pulse" ></div>
<div className="w-full bg-primary/30 rounded-t-sm" ></div>
<div className="w-full bg-primary/40 rounded-t-sm" ></div>
<div className="w-full bg-primary/60 rounded-t-sm" ></div>
<div className="w-full bg-primary/80 rounded-t-sm" ></div>
<div className="w-full bg-primary/40 rounded-t-sm" ></div>
<div className="w-full bg-primary/30 rounded-t-sm" ></div>
<div className="w-full bg-primary/50 rounded-t-sm" ></div>
<div className="w-full bg-primary/70 rounded-t-sm" ></div>
<div className="w-full bg-primary/40 rounded-t-sm" ></div>
<div className="w-full bg-primary/20 rounded-t-sm" ></div>
<div className="w-full bg-primary/50 rounded-t-sm" ></div>
</div>
<svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1000 400">
<path d="M0,320 Q125,280 250,200 T500,100 T750,150 T1000,50" fill="none" stroke="#ffb968" strokeLinecap="round" strokeWidth="4"/></path>
<circle className="animate-ping" cx="500" cy="100" fill="#ffb968" r="6"/></circle>
<circle cx="500" cy="100" fill="#ffb968" r="4"/></circle>
</svg>
</div>
</div>

<div className="bg-card p-lg rounded-xl border border-border flex flex-col">
<h3 className="text-base font-semibold text-foreground mb-lg">Top Regions</h3>
<div className="space-y-lg overflow-y-auto flex-1 custom-scrollbar pr-sm">

<div className="flex items-center justify-between">
<div className="flex items-center gap-md">
<div className="w-8 h-6 bg-background rounded-sm flex items-center justify-center overflow-hidden">
<span className="text-xs font-bold text-muted-foreground">US</span>
</div>
<span className="text-sm text-foreground">United States</span>
</div>
<div className="text-right">
<p className="text-sm font-bold text-primary">42.5%</p>
<div className="w-24 h-1 bg-background rounded-full overflow-hidden mt-1">
<div className="h-full bg-primary" ></div>
</div>
</div>
</div>

<div className="flex items-center justify-between">
<div className="flex items-center gap-md">
<div className="w-8 h-6 bg-background rounded-sm flex items-center justify-center overflow-hidden">
<span className="text-xs font-bold text-muted-foreground">DE</span>
</div>
<span className="text-sm text-foreground">Germany</span>
</div>
<div className="text-right">
<p className="text-sm font-bold text-foreground">18.2%</p>
<div className="w-24 h-1 bg-background rounded-full overflow-hidden mt-1">
<div className="h-full bg-on-surface-variant" ></div>
</div>
</div>
</div>

<div className="flex items-center justify-between">
<div className="flex items-center gap-md">
<div className="w-8 h-6 bg-background rounded-sm flex items-center justify-center overflow-hidden">
<span className="text-xs font-bold text-muted-foreground">UK</span>
</div>
<span className="text-sm text-foreground">United Kingdom</span>
</div>
<div className="text-right">
<p className="text-sm font-bold text-foreground">12.1%</p>
<div className="w-24 h-1 bg-background rounded-full overflow-hidden mt-1">
<div className="h-full bg-on-surface-variant" ></div>
</div>
</div>
</div>

<div className="flex items-center justify-between">
<div className="flex items-center gap-md">
<div className="w-8 h-6 bg-background rounded-sm flex items-center justify-center overflow-hidden">
<span className="text-xs font-bold text-muted-foreground">SG</span>
</div>
<span className="text-sm text-foreground">Singapore</span>
</div>
<div className="text-right">
<p className="text-sm font-bold text-foreground">9.4%</p>
<div className="w-24 h-1 bg-background rounded-full overflow-hidden mt-1">
<div className="h-full bg-on-surface-variant" ></div>
</div>
</div>
</div>
</div>
</div>
</section>

<section className="bg-card rounded-xl border border-border overflow-hidden">
<div className="p-lg border-b border-border flex justify-between items-center">
<h3 className="text-base font-semibold text-foreground">Recent Proxies</h3>
<div className="flex gap-md">
<button className="flex items-center gap-xs text-muted-foreground hover:text-primary transition-colors text-sm">
<span className="material-symbols-outlined text-sm">filter_list</span>
                            Filter
                        </button>
<button className="flex items-center gap-xs text-muted-foreground hover:text-primary transition-colors text-sm">
<span className="material-symbols-outlined text-sm">download</span>
                            Export
                        </button>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-secondary">
<th className="px-lg py-md font-medium uppercase tracking-wider text-xs text-muted-foreground uppercase tracking-wider">IP Address</th>
<th className="px-lg py-md font-medium uppercase tracking-wider text-xs text-muted-foreground uppercase tracking-wider">Type</th>
<th className="px-lg py-md font-medium uppercase tracking-wider text-xs text-muted-foreground uppercase tracking-wider">Location</th>
<th className="px-lg py-md font-medium uppercase tracking-wider text-xs text-muted-foreground uppercase tracking-wider">Latency</th>
<th className="px-lg py-md font-medium uppercase tracking-wider text-xs text-muted-foreground uppercase tracking-wider">Status</th>
<th className="px-lg py-md font-medium uppercase tracking-wider text-xs text-muted-foreground uppercase tracking-wider text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">

<tr className="hover:bg-accent transition-colors">
<td className="px-lg py-md">
<div className="flex items-center gap-sm">
<span className="font-bold text-foreground">192.168.4.120</span>
<span className="material-symbols-outlined text-xs text-muted-foreground cursor-pointer hover:text-primary">content_copy</span>
</div>
</td>
<td className="px-lg py-md">
<span className="px-sm py-xs bg-background text-purple-500 text-xs rounded border border-secondary/20">Residential</span>
</td>
<td className="px-lg py-md">
<div className="flex items-center gap-xs">
<span className="text-foreground">New York, USA</span>
</div>
</td>
<td className="px-lg py-md text-emerald-400 font-bold">24ms</td>
<td className="px-lg py-md">
<span className="inline-flex items-center gap-xs px-md py-xs rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">
<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                        Active
                                    </span>
</td>
<td className="px-lg py-md text-right">
<button className="material-symbols-outlined text-muted-foreground hover:text-primary transition-all">more_vert</button>
</td>
</tr>

<tr className="hover:bg-accent transition-colors">
<td className="px-lg py-md">
<div className="flex items-center gap-sm">
<span className="font-bold text-foreground">45.72.112.8</span>
<span className="material-symbols-outlined text-xs text-muted-foreground cursor-pointer hover:text-primary">content_copy</span>
</div>
</td>
<td className="px-lg py-md">
<span className="px-sm py-xs bg-background text-blue-500 text-xs rounded border border-tertiary/20">ISP</span>
</td>
<td className="px-lg py-md">
<div className="flex items-center gap-xs">
<span className="text-foreground">Frankfurt, DE</span>
</div>
</td>
<td className="px-lg py-md text-emerald-400 font-bold">38ms</td>
<td className="px-lg py-md">
<span className="inline-flex items-center gap-xs px-md py-xs rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">
<span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                        Active
                                    </span>
</td>
<td className="px-lg py-md text-right">
<button className="material-symbols-outlined text-muted-foreground hover:text-primary transition-all">more_vert</button>
</td>
</tr>

<tr className="hover:bg-accent transition-colors">
<td className="px-lg py-md">
<div className="flex items-center gap-sm">
<span className="font-bold text-foreground">172.16.254.1</span>
<span className="material-symbols-outlined text-xs text-muted-foreground cursor-pointer hover:text-primary">content_copy</span>
</div>
</td>
<td className="px-lg py-md">
<span className="px-sm py-xs bg-background text-purple-500 text-xs rounded border border-secondary/20">Residential</span>
</td>
<td className="px-lg py-md">
<div className="flex items-center gap-xs">
<span className="text-foreground">London, UK</span>
</div>
</td>
<td className="px-lg py-md text-muted-foreground">---</td>
<td className="px-lg py-md">
<span className="inline-flex items-center gap-xs px-md py-xs rounded-full bg-destructive/20 text-destructive-foreground text-xs font-bold">
<span className="w-1.5 h-1.5 rounded-full bg-destructive"></span>
                                        Inactive
                                    </span>
</td>
<td className="px-lg py-md text-right">
<button className="material-symbols-outlined text-muted-foreground hover:text-primary transition-all">more_vert</button>
</td>
</tr>
</tbody>
</table>
</div>
<div className="px-lg py-md border-t border-border flex justify-between items-center bg-secondary/50">
<span className="text-xs text-muted-foreground">Showing 3 of 854 active proxies</span>
<div className="flex items-center gap-md">
<button className="px-md py-xs bg-background rounded text-xs text-muted-foreground hover:bg-accent disabled:opacity-50" disabled="">Previous</button>
<button className="px-md py-xs bg-primary text-primary-foreground rounded text-xs font-bold shadow-md">Next</button>
</div>
</div>
</section>
</main>
</div>



      <div className="fixed bottom-4 right-4 z-50 flex gap-2">
        <ThemeToggle />
        <Link href="/dashboard" className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg hover:opacity-90">
          <ArrowLeft className="h-4 w-4" />
          Back to Main Dashboard
        </Link>
      </div>
    </div>
  )
}
