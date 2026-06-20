"use client";
import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import LoadingSpinner from "@/components/LoadingSpinner";
import Nova from "@/components/Nova";
import { ArrowLeft, Bookmark, BookmarkCheck, Calendar, MapPin, DollarSign, ExternalLink, Users, Award, FileText, Clock } from "lucide-react";

interface Opportunity {
  id: number;
  title: string;
  description: string;
  eligibility: string;
  deadline: string;
  location: string;
  funding: string;
  benefits: string;
  requirements: string;
  website: string;
  applicationLink: string;
  source: string;
  category: string;
  featured: boolean;
  lastUpdated: string;
}

export default function OpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const [opp, setOpp] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/opportunities/${id}`)
      .then(r => r.json())
      .then(data => { setOpp(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (user) {
      fetch("/api/saved").then(r => r.json()).then(items => {
        if (Array.isArray(items)) {
          setSaved(items.some((s: { itemType: string; itemId: number }) => s.itemType === "opportunity" && s.itemId === parseInt(id)));
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
      body: JSON.stringify({ itemType: "opportunity", itemId: parseInt(id) }),
    });
  };

  if (loading) return <LoadingSpinner />;
  if (!opp) return <div className="text-center py-16"><Nova size="sm" message="Opportunity not found!" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => router.back()} className="flex items-center gap-1 text-purple-600 hover:text-purple-800 mb-6 text-sm">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="glass-card rounded-3xl p-6 sm:p-8 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 text-xs font-medium">{opp.category}</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2">{opp.title}</h1>
            <p className="text-sm text-purple-600/70 mt-1">Source: {opp.source}</p>
          </div>
          <button onClick={toggleSave} className="p-2 rounded-xl hover:bg-purple-100 transition-colors shrink-0">
            {saved ? <BookmarkCheck className="text-purple-500" size={24} /> : <Bookmark className="text-purple-400" size={24} />}
          </button>
        </div>
        <p className="text-slate-600 leading-relaxed mb-6">{opp.description}</p>

        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-sky-50 p-4">
            <div className="flex items-center gap-2 text-sky-700 font-semibold mb-1"><Calendar size={16} /> Deadline</div>
            <p className="text-sm text-sky-800">{opp.deadline}</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-4">
            <div className="flex items-center gap-2 text-emerald-700 font-semibold mb-1"><DollarSign size={16} /> Funding</div>
            <p className="text-sm text-emerald-800">{opp.funding}</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
            <div className="flex items-center gap-2 text-purple-700 font-semibold mb-1"><MapPin size={16} /> Location</div>
            <p className="text-sm text-purple-800">{opp.location}</p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><Users size={18} className="text-purple-500" /> Eligibility</h3>
          <p className="text-sm text-slate-600">{opp.eligibility}</p>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><Award size={18} className="text-amber-500" /> Benefits</h3>
          <p className="text-sm text-slate-600">{opp.benefits}</p>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><FileText size={18} className="text-teal-500" /> Requirements</h3>
          <p className="text-sm text-slate-600">{opp.requirements}</p>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><Clock size={18} className="text-indigo-500" /> Last Updated</h3>
          <p className="text-sm text-slate-600">{new Date(opp.lastUpdated).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <a
          href={opp.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white/80 border border-purple-200 text-purple-700 font-semibold hover:shadow-lg transition-all"
        >
          <ExternalLink size={16} /> Official Website
        </a>
        <a
          href={opp.applicationLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold shadow-md hover:shadow-lg transition-all"
        >
          Apply Now ✨
        </a>
      </div>
    </div>
  );
}
