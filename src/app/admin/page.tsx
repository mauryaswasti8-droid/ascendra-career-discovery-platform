"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import LoadingSpinner from "@/components/LoadingSpinner";
import Nova from "@/components/Nova";
import { Shield, Lightbulb, BookOpen, Plus, Pencil, Trash2, X, Save, ChevronDown, ChevronUp } from "lucide-react";

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
}

interface Resource {
  id: number;
  title: string;
  description: string;
  officialLink: string;
  category: string;
  guidance: string[];
  tools: string[];
  featured: boolean;
}

const oppCategories = ["Research", "STEM", "Medicine", "Neuroscience", "Biology", "Engineering", "Computer Science", "AI", "Economics", "Business", "Finance", "Law", "Psychology", "Debate", "Model UN", "Writing", "Journalism", "Leadership", "Social Impact", "Environment", "Climate", "Competitions", "Olympiads", "Summer Programs", "Scholarships", "Internships"];
const resCategories = ["SAT Preparation", "IELTS Preparation", "TOEFL Preparation", "Duolingo English Test Preparation", "Common App Resources", "College Essay Resources", "Personal Statement Resources", "Research Paper Writing Resources", "Scholarship Resources", "Financial Aid Resources", "Study Abroad Resources", "Visa Resources", "Interview Preparation Resources", "Resume Building Resources"];

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"opportunities" | "resources">("opportunities");
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOpp, setEditingOpp] = useState<Partial<Opportunity> | null>(null);
  const [editingRes, setEditingRes] = useState<Partial<Resource> | null>(null);
  const [expandedOpp, setExpandedOpp] = useState<number | null>(null);
  const [expandedRes, setExpandedRes] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === "admin") fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    const [opps, res] = await Promise.all([
      fetch("/api/opportunities").then(r => r.json()),
      fetch("/api/resources").then(r => r.json()),
    ]);
    setOpportunities(opps);
    setResources(res);
    setLoading(false);
  };

  const saveOpp = async () => {
    if (!editingOpp) return;
    if (editingOpp.id) {
      await fetch(`/api/opportunities/${editingOpp.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingOpp),
      });
    } else {
      await fetch("/api/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingOpp),
      });
    }
    setEditingOpp(null);
    fetchData();
  };

  const deleteOpp = async (id: number) => {
    if (!confirm("Delete this opportunity?")) return;
    await fetch(`/api/opportunities/${id}`, { method: "DELETE" });
    fetchData();
  };

  const saveRes = async () => {
    if (!editingRes) return;
    const data = {
      ...editingRes,
      guidance: typeof editingRes.guidance === "string" ? (editingRes.guidance as string).split("\n").filter(Boolean) : editingRes.guidance || [],
      tools: typeof editingRes.tools === "string" ? (editingRes.tools as string).split(",").map((t: string) => t.trim()).filter(Boolean) : editingRes.tools || [],
    };
    if (editingRes.id) {
      await fetch(`/api/resources/${editingRes.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    setEditingRes(null);
    fetchData();
  };

  const deleteRes = async (id: number) => {
    if (!confirm("Delete this resource?")) return;
    await fetch(`/api/resources/${id}`, { method: "DELETE" });
    fetchData();
  };

  if (authLoading || !user) return <LoadingSpinner />;
  if (user.role !== "admin") return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="glass-card rounded-3xl p-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
            <Shield className="text-amber-600" size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
            <p className="text-sm text-purple-600/70">Manage opportunities, resources, and content</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white/50 rounded-2xl p-1">
        <button onClick={() => setActiveTab("opportunities")} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === "opportunities" ? "bg-white shadow-md text-purple-700" : "text-purple-500"}`}>
          <Lightbulb size={16} /> Opportunities ({opportunities.length})
        </button>
        <button onClick={() => setActiveTab("resources")} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === "resources" ? "bg-white shadow-md text-purple-700" : "text-purple-500"}`}>
          <BookOpen size={16} /> Resources ({resources.length})
        </button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <>
          {/* Opportunities Tab */}
          {activeTab === "opportunities" && (
            <div>
              <button
                onClick={() => setEditingOpp({ title: "", description: "", eligibility: "", deadline: "", location: "", funding: "", benefits: "", requirements: "", website: "", applicationLink: "", source: "", category: "Research", featured: false })}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold shadow-md hover:shadow-lg transition-all mb-4"
              >
                <Plus size={16} /> Add Opportunity
              </button>

              {editingOpp && <OppForm opp={editingOpp} setOpp={setEditingOpp} onSave={saveOpp} onCancel={() => setEditingOpp(null)} categories={oppCategories} />}

              <div className="space-y-2">
                {opportunities.map(opp => (
                  <div key={opp.id} className="glass-card rounded-2xl overflow-hidden">
                    <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setExpandedOpp(expandedOpp === opp.id ? null : opp.id)}>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 text-sm">{opp.title}</p>
                        <p className="text-xs text-purple-600/70">{opp.category} · {opp.deadline}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={(e) => { e.stopPropagation(); setEditingOpp(opp); }} className="p-1.5 hover:bg-purple-50 rounded-lg"><Pencil size={14} className="text-purple-500" /></button>
                        <button onClick={(e) => { e.stopPropagation(); deleteOpp(opp.id); }} className="p-1.5 hover:bg-rose-50 rounded-lg"><Trash2 size={14} className="text-rose-400" /></button>
                        {expandedOpp === opp.id ? <ChevronUp size={16} className="text-purple-400" /> : <ChevronDown size={16} className="text-purple-400" />}
                      </div>
                    </div>
                    {expandedOpp === opp.id && (
                      <div className="px-4 pb-4 text-xs text-slate-600 border-t border-purple-100 pt-3 space-y-1 animate-fadeIn">
                        <p><strong>Eligibility:</strong> {opp.eligibility}</p>
                        <p><strong>Funding:</strong> {opp.funding}</p>
                        <p><strong>Location:</strong> {opp.location}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === "resources" && (
            <div>
              <button
                onClick={() => setEditingRes({ title: "", description: "", officialLink: "", category: "SAT Preparation", guidance: [], tools: [], featured: false })}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold shadow-md hover:shadow-lg transition-all mb-4"
              >
                <Plus size={16} /> Add Resource
              </button>

              {editingRes && <ResForm res={editingRes} setRes={setEditingRes} onSave={saveRes} onCancel={() => setEditingRes(null)} categories={resCategories} />}

              <div className="space-y-2">
                {resources.map(res => (
                  <div key={res.id} className="glass-card rounded-2xl overflow-hidden">
                    <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setExpandedRes(expandedRes === res.id ? null : res.id)}>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 text-sm">{res.title}</p>
                        <p className="text-xs text-purple-600/70">{res.category}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={(e) => { e.stopPropagation(); setEditingRes({ ...res, guidance: res.guidance, tools: res.tools }); }} className="p-1.5 hover:bg-purple-50 rounded-lg"><Pencil size={14} className="text-purple-500" /></button>
                        <button onClick={(e) => { e.stopPropagation(); deleteRes(res.id); }} className="p-1.5 hover:bg-rose-50 rounded-lg"><Trash2 size={14} className="text-rose-400" /></button>
                        {expandedRes === res.id ? <ChevronUp size={16} className="text-purple-400" /> : <ChevronDown size={16} className="text-purple-400" />}
                      </div>
                    </div>
                    {expandedRes === res.id && (
                      <div className="px-4 pb-4 text-xs text-slate-600 border-t border-purple-100 pt-3 animate-fadeIn">
                        <p>{res.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function OppForm({ opp, setOpp, onSave, onCancel, categories }: {
  opp: Partial<Opportunity>;
  setOpp: (o: Partial<Opportunity> | null) => void;
  onSave: () => void;
  onCancel: () => void;
  categories: string[];
}) {
  const update = (field: string, val: string | boolean) => setOpp({ ...opp, [field]: val });
  return (
    <div className="glass-card rounded-2xl p-6 mb-4 animate-fadeIn">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-800">{opp.id ? "Edit" : "Add"} Opportunity</h3>
        <button onClick={onCancel} className="p-1.5 hover:bg-purple-50 rounded-lg"><X size={16} className="text-purple-500" /></button>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <input placeholder="Title" value={opp.title || ""} onChange={e => update("title", e.target.value)} className="px-3 py-2 rounded-xl bg-white/80 border border-purple-200 text-sm outline-none focus:ring-2 focus:ring-purple-300" />
        <select value={opp.category || ""} onChange={e => update("category", e.target.value)} className="px-3 py-2 rounded-xl bg-white/80 border border-purple-200 text-sm outline-none focus:ring-2 focus:ring-purple-300">
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input placeholder="Eligibility" value={opp.eligibility || ""} onChange={e => update("eligibility", e.target.value)} className="px-3 py-2 rounded-xl bg-white/80 border border-purple-200 text-sm outline-none focus:ring-2 focus:ring-purple-300" />
        <input placeholder="Deadline" value={opp.deadline || ""} onChange={e => update("deadline", e.target.value)} className="px-3 py-2 rounded-xl bg-white/80 border border-purple-200 text-sm outline-none focus:ring-2 focus:ring-purple-300" />
        <input placeholder="Location" value={opp.location || ""} onChange={e => update("location", e.target.value)} className="px-3 py-2 rounded-xl bg-white/80 border border-purple-200 text-sm outline-none focus:ring-2 focus:ring-purple-300" />
        <input placeholder="Funding" value={opp.funding || ""} onChange={e => update("funding", e.target.value)} className="px-3 py-2 rounded-xl bg-white/80 border border-purple-200 text-sm outline-none focus:ring-2 focus:ring-purple-300" />
        <input placeholder="Website URL" value={opp.website || ""} onChange={e => update("website", e.target.value)} className="px-3 py-2 rounded-xl bg-white/80 border border-purple-200 text-sm outline-none focus:ring-2 focus:ring-purple-300" />
        <input placeholder="Application Link" value={opp.applicationLink || ""} onChange={e => update("applicationLink", e.target.value)} className="px-3 py-2 rounded-xl bg-white/80 border border-purple-200 text-sm outline-none focus:ring-2 focus:ring-purple-300" />
        <input placeholder="Source" value={opp.source || ""} onChange={e => update("source", e.target.value)} className="px-3 py-2 rounded-xl bg-white/80 border border-purple-200 text-sm outline-none focus:ring-2 focus:ring-purple-300" />
        <label className="flex items-center gap-2 text-sm text-purple-700">
          <input type="checkbox" checked={opp.featured || false} onChange={e => update("featured", e.target.checked)} className="rounded" /> Featured
        </label>
      </div>
      <textarea placeholder="Description" value={opp.description || ""} onChange={e => update("description", e.target.value)} rows={2} className="w-full mt-3 px-3 py-2 rounded-xl bg-white/80 border border-purple-200 text-sm outline-none focus:ring-2 focus:ring-purple-300" />
      <textarea placeholder="Benefits" value={opp.benefits || ""} onChange={e => update("benefits", e.target.value)} rows={2} className="w-full mt-2 px-3 py-2 rounded-xl bg-white/80 border border-purple-200 text-sm outline-none focus:ring-2 focus:ring-purple-300" />
      <textarea placeholder="Requirements" value={opp.requirements || ""} onChange={e => update("requirements", e.target.value)} rows={2} className="w-full mt-2 px-3 py-2 rounded-xl bg-white/80 border border-purple-200 text-sm outline-none focus:ring-2 focus:ring-purple-300" />
      <div className="flex justify-end gap-2 mt-4">
        <button onClick={onCancel} className="px-4 py-2 rounded-xl text-sm text-purple-600 hover:bg-purple-50">Cancel</button>
        <button onClick={onSave} className="flex items-center gap-1 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-semibold shadow-md hover:shadow-lg"><Save size={14} /> Save</button>
      </div>
    </div>
  );
}

function ResForm({ res, setRes, onSave, onCancel, categories }: {
  res: Partial<Resource>;
  setRes: (r: Partial<Resource> | null) => void;
  onSave: () => void;
  onCancel: () => void;
  categories: string[];
}) {
  const update = (field: string, val: unknown) => setRes({ ...res, [field]: val });
  const guidanceStr = Array.isArray(res.guidance) ? res.guidance.join("\n") : (res.guidance || "");
  const toolsStr = Array.isArray(res.tools) ? res.tools.join(", ") : (res.tools || "");

  return (
    <div className="glass-card rounded-2xl p-6 mb-4 animate-fadeIn">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-800">{res.id ? "Edit" : "Add"} Resource</h3>
        <button onClick={onCancel} className="p-1.5 hover:bg-purple-50 rounded-lg"><X size={16} className="text-purple-500" /></button>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <input placeholder="Title" value={res.title || ""} onChange={e => update("title", e.target.value)} className="px-3 py-2 rounded-xl bg-white/80 border border-purple-200 text-sm outline-none focus:ring-2 focus:ring-purple-300" />
        <select value={res.category || ""} onChange={e => update("category", e.target.value)} className="px-3 py-2 rounded-xl bg-white/80 border border-purple-200 text-sm outline-none focus:ring-2 focus:ring-purple-300">
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input placeholder="Official Link" value={res.officialLink || ""} onChange={e => update("officialLink", e.target.value)} className="px-3 py-2 rounded-xl bg-white/80 border border-purple-200 text-sm outline-none focus:ring-2 focus:ring-purple-300 sm:col-span-2" />
      </div>
      <textarea placeholder="Description" value={res.description || ""} onChange={e => update("description", e.target.value)} rows={2} className="w-full mt-3 px-3 py-2 rounded-xl bg-white/80 border border-purple-200 text-sm outline-none focus:ring-2 focus:ring-purple-300" />
      <textarea placeholder="Guidance (one step per line)" value={guidanceStr} onChange={e => update("guidance", e.target.value)} rows={4} className="w-full mt-2 px-3 py-2 rounded-xl bg-white/80 border border-purple-200 text-sm outline-none focus:ring-2 focus:ring-purple-300" />
      <input placeholder="Tools (comma-separated)" value={toolsStr} onChange={e => update("tools", e.target.value)} className="w-full mt-2 px-3 py-2 rounded-xl bg-white/80 border border-purple-200 text-sm outline-none focus:ring-2 focus:ring-purple-300" />
      <div className="flex justify-end gap-2 mt-4">
        <button onClick={onCancel} className="px-4 py-2 rounded-xl text-sm text-purple-600 hover:bg-purple-50">Cancel</button>
        <button onClick={onSave} className="flex items-center gap-1 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-semibold shadow-md hover:shadow-lg"><Save size={14} /> Save</button>
      </div>
    </div>
  );
}
