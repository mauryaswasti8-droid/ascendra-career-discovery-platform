"use client";
import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Nova from "@/components/Nova";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Search, Filter, MapPin, Calendar, ExternalLink } from "lucide-react";

interface Opportunity {
  id: number;
  title: string;
  description: string;
  eligibility: string;
  deadline: string;
  location: string;
  funding: string;
  category: string;
  featured: boolean;
}

const categories = [
  "All", "Research", "STEM", "Medicine", "Neuroscience", "Biology", "Engineering",
  "Computer Science", "AI", "Economics", "Business", "Finance", "Law", "Psychology",
  "Debate", "Model UN", "Writing", "Journalism", "Leadership", "Social Impact",
  "Environment", "Climate", "Competitions", "Olympiads", "Summer Programs",
  "Scholarships", "Internships"
];

function OpportunitiesContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchOpportunities();
  }, [category]);

  const fetchOpportunities = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== "All") params.set("category", category);
    const res = await fetch(`/api/opportunities?${params}`);
    const data = await res.json();
    setOpportunities(data);
    setLoading(false);
  };

  const filtered = opportunities.filter(o =>
    !search || o.title.toLowerCase().includes(search.toLowerCase()) || o.description.toLowerCase().includes(search.toLowerCase())
  );

  const getCategoryEmoji = (cat: string) => {
    const map: Record<string, string> = {
      Research: "🔬", STEM: "🧪", Medicine: "🩺", Neuroscience: "🧠", Biology: "🧬",
      Engineering: "⚙️", "Computer Science": "💻", AI: "🤖", Economics: "📊",
      Business: "💼", Finance: "💰", Law: "⚖️", Psychology: "🧠", Debate: "🗣️",
      "Model UN": "🌍", Writing: "✍️", Journalism: "📰", Leadership: "👑",
      "Social Impact": "🤝", Environment: "🌿", Climate: "🌍", Competitions: "🏆",
      Olympiads: "🥇", "Summer Programs": "☀️", Scholarships: "🎓", Internships: "💼",
    };
    return map[cat] || "✨";
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Nova size="sm" message="I've gathered amazing opportunities from around the world! 🌎" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Opportunity Explorer</span>
        </h1>
        <p className="text-purple-600/70 max-w-lg mx-auto">50+ scholarships, research programs, competitions, and more</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" size={18} />
          <input
            type="text"
            placeholder="Search opportunities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/80 border border-purple-200 focus:ring-2 focus:ring-purple-300 focus:border-purple-400 outline-none transition-all"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/80 border border-purple-200 text-purple-700 hover:bg-purple-50 transition-colors sm:w-auto"
        >
          <Filter size={18} /> Filter {category !== "All" && `(${category})`}
        </button>
      </div>

      {showFilters && (
        <div className="glass-card rounded-2xl p-4 mb-6 animate-fadeIn">
          <p className="text-sm font-medium text-purple-700 mb-3">Filter by category:</p>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setShowFilters(false); }}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  category === cat ? "bg-purple-500 text-white shadow-md" : "bg-purple-50 text-purple-600 hover:bg-purple-100"
                }`}
              >
                {cat !== "All" && getCategoryEmoji(cat)} {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <LoadingSpinner message="Finding opportunities..." />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Nova size="sm" message="No opportunities found yet. Try a different search or category!" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((opp, i) => (
            <Link
              key={opp.id}
              href={`/opportunities/${opp.id}`}
              className="glass-card rounded-2xl p-5 hover:shadow-xl transition-all group animate-fadeIn"
              style={{ animationDelay: `${i * 0.03}s` }}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 text-xs font-medium">
                  {getCategoryEmoji(opp.category)} {opp.category}
                </span>
                {opp.featured && <span className="text-xs text-amber-600 font-medium">⭐ Featured</span>}
              </div>
              <h3 className="font-bold text-slate-800 group-hover:text-purple-700 transition-colors mb-2 line-clamp-2">{opp.title}</h3>
              <p className="text-sm text-slate-600 line-clamp-2 mb-3">{opp.description}</p>
              <div className="flex flex-wrap gap-3 text-xs text-purple-600">
                <span className="flex items-center gap-1"><Calendar size={12} /> {opp.deadline}</span>
                <span className="flex items-center gap-1"><MapPin size={12} /> {opp.location}</span>
                <span className="flex items-center gap-1"><ExternalLink size={12} /> {opp.funding}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OpportunitiesPage() {
  return (
    <Suspense fallback={<LoadingSpinner message="Loading opportunities..." />}>
      <OpportunitiesContent />
    </Suspense>
  );
}
