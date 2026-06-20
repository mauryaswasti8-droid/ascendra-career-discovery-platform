"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Nova from "@/components/Nova";
import { Compass, Lightbulb, BookOpen, Sparkles, ArrowRight, Star } from "lucide-react";

export default function HomePage() {
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    fetch("/api/seed", { method: "POST" }).then(() => setSeeded(true)).catch(() => setSeeded(true));
  }, []);

  const features = [
    { icon: <Compass className="text-purple-500" size={32} />, title: "Career Explorer", desc: "Discover your dream career with our interactive discovery tool. Explore 30+ careers with detailed insights.", href: "/careers", color: "from-purple-100 to-indigo-100" },
    { icon: <Lightbulb className="text-sky-500" size={32} />, title: "Opportunity Explorer", desc: "Browse 50+ scholarships, research programs, competitions, and internships from around the world.", href: "/opportunities", color: "from-sky-100 to-blue-100" },
    { icon: <BookOpen className="text-teal-500" size={32} />, title: "Resource Hub", desc: "Access curated resources for SAT prep, college essays, study abroad guides, and more.", href: "/resources", color: "from-teal-100 to-emerald-100" },
  ];

  const categories = [
    "Research", "STEM", "Medicine", "AI", "Engineering", "Computer Science",
    "Scholarships", "Summer Programs", "Competitions", "Olympiads",
    "Leadership", "Social Impact", "Business", "Writing"
  ];

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-12 pb-20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-6">
            <Nova size="lg" />
          </div>
          <div className="animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100/80 text-purple-700 text-sm font-medium mb-6">
              <Sparkles size={14} /> Meet Nova, your magical guide
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 bg-clip-text text-transparent">
                Discover Your Path
              </span>
              <br />
              <span className="text-slate-700">to Greatness</span>
            </h1>
            <p className="text-lg sm:text-xl text-purple-700/70 max-w-2xl mx-auto mb-8">
              Explore careers, find opportunities, and access resources designed to help you reach the stars. 
              Your journey begins here. ✨
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/careers"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-indigo-600 transition-all"
              >
                <Compass size={18} /> Explore Careers <ArrowRight size={16} />
              </Link>
              <Link
                href="/opportunities"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white/80 text-purple-700 font-semibold shadow-md hover:shadow-lg border border-purple-200 transition-all"
              >
                <Lightbulb size={18} /> Find Opportunities
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-3">Everything You Need to Shine</h2>
            <p className="text-purple-600/70">Three powerful tools in one magical platform</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <Link
                key={f.title}
                href={f.href}
                className="group glass-card rounded-3xl p-6 hover:shadow-xl transition-all duration-300 animate-slideUp"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-600 mb-4">{f.desc}</p>
                <span className="text-sm font-medium text-purple-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                  Explore <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-3">Explore by Interest</h2>
            <p className="text-purple-600/70">Find opportunities in your favorite fields</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/opportunities?category=${encodeURIComponent(cat)}`}
                className="px-4 py-2 rounded-full glass-card text-sm font-medium text-purple-700 hover:bg-purple-200/50 hover:shadow-md transition-all"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Story */}

<section className="px-4 py-16">
  <div className="max-w-4xl mx-auto">
    <div className="glass-card rounded-3xl p-8 md:p-12">
      <h2 className="text-3xl font-bold text-center mb-6">
        Why I Built Ascendra
      </h2>

```
  <p className="text-gray-700 leading-relaxed mb-4">
    Hi, I'm Swasti Maurya.
  </p>

  <p className="text-gray-700 leading-relaxed mb-4">
    Growing up in an under-resourced area, I often felt that opportunities
    existed, but students like me didn't know where to find them.
  </p>

  <p className="text-gray-700 leading-relaxed mb-4">
    Whether it was scholarships, research programs, competitions,
    internships, or study-abroad guidance, the information was scattered
    and difficult to access without the right networks or support.
  </p>

  <p className="text-gray-700 leading-relaxed mb-4">
    Over the years, I worked to build my own path through leadership,
    research, neuroscience programs, international collaborations,
    community initiatives, and university applications abroad.
  </p>

  <p className="text-gray-700 leading-relaxed mb-4">
    I created Ascendra so that students wouldn't have to spend years
    searching for opportunities the way I did.
  </p>

  <p className="text-gray-700 leading-relaxed font-medium">
    My goal is simple: no student should miss a life-changing opportunity
    simply because they didn't know it existed.
  </p>
</div>

  </div>
</section>
    </div>
  );
}