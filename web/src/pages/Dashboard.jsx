import {
    ArrowDownRight,
    ArrowRight,
    ArrowUpRight,
    Calendar,
    Edit2,
    IndianRupee,
    Layers,
    Plus,
    TrendingDown,
    TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import Card from "../components/common/Card";
import LoadingSpinner from "../components/common/LoadingSpinner";
import TransactionModal from "../components/transactions/TransactionModal";
import { api } from "../services/api";
import { formatCurrency, formatDate } from "../utils/helper";

export default function Dashboard() {
    const [range, setRange] = useState("ALL_TIME");
    const [summary, setSummary] = useState(null);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [error, setError] = useState("");

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);
            setError("");

            const summaryData = await api.get(
                `/transactions/summary?range=${range}`,
            );
            setSummary(summaryData);

            const allTx = await api.get(
                "/transactions?sortBy=TRANSACTION_DATE&direction=DESC",
            );
            setRecentTransactions(allTx.slice(0, 5));
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
            setError(
                "Failed to load dashboard data. Please make sure the backend is running.",
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [range]);

    const handleOpenAddModal = () => {
        setSelectedTransaction(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (tx) => {
        setSelectedTransaction(tx);
        setIsModalOpen(true);
    };

    const getChartData = () => {
        if (!summary || !summary.data || summary.data.length === 0) {
            return [];
        }
        return summary.data.map((point) => {
            const date = new Date(point.period);
            let label = "";
            if (range === "THIS_MONTH") {
                label = date.toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                });
            } else if (range === "LAST_3_MONTHS") {
                label = date.toLocaleDateString(undefined, {
                    week: "numeric",
                    month: "short",
                });
            } else {
                label = date.toLocaleDateString(undefined, {
                    month: "short",
                    year: "2-digit",
                });
            }

            return {
                name: label,
                income: parseFloat(point.income || 0),
                expense: parseFloat(point.expense || 0),
                balance: parseFloat(point.amount || 0),
            };
        });
    };

    const chartData = getChartData();

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass-panel border border-slate-800 p-3.5 rounded-xl shadow-lg text-xs">
                    <p className="font-semibold text-slate-300 mb-1.5">
                        {payload[0].payload.name}
                    </p>
                    <div className="space-y-1">
                        <p className="text-emerald-400 font-medium">
                            Income: {formatCurrency(payload[0].value)}
                        </p>
                        {payload[1] && (
                            <p className="text-rose-450 font-medium">
                                Expense: {formatCurrency(payload[1].value)}
                            </p>
                        )}
                    </div>
                </div>
            );
        }
        return null;
    };

    if (isLoading && !summary) {
        return (
            <div className="h-[70vh] flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                        Overview
                    </h2>
                    <p className="text-sm text-slate-400">
                        Keep an eye on your finances and track trends.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-850">
                        {[
                            { id: "ALL_TIME", label: "All Time" },
                            { id: "THIS_MONTH", label: "This Month" },
                            { id: "LAST_3_MONTHS", label: "3 Months" },
                        ].map((option) => (
                            <button
                                key={option.id}
                                onClick={() => setRange(option.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                    range === option.id
                                        ? "bg-slate-800 text-white shadow-sm border border-slate-750"
                                        : "text-slate-400 hover:text-slate-200"
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleOpenAddModal}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-indigo-650 hover:from-primary-500 hover:to-indigo-550 text-white rounded-xl text-xs font-semibold shadow-lg shadow-primary-500/10 hover:shadow-primary-500/25 transition-all duration-300 group"
                    >
                        <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
                        <span>Add Transaction</span>
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/25 text-rose-450 rounded-xl text-sm font-semibold">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="relative overflow-hidden group">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                Net Savings
                            </p>
                            <h3 className="text-3xl font-bold font-display text-white mt-2">
                                {formatCurrency(summary?.net)}
                            </h3>
                        </div>
                        <div className="p-3 rounded-xl bg-primary-600/10 text-primary-400 border border-primary-500/20 shadow-md">
                            <IndianRupee className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-1.5">
                        <span
                            className={`text-xs font-semibold ${summary?.net >= 0 ? "text-emerald-450" : "text-rose-405"}`}
                        >
                            {summary?.net >= 0 ? "Surplus" : "Deficit"}
                        </span>
                        <span className="text-[11px] text-slate-450 font-medium">
                            for current range filter
                        </span>
                    </div>
                    <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-primary-600/5 rounded-full blur-xl group-hover:bg-primary-600/10 transition-all duration-300" />
                </Card>

                <Card className="relative overflow-hidden group">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                Total Income
                            </p>
                            <h3 className="text-3xl font-bold font-display text-emerald-400 mt-2">
                                {formatCurrency(summary?.totalIncome)}
                            </h3>
                        </div>
                        <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-md">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-1">
                        <ArrowUpRight className="w-3.5 h-3.5 text-emerald-450" />
                        <span className="text-xs text-slate-400 font-medium">
                            Total earned money flow
                        </span>
                    </div>
                    <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-emerald-600/5 rounded-full blur-xl group-hover:bg-emerald-600/10 transition-all duration-300" />
                </Card>

                <Card className="relative overflow-hidden group">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                Total Expenses
                            </p>
                            <h3 className="text-3xl font-bold font-display text-rose-400 mt-2">
                                {formatCurrency(summary?.totalExpense)}
                            </h3>
                        </div>
                        <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-md">
                            <TrendingDown className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-1">
                        <ArrowDownRight className="w-3.5 h-3.5 text-rose-455" />
                        <span className="text-xs text-slate-400 font-medium">
                            Total logged spends
                        </span>
                    </div>
                    <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-rose-600/5 rounded-full blur-xl group-hover:bg-rose-600/10 transition-all duration-300" />
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card
                        title="Financial Trend"
                        subtitle="Visualize your income streams vs monthly spending patterns."
                    >
                        {chartData.length === 0 ? (
                            <div className="h-[300px] flex flex-col items-center justify-center text-slate-500 border border-dashed border-slate-800 rounded-xl bg-slate-900/10">
                                <Calendar className="w-8 h-8 mb-2.5 text-slate-600" />
                                <p className="text-sm font-semibold">
                                    No trend data available for this range
                                </p>
                                <p className="text-xs text-slate-550 mt-1">
                                    Add transactions to generate trend metrics
                                </p>
                            </div>
                        ) : (
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={chartData}
                                        margin={{
                                            top: 10,
                                            right: 10,
                                            left: -20,
                                            bottom: 0,
                                        }}
                                    >
                                        <defs>
                                            <linearGradient
                                                id="colorIncome"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="#10b981"
                                                    stopOpacity={0.25}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="#10b981"
                                                    stopOpacity={0.0}
                                                />
                                            </linearGradient>
                                            <linearGradient
                                                id="colorExpense"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="#f43f5e"
                                                    stopOpacity={0.25}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="#f43f5e"
                                                    stopOpacity={0.0}
                                                />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#1e293b/30"
                                            vertical={false}
                                        />
                                        <XAxis
                                            dataKey="name"
                                            stroke="#64748b"
                                            fontSize={11}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            stroke="#64748b"
                                            fontSize={11}
                                            tickLine={false}
                                            tickFormatter={(val) => `$${val}`}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area
                                            type="monotone"
                                            dataKey="income"
                                            stroke="#10b981"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorIncome)"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="expense"
                                            stroke="#f43f5e"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorExpense)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </Card>
                </div>

                <div>
                    <Card
                        title="Recent Transactions"
                        subtitle="Your latest logged financial actions."
                        headerAction={
                            recentTransactions.length > 0 && (
                                <button
                                    onClick={() => navigate("/transactions")}
                                    className="text-xs text-primary-400 hover:text-primary-300 font-semibold flex items-center gap-1.5 transition-colors group/link"
                                >
                                    <span>See All</span>
                                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                                </button>
                            )
                        }
                    >
                        {recentTransactions.length === 0 ? (
                            <div className="h-[300px] flex flex-col items-center justify-center text-slate-500 border border-dashed border-slate-800 rounded-xl bg-slate-900/10 p-5 text-center">
                                <Layers className="w-8 h-8 mb-2.5 text-slate-600" />
                                <p className="text-sm font-semibold">
                                    No transactions found
                                </p>
                                <p className="text-xs text-slate-550 mt-1 max-w-[200px]">
                                    You have not registered any transactions
                                    yet.
                                </p>
                                <button
                                    onClick={handleOpenAddModal}
                                    className="mt-4 px-3.5 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-colors"
                                >
                                    Create one now
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                                {recentTransactions.map((tx) => (
                                    <div
                                        key={tx.id}
                                        className="flex items-center justify-between p-3 bg-slate-900/30 hover:bg-slate-900/80 rounded-xl border border-slate-900 hover:border-slate-800 transition-all duration-200 group"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div
                                                className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border ${
                                                    tx.type === "INCOME"
                                                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-450"
                                                        : "bg-rose-500/10 border-rose-500/20 text-rose-450"
                                                }`}
                                            >
                                                {tx.type === "INCOME" ? (
                                                    <ArrowUpRight className="w-4 h-4" />
                                                ) : (
                                                    <ArrowDownRight className="w-4 h-4" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-sm font-semibold text-white truncate">
                                                    {tx.description ||
                                                        tx.category}
                                                </h4>
                                                <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                                                    <span className="bg-slate-850 px-1.5 py-0.5 rounded border border-slate-800/80 uppercase font-semibold text-[9px] text-slate-350">
                                                        {tx.category ||
                                                            "Uncategorized"}
                                                    </span>
                                                    <span>
                                                        {formatDate(
                                                            tx.transactionDate,
                                                        )}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2.5">
                                            <span
                                                className={`text-sm font-bold font-mono ${
                                                    tx.type === "INCOME"
                                                        ? "text-emerald-440"
                                                        : "text-rose-440"
                                                }`}
                                            >
                                                {formatCurrency(tx.amount)}
                                            </span>

                                            <button
                                                onClick={() =>
                                                    handleOpenEditModal(tx)
                                                }
                                                className="p-1.5 rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-transparent hover:border-slate-750 text-slate-400 hover:text-slate-200 transition-all opacity-0 group-hover:opacity-100"
                                                title="Edit Transaction"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            </div>

            {/* Transaction creation/editing Modal */}
            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                transaction={selectedTransaction}
                onSuccess={fetchDashboardData}
            />
        </div>
    );
}
