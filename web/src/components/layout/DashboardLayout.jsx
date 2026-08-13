import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
    LayoutDashboard,
    ArrowLeftRight,
    Wallet,
    Users,
    User,
    LogOut,
    Menu,
    X,
    TrendingUp,
} from "lucide-react";
import Logo from "../common/Logo";

export default function DashboardLayout({ children }) {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isApiHealthy, setIsApiHealthy] = useState(null);

    // Check API health status
    useEffect(() => {
        const checkHealth = async () => {
            try {
                const response = await fetch("/api/v1/health");
                if (response.ok) {
                    setIsApiHealthy(true);
                } else {
                    setIsApiHealthy(false);
                }
            } catch (err) {
                setIsApiHealthy(false);
            }
        };
        checkHealth();
        const interval = setInterval(checkHealth, 30000);
        return () => clearInterval(interval);
    }, []);

    const navItems = [
        { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { name: "Transactions", path: "/transactions", icon: ArrowLeftRight },
        { name: "Budgets", path: "/budgets", icon: Wallet, badge: "Mock" },
        { name: "Groups", path: "/groups", icon: Users, badge: "Mock" },
        { name: "Profile Settings", path: "/profile", icon: User },
    ];

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const getPageTitle = () => {
        const activeItem = navItems.find(
            (item) => item.path === location.pathname,
        );
        return activeItem ? activeItem.name : "Pennywise";
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-dark-950 text-slate-100 font-sans">
            <aside className="hidden md:flex flex-col w-64 glass-panel border-r border-slate-800/60 p-5 shrink-0">
                <div className="flex items-center gap-3 mb-8 px-2">
                    <Logo className="size-10" />
                    <div>
                        <span className="font-display font-bold text-xl tracking-tight text-white">
                            Pennywise
                        </span>
                        <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">
                            Finance Manager
                        </p>
                    </div>
                </div>

                <nav className="flex-1 space-y-1.5">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                                    isActive
                                        ? "bg-primary-600/15 text-primary-400 border border-primary-500/20 font-medium"
                                        : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border border-transparent"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon
                                        className={`w-5 h-5 transition-colors ${isActive ? "text-primary-400" : "text-slate-400 group-hover:text-slate-200"}`}
                                    />
                                    <span>{item.name}</span>
                                </div>
                                {item.badge && (
                                    <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700/60 font-semibold tracking-wider uppercase font-mono">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User profile section at the bottom */}
                <div className="mt-auto border-t border-slate-800/80 pt-4 px-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-md shadow-primary-500/10">
                            {user
                                ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
                                : "U"}
                        </div>
                        <div className="overflow-hidden flex-1">
                            <h4 className="text-sm font-semibold text-white truncate">
                                {user
                                    ? `${user.firstName} ${user.lastName}`
                                    : "Guest User"}
                            </h4>
                            <p className="text-[11px] text-slate-400 truncate">
                                {user ? user.email : "guest@pennywise.com"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 border border-transparent hover:border-rose-500/20 transition-all duration-200"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm font-medium">Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Top Header */}
            <header className="md:hidden flex items-center justify-between px-5 py-4 glass-panel border-b border-slate-800/60 w-full z-40 sticky top-0">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary-500" />
                    <span className="font-display font-bold text-lg text-white">
                        Pennywise
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    {/* Health indicator */}
                    <div className="flex items-center">
                        <span
                            className={`w-2.5 h-2.5 rounded-full ${isApiHealthy ? "bg-emerald-500 animate-pulse" : "bg-rose-500"} mr-1.5`}
                        />
                        <span className="text-[11px] text-slate-400 font-mono uppercase">
                            API
                        </span>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-1.5 rounded-lg bg-slate-800 border border-slate-700/60 text-slate-300"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-5 h-5" />
                        ) : (
                            <Menu className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Drawer */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-x-0 top-[61px] bottom-0 bg-dark-950/95 backdrop-blur-lg z-30 flex flex-col p-5 border-t border-slate-800/50 animate-fade-in">
                    <nav className="space-y-2 mb-6">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                                        isActive
                                            ? "bg-primary-600/15 text-primary-400 border border-primary-500/20 font-medium"
                                            : "text-slate-400 hover:bg-slate-800"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className="w-5 h-5" />
                                        <span>{item.name}</span>
                                    </div>
                                    {item.badge && (
                                        <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700 font-semibold uppercase">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mt-auto border-t border-slate-800/80 pt-4 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 flex items-center justify-center font-bold text-white">
                                {user
                                    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
                                    : "U"}
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-white">
                                    {user
                                        ? `${user.firstName} ${user.lastName}`
                                        : "Guest User"}
                                </h4>
                                <p className="text-xs text-slate-400">
                                    {user ? user.email : ""}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                handleLogout();
                            }}
                            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 hover:border-rose-500 transition-all font-semibold"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Log Out</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Main Page Area */}
            <div className="flex-1 flex flex-col overflow-y-auto max-h-screen">
                {/* Desktop Topbar Header */}
                <header className="hidden md:flex items-center justify-between px-8 py-4 glass-panel border-b border-slate-800/40 sticky top-0 z-20">
                    <h1 className="font-display font-bold text-xl text-white tracking-tight leading-none my-0">
                        {getPageTitle()}
                    </h1>

                    <div className="flex items-center gap-6">
                        {/* API Health Monitor */}
                        <div className="flex items-center gap-2 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800/80">
                            <span
                                className={`w-2 h-2 rounded-full ${isApiHealthy ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}
                            />
                            <span className="text-xs text-slate-400 font-medium">
                                API Status:{" "}
                                <span className="font-mono text-[10px] uppercase font-bold">
                                    {isApiHealthy ? "Online" : "Offline"}
                                </span>
                            </span>
                        </div>

                        {/* Quick user initials trigger */}
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-slate-300 font-medium">
                                {user ? `Hello, ${user.firstName}` : ""}
                            </span>
                            <div
                                onClick={() => navigate("/profile")}
                                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-primary-600/25 border border-slate-700/80 cursor-pointer flex items-center justify-center font-bold text-xs text-slate-200 transition-colors"
                                title="Profile Settings"
                            >
                                {user
                                    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
                                    : "U"}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content body */}
                <main className="flex-1 p-5 md:p-8 animate-fade-in max-w-7xl w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
