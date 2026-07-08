import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import {
  LogOut,
  Calendar,
  Award,
  Users,
  Image as ImageIcon,
  Plus,
  Trash2,
  Upload,
  RefreshCw,
  Zap,
  Globe,
  PlusCircle,
  XCircle,
  Pencil,
} from "lucide-react";
import { isSupabaseEnabled, supabase } from "@/lib/supabase";
import {
  getEvents,
  saveEvent,
  deleteEvent,
  getSponsors,
  saveSponsor,
  deleteSponsor,
  updateSponsorCategory,
  getTeam,
  saveTeamMember,
  deleteTeamMember,
  getGallery,
  saveGalleryItem,
  deleteGalleryItem,
  seedInitialData,
  uploadImageFile,
  getSponsorCategories,
  saveSponsorCategory,
  deleteSponsorCategory,
  getTeamSections,
  saveTeamSection,
  deleteTeamSection,
} from "@/lib/datastore";
import { EventType } from "@/pages/Events";
import { Member } from "@/pages/Team";

const Dashboard = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"events" | "sponsors" | "team" | "gallery">("events");

  // State arrays for list displays
  const [eventsList, setEventsList] = useState<EventType[]>([]);
  const [sponsorsList, setSponsorsList] = useState<any[]>([]);
  const [teamList, setTeamList] = useState<any[]>([]);
  const [galleryList, setGalleryList] = useState<any[]>([]);

  // Load States
  const [dbLoading, setDbLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Load all datastores on mount
  const refreshAllData = async () => {
    setDbLoading(true);
    try {
      const evs = await getEvents();
      const sps = await getSponsors();
      const tm = await getTeam();
      const gal = await getGallery();
      setEventsList(evs);
      setSponsorsList(sps);
      setTeamList(tm);
      setGalleryList(gal);
    } catch (e) {
      toast.error("Failed to sync database snapshots.");
    } finally {
      setDbLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Session closed.");
      navigate("/");
    } catch (e) {
      toast.error("Logout failed.");
    }
  };

  const handleRefreshCache = async () => {
    localStorage.removeItem("ignitia_events");
    localStorage.removeItem("ignitia_sponsors");
    localStorage.removeItem("ignitia_team");
    localStorage.removeItem("ignitia_gallery");
    toast.success("Local cache cleared! Syncing latest data from Supabase & Cloudinary...");
    await refreshAllData();
  };

  const handleSeed = async () => {
    const confirmSeed = window.confirm(
      "WARNING: This will reset the database completely to the hardcoded backups. This should only be used during fallback situations. Are you sure you want to proceed?"
    );
    if (!confirmSeed) return;

    const password = window.prompt("Enter Seed Authorization Password:");
    if (password === null) return; // User cancelled
    
    setActionLoading(true);
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (isSupabaseEnabled && supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          headers["Authorization"] = `Bearer ${session.access_token}`;
        }
      }

      const res = await fetch("/api/verify-seed", {
        method: "POST",
        body: JSON.stringify({ password }),
        headers,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Seeding authorization failed");
      }

      await seedInitialData();
      toast.success("Database seeded successfully with dynamic backups!");
      await refreshAllData();
    } catch (e: any) {
      toast.error(e.message || "Database seeding failed.");
    } finally {
      setActionLoading(false);
    }
  };

  // Image upload validator
  const validateAndUploadImage = async (file: File, folder: string): Promise<string> => {
    const validExtensions = ["jpg", "jpeg", "png"];
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "";
    
    if (!validExtensions.includes(fileExt)) {
      throw new Error("Invalid file format. Only JPG, JPEG, and PNG are permitted.");
    }
    
    if (!isSupabaseEnabled) {
      // Offline fallback: convert to base64 for preview storage
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    return await uploadImageFile(file, folder);
  };

  return (
    <div className="min-h-screen bg-[#050406] text-foreground font-sans flex flex-col md:flex-row" style={{ isolation: "isolate", position: "relative", zIndex: 10 }}>
      {/* Solid background to block animated blobs from bleeding through */}
      <div className="fixed inset-0 bg-[#050406] -z-10 pointer-events-none" />

      {/* Sidebar Panel */}
      <aside className="w-full md:w-64 shrink-0 bg-[#070609] border-b md:border-b-0 md:border-r border-white/10 p-6 flex flex-col gap-8 md:sticky md:top-0 md:h-screen">

        <div>
          <h1 className="font-heading font-black text-xl tracking-wider text-white uppercase flex items-center gap-2">
            <Zap className="text-primary w-5 h-5 animate-pulse" />
            IGNITIA '26
          </h1>
          <p className="font-mono text-[9px] text-white/40 uppercase tracking-widest mt-1">
            CONTROL PANEL v2.0
          </p>
        </div>

        {/* Admin context bar */}
        <div className="p-3 bg-[#111015] border border-white/5 rounded-lg">
          <p className="font-mono text-[8px] uppercase tracking-wider text-white/30">Active Operator</p>
          <p className="font-mono text-xs text-white/80 truncate mt-0.5">{currentUser?.email || "Fallback Mode"}</p>
          {!isSupabaseEnabled && (
            <span className="inline-block mt-2 font-mono text-[8px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1.5 py-0.5 rounded uppercase">
              Offline Cache Mode
            </span>
          )}
        </div>

        {/* Panel Tabs list */}
        <nav className="flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible pb-3 md:pb-0">
          {[
            { id: "events", label: "Manage Events", icon: Calendar },
            { id: "sponsors", label: "Manage Sponsors", icon: Award },
            { id: "team", label: "Manage Team", icon: Users },
            { id: "gallery", label: "Manage Gallery", icon: ImageIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  active
                    ? "bg-primary/10 border border-primary/30 text-white shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                    : "border border-transparent text-white/40 hover:text-white/80 hover:bg-white/5"
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Buttons */}
        <div className="mt-auto pt-6 border-t border-white/10 flex flex-col gap-3">
          <button
            onClick={handleRefreshCache}
            disabled={dbLoading}
            className="flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary border border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary/10 py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw size={11} className={dbLoading ? "animate-spin" : ""} />
            Sync Database Cache
          </button>

          <button
            onClick={handleSeed}
            disabled={actionLoading}
            className="flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-widest text-amber-500 border border-amber-500/30 hover:border-amber-500 bg-amber-500/5 hover:bg-amber-500/10 py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw size={11} className={actionLoading ? "animate-spin" : ""} />
            Seed Database
          </button>
          
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-widest text-red-400 border border-red-500/30 hover:border-red-400 bg-red-500/5 hover:bg-red-500/10 py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut size={11} />
            Close Session
          </button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <main className="flex-1 p-6 md:p-10 bg-[#050406]/95 overflow-y-auto relative" style={{ minHeight: "100vh", maxHeight: "100vh" }}>


        {dbLoading ? (
          <div className="absolute inset-0 bg-[#050406]/80 flex items-center justify-center z-50">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : null}

        {activeTab === "events" && (
          <EventsPanel
            events={eventsList}
            onUpdate={refreshAllData}
            validateAndUploadImage={validateAndUploadImage}
          />
        )}
        {activeTab === "sponsors" && (
          <SponsorsPanel
            sponsors={sponsorsList}
            onUpdate={refreshAllData}
            validateAndUploadImage={validateAndUploadImage}
          />
        )}
        {activeTab === "team" && (
          <TeamPanel
            team={teamList}
            onUpdate={refreshAllData}
            validateAndUploadImage={validateAndUploadImage}
          />
        )}
        {activeTab === "gallery" && (
          <GalleryPanel
            gallery={galleryList}
            onUpdate={refreshAllData}
            validateAndUploadImage={validateAndUploadImage}
          />
        )}
      </main>
    </div>
  );
};

// Loader Icon
const Loader2 = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={`animate-spin ${className}`}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" className="opacity-20" />
    <path d="M12 2 C 6.48 2 2 6.48 2 12" stroke="currentColor" strokeWidth="2.5" />
  </svg>
);

// ─── 1. EVENTS PANEL SUB-COMPONENT ──────────────────────────────────────────
const EventsPanel = ({
  events,
  onUpdate,
  validateAndUploadImage,
}: {
  events: EventType[];
  onUpdate: () => void;
  validateAndUploadImage: (file: File, folder: string) => Promise<string>;
}) => {
  const [form, setForm] = useState<Partial<EventType>>({
    id: "",
    title: "",
    category: "TECHNICAL",
    prize: "",
    teamSize: "Solo",
    duration: "",
    day: "",
    entryFee: "Free",
    theme: "orange",
    rulebookUrl: "",
    registrationUrl: "",
    isWide: false,
    leftPoolLayout: false,
    arrowTop: false,
    isTopEvent: false,
    watermark: "",
    description: "",
    overview: "",
    rules: [],
    criteria: [],
    contacts: [],
    icon: "Zap", // string representing key
  });

  const [ruleInput, setRuleInput] = useState("");
  const [criteriaInput, setCriteriaInput] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id || !form.title) {
      toast.error("Event ID and Title are required.");
      return;
    }
    setUploading(true);
    try {
      let finalCover = (form as any).coverPhotoUrl || "";
      if (coverFile) {
        finalCover = await validateAndUploadImage(coverFile, "event_covers");
      }
      
      const payload: EventType = {
        ...(form as any),
        coverPhotoUrl: finalCover,
      };
      
      await saveEvent(payload);
      toast.success("Upload successful: Event card saved successfully.");
      setForm({
        id: "",
        title: "",
        category: "TECHNICAL",
        prize: "",
        teamSize: "Solo",
        duration: "",
        day: "",
        entryFee: "Free",
        theme: "orange",
        rulebookUrl: "",
        registrationUrl: "",
        isWide: false,
        leftPoolLayout: false,
        arrowTop: false,
        isTopEvent: false,
        watermark: "",
        description: "",
        overview: "",
        rules: [],
        criteria: [],
        contacts: [],
        icon: "Zap",
      });
      setCoverFile(null);
      onUpdate();
    } catch (err: any) {
      toast.error(err.message || "Failed to save event.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this event? This action is irreversible.")) {
      try {
        await deleteEvent(id);
        toast.success("Event deleted.");
        onUpdate();
      } catch (e) {
        toast.error("Failed to delete event.");
      }
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-heading font-black text-2xl tracking-wide text-white uppercase">Event Console</h2>
        <p className="font-mono text-xs text-white/40 uppercase mt-0.5">Add, Edit, and Remove Hackathon Track Cards</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Google-form styled input container */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6 bg-[#0c0b10] border border-white/5 p-6 md:p-8 rounded-xl relative">
          <h3 className="font-heading font-bold text-lg text-white uppercase mb-4">Event Data Template</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-xs">
            <div className="space-y-1">
              <label className="text-white/40 block">Event Slug ID (Unique, e.g. "blind-coding")</label>
              <input
                type="text"
                required
                value={form.id}
                onChange={(e) => setForm({ ...form, id: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                className="w-full bg-[#111015] border border-white/10 p-3 rounded-lg text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-white/40 block">Event Title</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-[#111015] border border-white/10 p-3 rounded-lg text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-white/40 block">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-[#111015] border border-white/10 p-3 rounded-lg text-white"
              >
              {["TECHNICAL", "NON-TECH", "GAMING", "ROBOTICS"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-white/40 block">Prize Pool (e.g. ₹10,000)</label>
              <input
                type="text"
                value={form.prize || ""}
                onChange={(e) => setForm({ ...form, prize: e.target.value })}
                className="w-full bg-[#111015] border border-white/10 p-3 rounded-lg text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-white/40 block">Team Size (e.g. Solo, 1-4, 5)</label>
              <input
                type="text"
                value={form.teamSize || ""}
                onChange={(e) => setForm({ ...form, teamSize: e.target.value })}
                className="w-full bg-[#111015] border border-white/10 p-3 rounded-lg text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-white/40 block">Duration (e.g. 3 Hours, 24 Hours)</label>
              <input
                type="text"
                value={form.duration || ""}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="w-full bg-[#111015] border border-white/10 p-3 rounded-lg text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-white/40 block">Schedule Day (e.g. Day 1, Aug 2)</label>
              <input
                type="text"
                value={form.day || ""}
                onChange={(e) => setForm({ ...form, day: e.target.value })}
                className="w-full bg-[#111015] border border-white/10 p-3 rounded-lg text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-white/40 block">Entry Fee (e.g. Free, ₹100)</label>
              <input
                type="text"
                value={form.entryFee || ""}
                onChange={(e) => setForm({ ...form, entryFee: e.target.value })}
                className="w-full bg-[#111015] border border-white/10 p-3 rounded-lg text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-white/40 block">Theme Color (Frontend Accent)</label>
              <select
                value={form.theme}
                onChange={(e) => setForm({ ...form, theme: e.target.value as any })}
                className="w-full bg-[#111015] border border-white/10 p-3 rounded-lg text-white"
              >
                {["orange", "purple", "purple", "yellow", "pink", "blue"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-white/40 block">Lucide Icon name (e.g. Zap, Gamepad2, Swords)</label>
              <select
                value={form.icon || "Zap"}
                onChange={(e) => setForm({ ...form, icon: e.target.value as any })}
                className="w-full bg-[#111015] border border-white/10 p-3 rounded-lg text-white"
              >
                {["Zap", "Code", "Brain", "Gamepad2", "HelpCircle", "MessageSquare", "Palette", "Swords", "Sparkles"].map((icon) => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-white/40 block">Watermark label (e.g. 01, 02)</label>
              <input
                type="text"
                value={form.watermark || ""}
                onChange={(e) => setForm({ ...form, watermark: e.target.value })}
                className="w-full bg-[#111015] border border-white/10 p-3 rounded-lg text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-white/40 block">Rulebook URL</label>
              <input
                type="text"
                value={form.rulebookUrl || ""}
                onChange={(e) => setForm({ ...form, rulebookUrl: e.target.value })}
                className="w-full bg-[#111015] border border-white/10 p-3 rounded-lg text-white"
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-white/40 block">Registration Portal Link</label>
              <input
                type="text"
                value={form.registrationUrl || ""}
                onChange={(e) => setForm({ ...form, registrationUrl: e.target.value })}
                className="w-full bg-[#111015] border border-white/10 p-3 rounded-lg text-white"
              />
            </div>

            {/* Picture Asset */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-white/40 block">Top Cover Photo (Only JPG/JPEG/PNG)</label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,image/png,image/jpeg"
                  onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="event-cover-file"
                />
                <label
                  htmlFor="event-cover-file"
                  className="flex items-center justify-center gap-2 border border-white/10 hover:border-primary/50 bg-[#111015] p-3 rounded-lg text-white cursor-pointer select-none transition-colors font-mono text-xs uppercase"
                >
                  <Upload size={14} />
                  Choose File
                </label>
                <span className="text-white/40 truncate text-[11px]">
                  {coverFile ? coverFile.name : (form as any).coverPhotoUrl ? "Loaded: Existing URL" : "No File Chosen"}
                </span>
              </div>
            </div>

            {/* Layout Checks */}
            <div className="space-y-2 md:col-span-2 flex flex-wrap gap-x-6 gap-y-2 pt-2">
              {[
                { key: "isWide", label: "Wide Card Layout" },
                { key: "leftPoolLayout", label: "Left Alignment" },
                { key: "arrowTop", label: "Top-pointing Chevron" },
                { key: "isTopEvent", label: "Top Featured Track" },
              ].map((c) => (
                <label key={c.key} className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={!!(form as any)[c.key]}
                    onChange={(e) => setForm({ ...form, [c.key]: e.target.checked })}
                    className="accent-primary w-4 h-4 rounded cursor-pointer"
                  />
                  <span>{c.label}</span>
                </label>
              ))}
            </div>

            <div className="space-y-1 md:col-span-2 pt-2">
              <label className="text-white/40 block">Short Tagline</label>
              <input
                type="text"
                value={form.description || ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full bg-[#111015] border border-white/10 p-3 rounded-lg text-white"
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-white/40 block">Detailed Overview Summary</label>
              <textarea
                value={form.overview || ""}
                onChange={(e) => setForm({ ...form, overview: e.target.value })}
                className="w-full bg-[#111015] border border-white/10 p-3 rounded-lg text-white h-24 resize-none"
              />
            </div>

            {/* Rules Array Handler */}
            <div className="space-y-3 md:col-span-2 pt-4 border-t border-white/5">
              <label className="text-white/40 block">Dynamic Event Rules</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="rule description..."
                  value={ruleInput}
                  onChange={(e) => setRuleInput(e.target.value)}
                  className="flex-1 bg-[#111015] border border-white/10 p-3 rounded-lg text-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (ruleInput) {
                      setForm({ ...form, rules: [...(form.rules || []), ruleInput] });
                      setRuleInput("");
                    }
                  }}
                  className="bg-primary/20 hover:bg-primary/30 text-white font-mono uppercase px-4 rounded-lg cursor-pointer"
                >
                  Add
                </button>
              </div>
              <ul className="space-y-1.5 pt-2">
                {form.rules?.map((rule, idx) => (
                  <li key={idx} className="flex justify-between items-center bg-[#111015] p-2.5 rounded border border-white/5 text-white/80">
                    <span className="truncate flex-1 pr-4">{rule}</span>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, rules: form.rules?.filter((_, i) => i !== idx) })}
                      className="text-red-400 hover:text-red-500 font-mono text-[10px] cursor-pointer"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Criteria Array Handler */}
            <div className="space-y-3 md:col-span-2 pt-4 border-t border-white/5">
              <label className="text-white/40 block">Judging Criteria</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="criteria description..."
                  value={criteriaInput}
                  onChange={(e) => setCriteriaInput(e.target.value)}
                  className="flex-1 bg-[#111015] border border-white/10 p-3 rounded-lg text-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (criteriaInput) {
                      setForm({ ...form, criteria: [...(form.criteria || []), criteriaInput] });
                      setCriteriaInput("");
                    }
                  }}
                  className="bg-primary/20 hover:bg-primary/30 text-white font-mono uppercase px-4 rounded-lg cursor-pointer"
                >
                  Add
                </button>
              </div>
              <ul className="space-y-1.5 pt-2">
                {form.criteria?.map((cr, idx) => (
                  <li key={idx} className="flex justify-between items-center bg-[#111015] p-2.5 rounded border border-white/5 text-white/80">
                    <span className="truncate flex-1 pr-4">{cr}</span>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, criteria: form.criteria?.filter((_, i) => i !== idx) })}
                      className="text-red-400 hover:text-red-500 font-mono text-[10px] cursor-pointer"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contacts Array Handler */}
            <div className="space-y-3 md:col-span-2 pt-4 border-t border-white/5">
              <label className="text-white/40 block">Event Organiser Contacts</label>
              <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                <input
                  type="text"
                  placeholder="name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full sm:w-1/2 bg-[#111015] border border-white/10 p-3 rounded-lg text-white"
                />
                <input
                  type="text"
                  placeholder="phone"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full sm:w-1/2 bg-[#111015] border border-white/10 p-3 rounded-lg text-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (contactName && contactPhone) {
                      setForm({ ...form, contacts: [...(form.contacts || []), { name: contactName, phone: contactPhone }] });
                      setContactName("");
                      setContactPhone("");
                    }
                  }}
                  className="w-full sm:w-auto bg-primary/20 hover:bg-primary/30 text-white font-mono uppercase px-4 py-3 rounded-lg cursor-pointer"
                >
                  Add
                </button>
              </div>
              <ul className="space-y-1.5 pt-2">
                {form.contacts?.map((c, idx) => (
                  <li key={idx} className="flex justify-between items-center bg-[#111015] p-2.5 rounded border border-white/5 text-white/80">
                    <span>{c.name} — {c.phone}</span>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, contacts: form.contacts?.filter((_, i) => i !== idx) })}
                      className="text-red-400 hover:text-red-500 font-mono text-[10px] cursor-pointer"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="glow-button w-full !py-3 inline-flex items-center justify-center gap-2 cursor-pointer font-heading font-black tracking-wider text-sm mt-4"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 text-white animate-spin" />
                Processing Template...
              </>
            ) : (
              "Publish Event Card"
            )}
          </button>
        </form>

        {/* Existing events grid list */}
        <div className="space-y-4">
          <h3 className="font-heading font-bold text-lg text-white uppercase mb-2">Deployed Tracks</h3>
          <div className="space-y-3.5">
            {events.map((e) => (
              <div key={e.id} className="bg-[#0c0b10] border border-white/5 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-bold text-sm text-white uppercase">{e.title}</h4>
                  <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest">{e.category}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setForm({ ...e })}
                    className="p-2 border border-white/10 hover:border-primary/40 bg-white/[0.02] text-white/70 hover:text-white rounded cursor-pointer transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(e.id)}
                    className="p-2 border border-red-500/20 hover:border-red-500/50 bg-red-500/5 text-red-400 hover:text-red-500 rounded cursor-pointer transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── 2. SPONSORS PANEL SUB-COMPONENT ────────────────────────────────────────
const SponsorsPanel = ({
  sponsors,
  onUpdate,
  validateAndUploadImage,
}: {
  sponsors: any[];
  onUpdate: () => void;
  validateAndUploadImage: (file: File, folder: string) => Promise<string>;
}) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  // Dynamic category editor states
  const [categoriesList, setCategoriesList] = useState<{ key: string; title: string; accent?: string; priority?: number }[]>([]);
  const [newCatKey, setNewCatKey] = useState("");
  const [newCatTitle, setNewCatTitle] = useState("");
  const [newCatAccent, setNewCatAccent] = useState("from-amber-500 to-yellow-400");
  const [editingCatKey, setEditingCatKey] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDrop = async (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    const reordered = [...categoriesList];
    const [draggedItem] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, draggedItem);
    
    const updated = reordered.map((item, i) => ({
      ...item,
      priority: i,
    }));
    
    setCategoriesList(updated);
    setDraggedIndex(null);

    for (const cat of updated) {
      await saveSponsorCategory(cat);
    }
    onUpdate();
  };

  const fetchCategories = async () => {
    const list = await getSponsorCategories();
    setCategoriesList(list);
    if (list.length > 0 && !category) {
      setCategory(list[0].key);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !logoFile) {
      toast.error("Sponsor Name and Logo file are required.");
      return;
    }
    setSaving(true);
    try {
      const url = await validateAndUploadImage(logoFile, "sponsor_logos");
      await saveSponsor({ name, logo: url, category: category || "gold" });
      toast.success("Upload successful: Sponsor card added successfully.");
      setName("");
      setLogoFile(null);
      onUpdate();
    } catch (err: any) {
      toast.error(err.message || "Failed to save sponsor.");
    } finally {
      setSaving(false);
    }
  };

  const handleShift = async (id: string, newCat: string) => {
    try {
      await updateSponsorCategory(id, newCat);
      toast.success("Sponsor relocated.");
      onUpdate();
    } catch (e) {
      toast.error("Relocation failed.");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this sponsor logotype?")) {
      try {
        await deleteSponsor(id);
        toast.success("Sponsor removed.");
        onUpdate();
      } catch (e) {
        toast.error("Failed to delete sponsor.");
      }
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-heading font-black text-2xl tracking-wide text-white uppercase">Sponsors Panel</h2>
        <p className="font-mono text-xs text-white/40 uppercase mt-0.5">Manage Platform Partners, Brand Logos, and Tiers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left column forms */}
        <div className="space-y-8 lg:col-span-1">
          {/* Form uploader */}
          <form onSubmit={handleSubmit} className="space-y-6 bg-[#0c0b10] border border-white/5 p-6 rounded-xl relative h-fit font-mono text-xs">
            <h3 className="font-heading font-bold text-lg text-white uppercase mb-2">New Sponsor Entry</h3>

            <div className="space-y-1">
              <label className="text-white/40 block">Sponsor Brand Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#111015] border border-white/10 p-3 rounded-lg text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-white/40 block">Assign Row Tier</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#111015] border border-white/10 p-3 rounded-lg text-white"
              >
                {categoriesList.map((c) => (
                  <option key={c.key} value={c.key}>{c.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-white/40 block">Logo Image (Only JPG/JPEG/PNG)</label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,image/png,image/jpeg"
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="sponsor-logo-file"
                />
                <label
                  htmlFor="sponsor-logo-file"
                  className="flex items-center justify-center gap-2 border border-white/10 hover:border-primary/50 bg-[#111015] p-3 rounded-lg text-white cursor-pointer select-none transition-colors"
                >
                  <Upload size={14} />
                  Upload Logo
                </label>
                <span className="text-white/40 truncate text-[11px] max-w-[120px]">
                  {logoFile ? logoFile.name : "No File Chosen"}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="glow-button w-full !py-3 inline-flex items-center justify-center gap-2 cursor-pointer font-heading font-black tracking-wider text-xs"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                  Uploading Assets...
                </>
              ) : (
                "Deploy Sponsor Logo"
              )}
            </button>
          </form>

          {/* Dynamic Categories Editor */}
          <div className="space-y-6 bg-[#0c0b10] border border-white/5 p-6 rounded-xl relative h-fit font-mono text-xs">
            <h3 className="font-heading font-bold text-lg text-white uppercase mb-2">Manage Sponsor Tiers</h3>
            
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {categoriesList.map((cat, idx) => (
                <div 
                  key={cat.key} 
                  draggable
                  onDragStart={() => setDraggedIndex(idx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(idx)}
                  className={`flex justify-between items-center bg-[#111015] p-2.5 rounded border border-white/5 text-white/80 cursor-grab active:cursor-grabbing hover:bg-[#15141b] transition-colors ${draggedIndex === idx ? "opacity-30 border-dashed border-primary" : ""}`}
                >
                  <div className="truncate pr-2 flex items-center gap-2">
                    <span className="text-white/20 select-none text-xs">☰</span>
                    <div className="truncate">
                      <span className="font-bold block truncate">{cat.title}</span>
                      <span className="block text-[9px] text-white/40 uppercase tracking-widest mt-0.5">Key: {cat.key}</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCatKey(cat.key);
                        setNewCatKey(cat.key);
                        setNewCatTitle(cat.title);
                        setNewCatAccent(cat.accent || "from-amber-500 to-yellow-400");
                      }}
                      className="text-primary hover:text-primary-foreground font-bold px-1.5 py-0.5 rounded border border-primary/20 bg-primary/5 cursor-pointer text-[9px] uppercase"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        if (window.confirm(`Are you sure you want to delete the "${cat.title}" tier? This does not delete the sponsors in it; they will need to be re-assigned.`)) {
                          await deleteSponsorCategory(cat.key);
                          toast.success("Category deleted.");
                          fetchCategories();
                        }
                      }}
                      className="text-red-400 hover:text-red-500 font-bold px-1.5 py-0.5 rounded border border-red-500/20 bg-red-500/5 cursor-pointer text-[9px] uppercase"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/5 pt-4 space-y-3">
              <h4 className="font-bold text-white/80 uppercase">{editingCatKey ? "Edit Tier" : "Create New Tier"}</h4>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-white/40 block text-[9px]">Tier Key</label>
                  <input
                    type="text"
                    placeholder="e.g. platinum"
                    value={newCatKey}
                    onChange={(e) => setNewCatKey(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                    disabled={!!editingCatKey}
                    className="w-full bg-[#111015] border border-white/10 p-2.5 rounded text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-white/40 block text-[9px]">Display Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Platinum Sponsors"
                    value={newCatTitle}
                    onChange={(e) => setNewCatTitle(e.target.value)}
                    className="w-full bg-[#111015] border border-white/10 p-2.5 rounded text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-white/40 block text-[9px]">Gradients Class</label>
                <input
                  type="text"
                  placeholder="e.g. from-purple-500 to-indigo-500"
                  value={newCatAccent}
                  onChange={(e) => setNewCatAccent(e.target.value)}
                  className="w-full bg-[#111015] border border-white/10 p-2.5 rounded text-white font-mono"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={async () => {
                    if (!newCatKey || !newCatTitle) {
                      toast.error("Key and Display Title are required.");
                      return;
                    }
                    await saveSponsorCategory({
                      key: newCatKey,
                      title: newCatTitle,
                      accent: newCatAccent
                    });
                    toast.success(editingCatKey ? "Category tier updated." : "New tier created.");
                    setNewCatKey("");
                    setNewCatTitle("");
                    setNewCatAccent("from-amber-500 to-yellow-400");
                    setEditingCatKey(null);
                    fetchCategories();
                  }}
                  className="flex-1 bg-primary/20 hover:bg-primary/30 text-white font-mono uppercase px-3 py-2 rounded-lg cursor-pointer text-center font-bold"
                >
                  {editingCatKey ? "Save Changes" : "Save Tier"}
                </button>
                {editingCatKey && (
                  <button
                    type="button"
                    onClick={() => {
                      setNewCatKey("");
                      setNewCatTitle("");
                      setNewCatAccent("from-amber-500 to-yellow-400");
                      setEditingCatKey(null);
                    }}
                    className="bg-white/5 hover:bg-white/10 text-white/60 px-3 py-2 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Existing sponsors and Shifting Actions */}
        <div className="lg:col-span-2 space-y-8">
          {categoriesList.map((cat) => {
            const list = sponsors.filter((s) => s.category === cat.key);
            return (
              <div key={cat.key} className="space-y-4">
                <h3 className="font-heading font-bold text-sm text-amber-500 uppercase tracking-widest border-b border-white/5 pb-2">
                  {cat.title} ({list.length})
                </h3>
                {list.length === 0 ? (
                  <p className="text-white/20 font-mono text-[10px] uppercase">No partners deployed in this tier.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {list.map((s, idx) => {
                      const idVal = s.id || s.name;
                      return (
                        <div key={idx} className="bg-[#0c0b10] border border-white/5 p-4 rounded-xl flex items-center justify-between gap-4 font-mono text-xs">
                          <div className="flex items-center gap-3 truncate">
                            <img src={s.logo} alt={s.name} className="w-10 h-10 object-contain rounded bg-white/5 p-1 shrink-0" />
                            <span className="text-white truncate font-bold">{s.name}</span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {/* Shifting Dropdown */}
                            <select
                              value={s.category}
                              onChange={(e) => handleShift(idVal, e.target.value)}
                              className="bg-[#111015] border border-white/10 px-2.5 py-1.5 rounded text-white text-[10px]"
                              title="Shift Category Section"
                            >
                              {categoriesList.map((c) => (
                                <option key={c.key} value={c.key}>{c.key.toUpperCase()}</option>
                              ))}
                            </select>

                            <button
                              onClick={() => handleDelete(idVal)}
                              className="p-1.5 border border-red-500/20 hover:border-red-500/50 bg-red-500/5 text-red-400 hover:text-red-500 rounded cursor-pointer transition-colors"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── 3. TEAM PANEL SUB-COMPONENT ───────────────────────────────────────────
const TeamPanel = ({
  team,
  onUpdate,
  validateAndUploadImage,
}: {
  team: any[];
  onUpdate: () => void;
  validateAndUploadImage: (file: File, folder: string) => Promise<string>;
}) => {
  const [form, setForm] = useState<Partial<Member & { section: string; id?: string }>>({
    id: "",
    name: "",
    role: "",
    initials: "",
    linkedin: "#",
    instagram: "#",
    department: "",
    bio: "",
    expertise: [],
    section: "",
  });

  const [expInput, setExpInput] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  // Dynamic section editor states
  const [sectionsListState, setSectionsListState] = useState<{ key: string; title: string; theme?: string; colorHsl?: string; priority?: number }[]>([]);
  const [newSecKey, setNewSecKey] = useState("");
  const [newSecTitle, setNewSecTitle] = useState("");
  const [newSecTheme, setNewSecTheme] = useState("purple");
  const [newSecColorHsl, setNewSecColorHsl] = useState("270 70% 60%");
  const [editingSecKey, setEditingSecKey] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDrop = async (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    const reordered = [...sectionsListState];
    const [draggedItem] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, draggedItem);
    
    const updated = reordered.map((item, i) => ({
      ...item,
      priority: i,
    }));
    
    setSectionsListState(updated);
    setDraggedIndex(null);

    for (const sec of updated) {
      await saveTeamSection(sec);
    }
    onUpdate();
  };

  const fetchSections = async () => {
    const list = await getTeamSections();
    setSectionsListState(list);
    if (list.length > 0 && !form.section) {
      setForm((prev) => ({ ...prev, section: list[0].key }));
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      toast.error("Full Name is required to create a member card.");
      return;
    }
    setSaving(true);
    try {
      let finalPhoto = (form as any).photoUrl || "";
      if (photoFile) {
        finalPhoto = await validateAndUploadImage(photoFile, "team_photos");
      }
      
      const payload = {
        ...form,
        section: form.section || (sectionsListState[0]?.key || "leads"),
        photoUrl: finalPhoto,
        initials: form.initials || form.name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2),
      } as any;
      
      await saveTeamMember(payload);
      toast.success("Upload successful: Team member card saved successfully.");
      setForm({
        id: "",
        name: "",
        role: "",
        initials: "",
        linkedin: "#",
        instagram: "#",
        department: "",
        bio: "",
        expertise: [],
        section: sectionsListState[0]?.key || "leads",
      });
      setPhotoFile(null);
      onUpdate();
    } catch (err: any) {
      toast.error(err.message || "Failed to save team member.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Remove this member profile from the army?")) {
      try {
        await deleteTeamMember(id);
        toast.success("Army member removed.");
        onUpdate();
      } catch (e) {
        toast.error("Failed to delete team member.");
      }
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-heading font-black text-2xl tracking-wide text-white uppercase">Team Operator</h2>
        <p className="font-mono text-xs text-white/40 uppercase mt-0.5">Manage Core Leadership, Organizers, and Domain structures</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left column forms */}
        <div className="space-y-8 lg:col-span-1">
          {/* Form container */}
          <form onSubmit={handleSubmit} className="space-y-5 bg-[#0c0b10] border border-white/5 p-6 rounded-xl relative h-fit font-mono text-xs">
            <h3 className="font-heading font-bold text-lg text-white uppercase mb-2">Army Member Profile</h3>

            <div className="space-y-1">
              <label className="text-white/40 block">Full Name <span className="text-primary/70">*</span></label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Snehashish Das"
                className="w-full bg-[#111015] border border-white/10 p-3 rounded-lg text-white placeholder-white/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-white/40 block">Position / Role Label <span className="text-white/20 text-[9px] normal-case">(optional)</span></label>
              <input
                type="text"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="e.g. Lead Convenor"
                className="w-full bg-[#111015] border border-white/10 p-3 rounded-lg text-white placeholder-white/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-white/40 block">Initials (e.g. SD)</label>
                <input
                  type="text"
                  value={form.initials}
                  onChange={(e) => setForm({ ...form, initials: e.target.value.toUpperCase().substring(0, 2) })}
                  className="w-full bg-[#111015] border border-white/10 p-3 rounded-lg text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-white/40 block">Section Row</label>
                <select
                  value={form.section}
                  onChange={(e) => setForm({ ...form, section: e.target.value })}
                  className="w-full bg-[#111015] border border-white/10 p-3 rounded-lg text-white"
                >
                  {sectionsListState.map((s) => (
                    <option key={s.key} value={s.key}>{s.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-white/40 block">LinkedIn Profile Link</label>
              <input
                type="text"
                value={form.linkedin}
                onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                className="w-full bg-[#111015] border border-white/10 p-3 rounded-lg text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-white/40 block">Department / Team Area</label>
              <input
                type="text"
                value={form.department || ""}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className="w-full bg-[#111015] border border-white/10 p-3 rounded-lg text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-white/40 block">Profile Picture (Only JPG/JPEG/PNG)</label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,image/png,image/jpeg"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="team-photo-file"
                />
                <label
                  htmlFor="team-photo-file"
                  className="flex items-center justify-center gap-2 border border-white/10 hover:border-primary/50 bg-[#111015] p-3 rounded-lg text-white cursor-pointer select-none transition-colors"
                >
                  <Upload size={14} />
                  Upload Photo
                </label>
                <span className="text-white/40 truncate text-[11px] max-w-[120px]">
                  {photoFile ? photoFile.name : (form as any).photoUrl ? "Loaded: Existing URL" : "No File Chosen"}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-white/40 block">Profile Bio Summary</label>
              <textarea
                value={form.bio || ""}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="w-full bg-[#111015] border border-white/10 p-3 rounded-lg text-white h-20 resize-none"
              />
            </div>

            {/* Dynamic Expertise list */}
            <div className="space-y-3 pt-2 border-t border-white/5">
              <label className="text-white/40 block">Expertise Skills</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="expertise..."
                  value={expInput}
                  onChange={(e) => setExpInput(e.target.value)}
                  className="flex-1 bg-[#111015] border border-white/10 p-2.5 rounded-lg text-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (expInput) {
                      setForm({ ...form, expertise: [...(form.expertise || []), expInput] });
                      setExpInput("");
                    }
                  }}
                  className="bg-primary/20 hover:bg-primary/30 text-white px-3 rounded-lg cursor-pointer font-bold"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {form.expertise?.map((exp, idx) => (
                  <span
                    key={idx}
                    className="bg-[#111015] border border-white/5 px-2 py-0.5 rounded text-[10px] text-white flex items-center gap-1.5"
                  >
                    {exp}
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, expertise: form.expertise?.filter((_, i) => i !== idx) })}
                      className="text-red-400 font-bold hover:text-red-500 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="glow-button w-full !py-3 inline-flex items-center justify-center gap-2 cursor-pointer font-heading font-black tracking-wider text-xs"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                  Processing data...
                </>
              ) : (
                "Deploy Member Card"
              )}
            </button>
          </form>

          {/* Manage Sections Section */}
          <div className="space-y-6 bg-[#0c0b10] border border-white/5 p-6 rounded-xl relative h-fit font-mono text-xs">
            <h3 className="font-heading font-bold text-lg text-white uppercase mb-2">Manage Team Sections</h3>
            
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {sectionsListState.map((sec, idx) => (
                <div 
                  key={sec.key} 
                  draggable
                  onDragStart={() => setDraggedIndex(idx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(idx)}
                  className={`flex justify-between items-center bg-[#111015] p-2.5 rounded border border-white/5 text-white/80 cursor-grab active:cursor-grabbing hover:bg-[#15141b] transition-colors ${draggedIndex === idx ? "opacity-30 border-dashed border-primary" : ""}`}
                >
                  <div className="truncate pr-2 flex items-center gap-2">
                    <span className="text-white/20 select-none text-xs">☰</span>
                    <div className="truncate">
                      <span className="font-bold block truncate">{sec.title}</span>
                      <span className="block text-[9px] text-white/40 uppercase tracking-widest mt-0.5">Key: {sec.key}</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSecKey(sec.key);
                        setNewSecKey(sec.key);
                        setNewSecTitle(sec.title);
                        setNewSecTheme(sec.theme || "purple");
                        setNewSecColorHsl(sec.colorHsl || "270 70% 60%");
                      }}
                      className="text-primary hover:text-primary-foreground font-bold px-1.5 py-0.5 rounded border border-primary/20 bg-primary/5 cursor-pointer text-[9px] uppercase"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        if (window.confirm(`Are you sure you want to delete the "${sec.title}" section? This does not delete member cards; they will need to be re-assigned.`)) {
                          await deleteTeamSection(sec.key);
                          toast.success("Section deleted.");
                          fetchSections();
                        }
                      }}
                      className="text-red-400 hover:text-red-500 font-bold px-1.5 py-0.5 rounded border border-red-500/20 bg-red-500/5 cursor-pointer text-[9px] uppercase"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/5 pt-4 space-y-3">
              <h4 className="font-bold text-white/80 uppercase">{editingSecKey ? "Edit Section" : "Create New Section"}</h4>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-white/40 block text-[9px]">Section Key</label>
                  <input
                    type="text"
                    placeholder="e.g. advisory"
                    value={newSecKey}
                    onChange={(e) => setNewSecKey(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                    disabled={!!editingSecKey}
                    className="w-full bg-[#111015] border border-white/10 p-2.5 rounded text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-white/40 block text-[9px]">Display Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Advisory Committee"
                    value={newSecTitle}
                    onChange={(e) => setNewSecTitle(e.target.value)}
                    className="w-full bg-[#111015] border border-white/10 p-2.5 rounded text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-white/40 block text-[9px]">Theme Color</label>
                  <select
                    value={newSecTheme}
                    onChange={(e) => setNewSecTheme(e.target.value)}
                    className="w-full bg-[#111015] border border-white/10 p-2.5 rounded text-white"
                  >
                    <option value="red">Red</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="purple">Purple</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-white/40 block text-[9px]">Glow HSL Value</label>
                  <input
                    type="text"
                    placeholder="e.g. 270 70% 60%"
                    value={newSecColorHsl}
                    onChange={(e) => setNewSecColorHsl(e.target.value)}
                    className="w-full bg-[#111015] border border-white/10 p-2.5 rounded text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={async () => {
                    if (!newSecKey || !newSecTitle) {
                      toast.error("Key and Display Title are required.");
                      return;
                    }
                    await saveTeamSection({
                      key: newSecKey,
                      title: newSecTitle,
                      theme: newSecTheme,
                      colorHsl: newSecColorHsl
                    });
                    toast.success(editingSecKey ? "Section updated." : "New section created.");
                    setNewSecKey("");
                    setNewSecTitle("");
                    setNewSecTheme("purple");
                    setNewSecColorHsl("270 70% 60%");
                    setEditingSecKey(null);
                    fetchSections();
                  }}
                  className="flex-1 bg-primary/20 hover:bg-primary/30 text-white font-mono uppercase px-3 py-2 rounded-lg cursor-pointer text-center font-bold"
                >
                  {editingSecKey ? "Save Changes" : "Save Section"}
                </button>
                {editingSecKey && (
                  <button
                    type="button"
                    onClick={() => {
                      setNewSecKey("");
                      setNewSecTitle("");
                      setNewSecTheme("purple");
                      setNewSecColorHsl("270 70% 60%");
                      setEditingSecKey(null);
                    }}
                    className="bg-white/5 hover:bg-white/10 text-white/60 px-3 py-2 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Existing team grid list */}
        <div className="lg:col-span-2 space-y-8">
          {sectionsListState.map((sec) => {
            const list = team.filter((m) => m.section === sec.key);
            return (
              <div key={sec.key} className="space-y-4">
                <h3 className="font-heading font-bold text-sm text-amber-500 uppercase tracking-widest border-b border-white/5 pb-2">
                  {sec.title} ({list.length})
                </h3>
                {list.length === 0 ? (
                  <p className="text-white/20 font-mono text-[10px] uppercase">No members deployed in this tier.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {list.map((m, idx) => {
                      const idVal = m.id || m.name;
                      return (
                        <div key={idx} className="bg-[#0c0b10] border border-white/5 p-4 rounded-xl flex items-center justify-between gap-4 font-mono text-xs">
                          <div className="flex items-center gap-3 truncate">
                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden font-bold">
                              {m.photoUrl ? (
                                <img src={m.photoUrl} alt={m.name} className="w-full h-full object-cover" />
                              ) : (
                                m.initials
                              )}
                            </div>
                            <div className="truncate">
                              <h4 className="text-white truncate font-bold">{m.name}</h4>
                              <p className="text-white/40 text-[10px] uppercase">{m.role}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setForm({ ...m })}
                              className="px-2.5 py-1.5 border border-white/10 hover:border-primary/40 bg-white/[0.02] text-white/70 hover:text-white rounded cursor-pointer transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(idVal)}
                              className="p-1.5 border border-red-500/20 hover:border-red-500/50 bg-red-500/5 text-red-400 hover:text-red-500 rounded cursor-pointer transition-colors"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── 4. GALLERY PANEL SUB-COMPONENT ─────────────────────────────────────────
const GalleryPanel = ({
  gallery,
  onUpdate,
  validateAndUploadImage,
}: {
  gallery: any[];
  onUpdate: () => void;
  validateAndUploadImage: (file: File, folder: string) => Promise<string>;
}) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Events");
  const [srcFile, setSrcFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [existingSrc, setExistingSrc] = useState<string | null>(null);
  const [existingPublicId, setExistingPublicId] = useState<string | null>(null);

  const categoriesList = ["Events", "Coding", "Gaming", "Cultural", "Robotics"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error("Picture Title is required.");
      return;
    }
    if (!editingId && !srcFile) {
      toast.error("Gallery Image file is required for new entries.");
      return;
    }
    setSaving(true);
    try {
      let finalSrc = existingSrc || "";
      let finalPublicId = existingPublicId || "";

      if (srcFile) {
        // Upload new image to Cloudinary
        const { uploadGalleryImage } = await import("@/lib/cloudinary");
        const { secure_url, public_id } = await uploadGalleryImage(srcFile);
        finalSrc = secure_url;

        // If in edit mode and there was a previous image, delete it from Cloudinary to reclaim space
        if (editingId && existingPublicId) {
          try {
            const { deleteGalleryImage } = await import("@/lib/cloudinary");
            await deleteGalleryImage(existingPublicId);
          } catch (delErr) {
            console.warn("Failed to delete old Cloudinary image:", delErr);
          }
        }
        finalPublicId = public_id;
      }

      await saveGalleryItem({
        id: editingId || undefined,
        title,
        category,
        src: finalSrc,
        public_id: finalPublicId,
      });

      toast.success(editingId ? "Gallery item updated successfully." : "Upload successful: Gallery item card published.");
      
      // Reset form states
      setTitle("");
      setSrcFile(null);
      setEditingId(null);
      setExistingSrc(null);
      setExistingPublicId(null);
      onUpdate();
    } catch (err: any) {
      toast.error(err.message || "Failed to save gallery item.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Remove this image from the gallery?")) {
      try {
        await deleteGalleryItem(id);
        toast.success("Image removed.");
        // If we were editing the deleted item, cancel editing
        if (editingId === id) {
          setTitle("");
          setSrcFile(null);
          setEditingId(null);
          setExistingSrc(null);
          setExistingPublicId(null);
        }
        onUpdate();
      } catch (e) {
        toast.error("Failed to delete gallery item.");
      }
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-heading font-black text-2xl tracking-wide text-white uppercase">Gallery Board</h2>
        <p className="font-mono text-xs text-white/40 uppercase mt-0.5">Manage circular sphere and explore grid memories</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Form container */}
        <form onSubmit={handleSubmit} className="space-y-5 bg-[#0c0b10] border border-white/5 p-6 rounded-xl relative h-fit font-mono text-xs">
          <h3 className="font-heading font-bold text-lg text-white uppercase mb-2">
            {editingId ? "Edit Memory Entry" : "Publish Picture"}
          </h3>

          <div className="space-y-1">
            <label className="text-white/40 block">Picture Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#111015] border border-white/10 p-3 rounded-lg text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-white/40 block">Album Section</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#111015] border border-white/10 p-3 rounded-lg text-white"
            >
              {categoriesList.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-white/40 block">Image File (Only JPG/JPEG/PNG)</label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept=".jpg,.jpeg,.png,image/png,image/jpeg"
                onChange={(e) => setSrcFile(e.target.files?.[0] || null)}
                className="hidden"
                id="gallery-src-file"
              />
              <label
                htmlFor="gallery-src-file"
                className="flex items-center justify-center gap-2 border border-white/10 hover:border-primary/50 bg-[#111015] p-3 rounded-lg text-white cursor-pointer select-none transition-colors"
              >
                <Upload size={14} />
                Select Image
              </label>
              <span className="text-white/40 truncate text-[11px] max-w-[120px]">
                {srcFile ? srcFile.name : (editingId ? "Keep current image" : "No File Chosen")}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="glow-button w-full !py-3 inline-flex items-center justify-center gap-2 cursor-pointer font-heading font-black tracking-wider text-xs uppercase"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 text-white animate-spin" />
                {editingId ? "Updating Memory..." : "Uploading Image..."}
              </>
            ) : (
              editingId ? "Update Memory" : "Publish Memory"
            )}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setTitle("");
                setSrcFile(null);
                setEditingId(null);
                setExistingSrc(null);
                setExistingPublicId(null);
              }}
              className="border border-white/10 hover:border-red-500/40 bg-white/[0.02] text-white/70 hover:text-white w-full py-2.5 rounded-lg cursor-pointer font-heading font-black tracking-wider text-xs uppercase transition-colors"
            >
              Cancel Edit
            </button>
          )}
        </form>

        {/* Existing gallery grid list */}
        <div className="lg:col-span-2 space-y-8">
          {categoriesList.map((cat) => {
            const list = gallery.filter((item) => item.category === cat);
            return (
              <div key={cat} className="space-y-4">
                <h3 className="font-heading font-bold text-sm text-amber-500 uppercase tracking-widest border-b border-white/5 pb-2">
                  {cat} ({list.length})
                </h3>
                {list.length === 0 ? (
                  <p className="text-white/20 font-mono text-[10px] uppercase">No memories deployed in this section.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {list.map((item, idx) => {
                      const idVal = item.id || item.title;
                      return (
                        <div key={idx} className="relative group/card overflow-hidden border border-white/5 rounded-xl bg-[#0c0b10] aspect-video">
                          <img src={item.src} alt={item.title} className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/card:opacity-100 flex flex-col justify-end p-3 transition-opacity duration-300 pointer-events-none">
                            <span className="font-mono text-[10px] text-white font-bold truncate block">{item.title}</span>
                          </div>
                          
                          {/* Top-right actions overlay */}
                          <div className="absolute top-2 right-2 flex gap-1.5 z-30">
                            <button
                              onClick={() => {
                                setTitle(item.title);
                                setCategory(item.category);
                                setEditingId(item.id);
                                setExistingSrc(item.src);
                                setExistingPublicId(item.public_id);
                              }}
                              className="p-1.5 bg-primary/80 hover:bg-primary text-white rounded cursor-pointer transition-colors"
                              title="Edit Picture"
                            >
                              <Pencil size={12} />
                            </button>
                            <button
                              onClick={() => handleDelete(idVal)}
                              className="p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded cursor-pointer transition-colors"
                              title="Delete Picture"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
