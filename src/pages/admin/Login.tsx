import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Lock, Mail, KeyRound, Loader2, ArrowLeft } from "lucide-react";
import { z } from "zod";
import ParticleField from "@/components/ParticleField";

// Zod login validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address format").max(100, "Email exceeds 100 characters"),
  password: z.string().min(6, "Password must be at least 6 characters").max(100, "Password exceeds 100 characters"),
});

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // 1. Zod input validation
      loginSchema.parse({ email, password });

      // 2. Auth Context Login
      await login(email, password);
      toast.success("Admin Authorization Granted.", {
        description: "Welcome back, Administrator.",
      });
      navigate("/admin/dashboard");
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setErrorMsg(err.errors[0].message);
        toast.error("Validation Failed", { description: err.errors[0].message });
      } else {
        const msg = err.message || "Failed to authenticate.";
        setErrorMsg(msg);
        toast.error("Access Denied", { description: msg });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 relative overflow-hidden select-none">
      <ParticleField />
      
      {/* Abstract background mesh glow */}
      <div className="absolute w-[400px] h-[400px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

      {/* Floating Back Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 font-mono text-xs text-white/40 hover:text-white/80 transition-colors p-2 border border-white/5 bg-black/40 rounded-lg cursor-pointer backdrop-blur"
      >
        <ArrowLeft size={14} />
        [ Return Home ]
      </button>

      {/* Login Card */}
      <div 
        className="relative w-full max-w-md border border-purple-500/25 bg-[#0b0a0e]/80 backdrop-blur-xl p-8 rounded-2xl shadow-[0_20px_50px_rgba(139,92,246,0.15)]"
        style={{
          boxShadow: `0 0 40px rgba(168, 85, 247, 0.05), inset 0 0 20px rgba(0,0,0,0.6)`,
        }}
      >
        {/* Cyberpunk corner brackets */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/60 rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary/60 rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary/60 rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/60 rounded-br-2xl" />

        {/* Lock Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full border border-primary/40 bg-primary/5 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <Lock className="text-primary w-6 h-6 animate-pulse" />
          </div>
        </div>

        {/* Header Titles */}
        <div className="text-center mb-8">
          <h2 className="font-heading font-black text-2xl tracking-[0.1em] text-white uppercase">
            Admin Portal
          </h2>
          <p className="text-white/40 font-mono text-[10px] tracking-widest uppercase mt-1">
            Secure Authorization Terminal
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 bg-red-950/20 border border-red-500/30 rounded-lg text-red-400 font-mono text-[11px] leading-relaxed text-center">
            ERROR: {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="font-mono text-[9px] uppercase tracking-widest text-white/40 block ml-1">
              Terminal User ID
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
              <input
                type="email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="enter email address"
                className="w-full bg-[#111015] border border-white/10 text-white font-mono text-sm pl-11 pr-4 py-3 rounded-lg focus:outline-none focus:border-primary/80 transition-colors placeholder:text-white/20"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-[9px] uppercase tracking-widest text-white/40 block ml-1">
              Terminal Security Phrase
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
              <input
                type="password"
                required
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full bg-[#111015] border border-white/10 text-white font-mono text-sm pl-11 pr-4 py-3 rounded-lg focus:outline-none focus:border-primary/80 transition-colors placeholder:text-white/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="glow-button w-full text-sm font-semibold !py-3 inline-flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Authorizing Session...
              </>
            ) : (
              "Initialize Session"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
