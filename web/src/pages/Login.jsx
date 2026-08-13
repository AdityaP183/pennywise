import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useId, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Logo from "../components/common/Logo";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const id = useId();
    const emailId = `${id}-email`;
    const passwordId = `${id}-password`;
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setErrorMsg("Please fill in all fields.");
            return;
        }

        setIsSubmitting(true);
        setErrorMsg("");
        try {
            await login(email, password);
            navigate("/dashboard");
        } catch (err) {
            setErrorMsg(
                err.message || "Invalid email or password. Please try again.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-950 relative overflow-hidden px-4">
            <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-md glass-panel border border-slate-800/80 rounded-2xl p-8 shadow-2xl relative z-10 animate-fade-in">
                <div className="flex flex-col items-center mb-8">
                    <Logo className="size-12" />
                    <span className="font-display font-bold text-2xl text-white">
                        Pennywise
                    </span>
                    <p className="text-sm text-slate-400 mt-1">
                        Smart and beautiful financial tracking
                    </p>
                </div>

                <h2 className="text-xl font-bold text-white mb-6 text-center">
                    Welcome Back
                </h2>

                {errorMsg && (
                    <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm font-medium animate-pulse-subtle">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor={emailId}
                            className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2"
                        >
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <Mail className="w-5 h-5" />
                            </div>
                            <input
                                id={emailId}
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full pl-11 pr-4 py-3 bg-slate-900/60 border border-slate-800 focus:border-primary-500 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label
                                htmlFor={passwordId}
                                className="block text-xs font-semibold text-slate-400 uppercase tracking-wider"
                            >
                                Password
                            </label>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <Lock className="w-5 h-5" />
                            </div>
                            <input
                                id={passwordId}
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-11 pr-11 py-3 bg-slate-900/60 border border-slate-800 focus:border-primary-500 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none transition-all text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 px-4 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 flex items-center justify-center gap-2 group transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <LoadingSpinner size="sm" />
                        ) : (
                            <>
                                <span>Sign In</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </>
                        )}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-slate-400">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="text-primary-400 hover:text-primary-300 font-semibold transition-colors"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
