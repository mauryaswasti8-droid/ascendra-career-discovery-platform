"use client";
import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import Nova from "@/components/Nova";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ArrowLeft, TrendingUp, DollarSign, MapPin, GraduationCap, Bookmark, BookmarkCheck, Wrench, Trophy } from "lucide-react";

interface Career {
  id: number;
  title: string;
  overview: string;
  futureGrowth: string;
  requiredDegrees: string[];
  recommendedMajors: string[];
  salaryMin: number;
  salaryMax: number;
  skillsRequired: string[];
  bestCountries: string[];
  extracurriculars: string[];
  category: string;
  tags: string[];
  isEmerging: boolean;
}

export default function CareerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const [career, setCareer] = useState<Career | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/careers/${id}`)
      .then(r => r.json())
      .then(data => { setCareer(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (user) {
      fetch("/api/saved").then(r => r.json()).then(items => {
        if (Array.isArray(items)) {
          setSaved(items.some((s: { itemType: string; itemId: number }) => s.itemType === "career" && s.itemId === parseInt(id)));
        }
      });
    }
  }, [user, id]);

  const toggleSave = async () => {
    if (!user) { router.push("/login"); return; }
    setSaved(!saved);
    await fetch("/api/saved", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemType: "career", itemId: parseInt(id) }),
    });
  };

  if (loading) return <LoadingSpinner message="Loading career details..." />;
  if (!career) return <div className="text-center py-16"><Nova size="sm" message="Career not found! Try exploring others." /></div>;

  const formatSalary = (n: number) => `$${(n / 1000).toFixed(0)}K`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => router.back()} className="flex items-center gap-1 text-purple-600 hover:text-purple-800 mb-6 text-sm">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="glass-card rounded-3xl p-6 sm:p-8 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">{career.title}</h1>
              {career.isEmerging && (
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 text-xs font-medium">🚀 Emerging</span>
              )}
            </div>
            <span className="text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full">{career.category}</span>
          </div>
          <button onClick={toggleSave} className="p-2 rounded-xl hover:bg-purple-100 transition-colors">
            {saved ? <BookmarkCheck className="text-purple-500" size={24} /> : <Bookmark className="text-purple-400" size={24} />}
          </button>
        </div>

        <p className="text-slate-600 mb-6 leading-relaxed">{career.overview}</p>

        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-4">
            <div className="flex items-center gap-2 text-emerald-700 font-semibold mb-1"><DollarSign size={16} /> Salary Range</div>
            <p className="text-lg font-bold text-emerald-800">{formatSalary(career.salaryMin)} – {formatSalary(career.salaryMax)}</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-sky-50 p-4">
            <div className="flex items-center gap-2 text-sky-700 font-semibold mb-1"><TrendingUp size={16} /> Growth</div>
            <p className="text-sm text-sky-800 font-medium">{career.futureGrowth}</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
            <div className="flex items-center gap-2 text-purple-700 font-semibold mb-1"><MapPin size={16} /> Top Countries</div>
            <p className="text-sm text-purple-800">{career.bestCountries.slice(0, 3).join(", ")}</p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><GraduationCap size={18} className="text-purple-500" /> Required Degrees</h3>
          <ul className="space-y-1.5">
            {career.requiredDegrees.map(d => <li key={d} className="text-sm text-slate-600 flex items-center gap-2">• {d}</li>)}
          </ul>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><GraduationCap size={18} className="text-indigo-500" /> Recommended Majors</h3>
          <div className="flex flex-wrap gap-2">
            {career.recommendedMajors.map(m => (
              <span key={m} className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm">{m}</span>
            ))}
          </div>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><Wrench size={18} className="text-teal-500" /> Skills Required</h3>
          <div className="flex flex-wrap gap-2">
            {career.skillsRequired.map(s => (
              <span key={s} className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-sm">{s}</span>
            ))}
          </div>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><Trophy size={18} className="text-amber-500" /> Recommended Extracurriculars</h3>
          <ul className="space-y-1.5">
            {career.extracurriculars.map(e => <li key={e} className="text-sm text-slate-600 flex items-center gap-2">⭐ {e}</li>)}
          </ul>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 mt-6">
        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><MapPin size={18} className="text-purple-500" /> Best Countries to Study</h3>
        <div className="flex flex-wrap gap-2">
          {career.bestCountries.map(c => (
            <span key={c} className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 text-sm font-medium">🌍 {c}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
