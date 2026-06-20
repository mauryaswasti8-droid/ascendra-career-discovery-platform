"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Nova from "@/components/Nova";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Search, Filter, ExternalLink, BookOpen } from "lucide-react";

interface Resource {
  id: number;
  title: string;
  description: string;
  officialLink: string;
  category: string;
  tools: string[];
  featured: boolean;
}

const categories = [
  "All", "SAT Preparation", "IELTS Preparation", "TOEFL Preparation",
  "Duolingo English Test Preparation", "Common App Resources", "College Essay Resources",
  "Personal Statement Resources", "Research Paper Writing Resources",
  "Scholarship Resources", "Financial Aid Resources", "Study Abroad Resources",
  "Visa Resources", "Interview Preparation Resources", "Resume Building Resources"
];

const categoryEmojis: Record<string, string> = {
  "SAT Preparation": "📝", "IELTS Preparation": "🇬🇧", "TOEFL Preparation": "🎯",
  "Duolingo English Test Preparation": "🦉", "Common App Resources": "📋",
  "College Essay Resources": "✍️", "Personal Statement Resources": "📄",
  "Research Paper Writing Resources": "🔬", "Scholarship Resources": "🎓",
  "Financial Aid Resources": "💰", "Study Abroad Resources": "✈️",
  "Visa Resources": "🛂", "Interview Preparation Resources": "🎤",
  "Resume Building Resources": "📑"
};

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchResources();
  }, [category]);

  const fetchResources = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== "All") params.set("category", category);
    const res = await fetch(`/api/resources?${params}`);
    const data = await res.json();
    setResources(data);
    setLoading(false);
  };

  const filtered = resources.filter(r =>
    !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Nova size="sm" message="Your study resources are all in one magical place! 📚" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Resource Hub</span>
        </h1>
        <p className="text-purple-600/70 max-w-lg mx-auto">50+ curated resources for test prep, applications, and more</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" size={18} />
          <input
            type="text"
            placeholder="Search resources..."
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
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  category === cat ? "bg-purple-500 text-white shadow-md" : "bg-purple-50 text-purple-600 hover:bg-purple-100"
                }`}
              >
                {cat !== "All" && categoryEmojis[cat]} {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <LoadingSpinner message="Loading resources..." />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Nova size="sm" message="No resources found. Try a different search!" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((resource, i) => (
            <Link
              key={resource.id}
              href={`/resources/${resource.id}`}
              className="glass-card rounded-2xl p-5 hover:shadow-xl transition-all group animate-fadeIn"
              style={{ animationDelay: `${i * 0.03}s` }}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 text-xs font-medium">
                  {categoryEmojis[resource.category] || "📖"} {resource.category}
                </span>
              </div>
              <h3 className="font-bold text-slate-800 group-hover:text-purple-700 transition-colors mb-2 line-clamp-2">{resource.title}</h3>
              <p className="text-sm text-slate-600 line-clamp-2 mb-3">{resource.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {resource.tools.slice(0, 2).map(t => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 text-xs">{t}</span>
                ))}
                {resource.tools.length > 2 && (
                  <span className="px-2 py-0.5 rounded-full bg-gray-50 text-gray-500 text-xs">+{resource.tools.length - 2}</span>
                )}
              </div>
              <span className="text-xs text-purple-600 flex items-center gap-1">
                <BookOpen size={12} /> Read guide <ExternalLink size={10} />
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
