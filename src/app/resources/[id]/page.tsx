"use client";
import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import LoadingSpinner from "@/components/LoadingSpinner";
import Nova from "@/components/Nova";
import { ArrowLeft, Bookmark, BookmarkCheck, ExternalLink, CheckCircle2, Wrench } from "lucide-react";

interface Resource {
  id: number;
  title: string;
  description: string;
  officialLink: string;
  category: string;
  guidance: string[];
  tools: string[];
}

export default function ResourceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/resources/${id}`)
      .then(r => r.json())
      .then(data => { setResource(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (user) {
      fetch("/api/saved").then(r => r.json()).then(items => {
        if (Array.isArray(items)) {
          setSaved(items.some((s: { itemType: string; itemId: number }) => s.itemType === "resource" && s.itemId === parseInt(id)));
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
      body: JSON.stringify({ itemType: "resource", itemId: parseInt(id) }),
    });
  };

  if (loading) return <LoadingSpinner />;
  if (!resource) return <div className="text-center py-16"><Nova size="sm" message="Resource not found!" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => router.back()} className="flex items-center gap-1 text-purple-600 hover:text-purple-800 mb-6 text-sm">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="glass-card rounded-3xl p-6 sm:p-8 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 text-xs font-medium">{resource.category}</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2">{resource.title}</h1>
          </div>
          <button onClick={toggleSave} className="p-2 rounded-xl hover:bg-purple-100 transition-colors shrink-0">
            {saved ? <BookmarkCheck className="text-purple-500" size={24} /> : <Bookmark className="text-purple-400" size={24} />}
          </button>
        </div>
        <p className="text-slate-600 leading-relaxed mb-6">{resource.description}</p>
        <a
          href={resource.officialLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold shadow-md hover:shadow-lg transition-all"
        >
          <ExternalLink size={16} /> Visit Official Resource
        </a>
      </div>

      <div className="glass-card rounded-2xl p-6 mb-6">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <CheckCircle2 size={20} className="text-emerald-500" /> Step-by-Step Guidance
        </h3>
        <ol className="space-y-3">
          {resource.guidance.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-700 flex items-center justify-center text-sm font-bold">
                {i + 1}
              </span>
              <p className="text-sm text-slate-600 pt-1">{step}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Wrench size={20} className="text-teal-500" /> Recommended Tools
        </h3>
        <div className="flex flex-wrap gap-2">
          {resource.tools.map(tool => (
            <span key={tool} className="px-3 py-1.5 rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 text-teal-700 text-sm font-medium">
              {tool}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
