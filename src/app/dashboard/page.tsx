"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import Nova from "@/components/Nova";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Compass, Lightbulb, BookOpen, Bookmark, Trash2, ExternalLink } from "lucide-react";

interface SavedItem {
  id: number;
  itemType: string;
  itemId: number;
}

interface CareerItem { id: number; title: string; category: string; }
interface OppItem { id: number; title: string; category: string; deadline: string; }
interface ResItem { id: number; title: string; category: string; }

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [savedCareers, setSavedCareers] = useState<CareerItem[]>([]);
  const [savedOpps, setSavedOpps] = useState<OppItem[]>([]);
  const [savedRes, setSavedRes] = useState<ResItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("careers");

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) fetchSaved();
  }, [user]);

  const fetchSaved = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/saved");
      const items: SavedItem[] = await res.json();
      if (!Array.isArray(items)) { setLoading(false); return; }
      setSavedItems(items);

      const careerIds = items.filter(i => i.itemType === "career").map(i => i.itemId);
      const oppIds = items.filter(i => i.itemType === "opportunity").map(i => i.itemId);
      const resIds = items.filter(i => i.itemType === "resource").map(i => i.itemId);

      const [careersRes, oppsRes, resourcesRes] = await Promise.all([
        fetch("/api/careers").then(r => r.json()),
        fetch("/api/opportunities").then(r => r.json()),
        fetch("/api/resources").then(r => r.json()),
      ]);

      setSavedCareers(careersRes.filter((c: CareerItem) => careerIds.includes(c.id)));
      setSavedOpps(oppsRes.filter((o: OppItem) => oppIds.includes(o.id)));
      setSavedRes(resourcesRes.filter((r: ResItem) => resIds.includes(r.id)));
    } catch { /* ignore */ }
    setLoading(false);
  };

  const removeSaved = async (itemType: string, itemId: number) => {
    await fetch("/api/saved", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemType, itemId }),
    });
    fetchSaved();
  };

  if (authLoading || !user) return <LoadingSpinner />;

  const tabs = [
    { key: "careers", label: "Careers", icon: <Compass size={16} />, count: savedCareers.length },
    { key: "opportunities", label: "Opportunities", icon: <Lightbulb size={16} />, count: savedOpps.length },
    { key: "resources", label: "Resources", icon: <BookOpen size={16} />, count: savedRes.length },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="glass-card rounded-3xl p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Nova size="sm" />
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Welcome back, {user.name}! ✨</h1>
            <p className="text-purple-600/70 text-sm mt-1">Your personalized dashboard — track your saved careers, opportunities, and resources.</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="glass-card rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-purple-700">{savedCareers.length}</p>
          <p className="text-xs text-purple-600/70">Saved Careers</p>
        </div>
        <div className="glass-card rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-sky-700">{savedOpps.length}</p>
          <p className="text-xs text-sky-600/70">Saved Opportunities</p>
        </div>
        <div className="glass-card rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-teal-700">{savedRes.length}</p>
          <p className="text-xs text-teal-600/70">Saved Resources</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white/50 rounded-2xl p-1">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.key ? "bg-white shadow-md text-purple-700" : "text-purple-500 hover:bg-white/50"
            }`}
          >
            {tab.icon} {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner message="Loading your saved items..." />
      ) : (
        <div>
          {activeTab === "careers" && (
            savedCareers.length === 0 ? (
              <EmptyState message="No saved careers yet. Explore the Career Explorer to find your path!" href="/careers" />
            ) : (
              <div className="space-y-3">
                {savedCareers.map(c => (
                  <div key={c.id} className="glass-card rounded-2xl p-4 flex items-center justify-between">
                    <Link href={`/careers/${c.id}`} className="flex-1 hover:text-purple-700 transition-colors">
                      <p className="font-semibold text-slate-800">{c.title}</p>
                      <p className="text-xs text-purple-600/70">{c.category}</p>
                    </Link>
                    <div className="flex items-center gap-2">
                      <Link href={`/careers/${c.id}`} className="p-2 hover:bg-purple-50 rounded-lg"><ExternalLink size={16} className="text-purple-500" /></Link>
                      <button onClick={() => removeSaved("career", c.id)} className="p-2 hover:bg-rose-50 rounded-lg"><Trash2 size={16} className="text-rose-400" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
          {activeTab === "opportunities" && (
            savedOpps.length === 0 ? (
              <EmptyState message="No saved opportunities yet. Discover scholarships, programs, and more!" href="/opportunities" />
            ) : (
              <div className="space-y-3">
                {savedOpps.map(o => (
                  <div key={o.id} className="glass-card rounded-2xl p-4 flex items-center justify-between">
                    <Link href={`/opportunities/${o.id}`} className="flex-1 hover:text-purple-700 transition-colors">
                      <p className="font-semibold text-slate-800">{o.title}</p>
                      <p className="text-xs text-purple-600/70">{o.category} · {o.deadline}</p>
                    </Link>
                    <div className="flex items-center gap-2">
                      <Link href={`/opportunities/${o.id}`} className="p-2 hover:bg-purple-50 rounded-lg"><ExternalLink size={16} className="text-purple-500" /></Link>
                      <button onClick={() => removeSaved("opportunity", o.id)} className="p-2 hover:bg-rose-50 rounded-lg"><Trash2 size={16} className="text-rose-400" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
          {activeTab === "resources" && (
            savedRes.length === 0 ? (
              <EmptyState message="No saved resources yet. Check out our curated resource hub!" href="/resources" />
            ) : (
              <div className="space-y-3">
                {savedRes.map(r => (
                  <div key={r.id} className="glass-card rounded-2xl p-4 flex items-center justify-between">
                    <Link href={`/resources/${r.id}`} className="flex-1 hover:text-purple-700 transition-colors">
                      <p className="font-semibold text-slate-800">{r.title}</p>
                      <p className="text-xs text-purple-600/70">{r.category}</p>
                    </Link>
                    <div className="flex items-center gap-2">
                      <Link href={`/resources/${r.id}`} className="p-2 hover:bg-purple-50 rounded-lg"><ExternalLink size={16} className="text-purple-500" /></Link>
                      <button onClick={() => removeSaved("resource", r.id)} className="p-2 hover:bg-rose-50 rounded-lg"><Trash2 size={16} className="text-rose-400" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState({ message, href }: { message: string; href: string }) {
  return (
    <div className="text-center py-12">
      <Nova size="sm" message={message} />
      <Link href={href} className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold shadow-md hover:shadow-lg transition-all">
        <Bookmark size={16} /> Start Exploring
      </Link>
    </div>
  );
}
