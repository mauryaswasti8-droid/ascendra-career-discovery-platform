"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Nova from "@/components/Nova";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Search, Sparkles, TrendingUp, DollarSign, MapPin, ArrowRight } from "lucide-react";

interface Career {
  id: number;
  title: string;
  overview: string;
  futureGrowth: string;
  salaryMin: number;
  salaryMax: number;
  category: string;
  tags: string[];
  isEmerging: boolean;
  bestCountries: string[];
}

const interestTags = [
  "ai", "computer science", "stem", "engineering", "technology", "medicine",
  "biology", "neuroscience", "psychology", "business", "finance", "economics",
  "law", "social impact", "environment", "climate", "leadership", "writing", "journalism", "physics"
];

export default function CareersPage() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showExplorer, setShowExplorer] = useState(false);

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async (tags?: string[]) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (tags && tags.length > 0) params.set("tags", tags.join(","));
    const res = await fetch(`/api/careers?${params}`);
    const data = await res.json();
    setCareers(data);
    setLoading(false);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      const next = prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag];
      return next;
    });
  };

  const discoverCareers = () => {
    fetchCareers(selectedTags);
    setShowExplorer(false);
  };

  const filtered = careers.filter(c =>
    !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.overview.toLowerCase().includes(search.toLowerCase())
  );

  const formatSalary = (n: number) => `$${(n / 1000).toFixed(0)}K`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Nova size="sm" message="Let me help you discover your ideal career path! 🌟" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Career Explorer</span>
        </h1>
        <p className="text-purple-600/70 max-w-lg mx-auto">Explore 30+ careers spanning traditional and emerging fields</p>
      </div>

      {/* Career Discovery Tool */}
      <div className="glass-card rounded-3xl p-6 mb-8">
        <button
          onClick={() => setShowExplorer(!showExplorer)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
              <Sparkles className="text-purple-500" size={20} />
            </div>
            <div>
              <p className="font-semibold text-slate-800">Interactive Career Discovery</p>
              <p className="text-sm text-purple-600/70">Select your interests to find matching careers</p>
            </div>
          </div>
          <ArrowRight size={20} className={`text-purple-500 transition-transform ${showExplorer ? "rotate-90" : ""}`} />
        </button>

        {showExplorer && (
          <div className="mt-6 animate-fadeIn">
            <p className="text-sm font-medium text-purple-700 mb-3">Select your interests:</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {interestTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedTags.includes(tag)
                      ? "bg-purple-500 text-white shadow-md"
                      : "bg-purple-50 text-purple-600 hover:bg-purple-100"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            <button
              onClick={discoverCareers}
              disabled={selectedTags.length === 0}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              Discover Careers ✨
            </button>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" size={18} />
        <input
          type="text"
          placeholder="Search careers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/80 border border-purple-200 focus:ring-2 focus:ring-purple-300 focus:border-purple-400 outline-none transition-all"
        />
      </div>

      {/* Results */}
      {loading ? (
        <LoadingSpinner message="Discovering careers..." />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Nova size="sm" message="No careers found matching your criteria. Try different interests!" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((career, i) => (
            <Link
              key={career.id}
              href={`/careers/${career.id}`}
              className="glass-card rounded-2xl p-5 hover:shadow-xl transition-all group animate-fadeIn"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-slate-800 group-hover:text-purple-700 transition-colors pr-2">
                  {career.title}
                </h3>
                {career.isEmerging && (
                  <span className="shrink-0 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 text-xs font-medium">
                    🚀 Emerging
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-600 line-clamp-2 mb-3">{career.overview}</p>
              <div className="flex flex-wrap gap-3 text-xs text-purple-600">
                <span className="flex items-center gap-1"><DollarSign size={12} /> {formatSalary(career.salaryMin)}-{formatSalary(career.salaryMax)}</span>
                <span className="flex items-center gap-1"><TrendingUp size={12} /> {career.futureGrowth.split("–")[0]}</span>
                <span className="flex items-center gap-1"><MapPin size={12} /> {career.bestCountries[0]}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {career.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 text-xs">{tag}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
