import {
    ArrowUpDown,
    Calendar,
    ChevronDown,
    Edit2,
    Filter,
    Plus,
    Search,
    Tag,
} from "lucide-react";
import { useEffect, useState } from "react";
import Card from "../components/common/Card";
import LoadingSpinner from "../components/common/LoadingSpinner";
import TransactionModal from "../components/transactions/TransactionModal";
import { api } from "../services/api";
import { formatCurrency, formatDate } from "../utils/helper";

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [type, setType] = useState("ALL"); // ALL, INCOME, EXPENSE
    const [sortBy, setSortBy] = useState("TRANSACTION_DATE"); // TRANSACTION_DATE, AMOUNT, CREATED_AT, UPDATED_AT
    const [direction, setDirection] = useState("DESC"); // ASC, DESC
    const [error, setError] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 400);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchTransactions = async () => {
        try {
            setIsLoading(true);
            setError("");

            const queryParams = new URLSearchParams();
            if (debouncedSearch.trim()) {
                queryParams.append("search", debouncedSearch.trim());
            }
            if (type !== "ALL") {
                queryParams.append("type", type);
            }
            queryParams.append("sortBy", sortBy);
            queryParams.append("direction", direction);

            const url = `/transactions?${queryParams.toString()}`;
            const data = await api.get(url);
            setTransactions(data || []);
        } catch (err) {
            console.error("Error fetching transactions:", err);
            setError("Could not retrieve transaction history.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [debouncedSearch, type, sortBy, direction]);

    const handleOpenAddModal = () => {
        setSelectedTransaction(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (tx) => {
        setSelectedTransaction(tx);
        setIsModalOpen(true);
    };

    const toggleSortDirection = () => {
        setDirection((prev) => (prev === "DESC" ? "ASC" : "DESC"));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                        Transactions
                    </h2>
                    <p className="text-sm text-slate-400">
                        View, sort, filter, and manage your financial records.
                    </p>
                </div>

                <button
                    onClick={handleOpenAddModal}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-indigo-650 hover:from-primary-500 hover:to-indigo-550 text-white rounded-xl text-xs font-semibold shadow-lg shadow-primary-500/10 hover:shadow-primary-500/25 transition-all duration-300 group"
                >
                    <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
                    <span>New Record</span>
                </button>
            </div>

            {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-455 rounded-xl text-sm font-semibold">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900/30 p-4 rounded-2xl border border-slate-900">
                <div className="md:col-span-2 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Search className="w-4 h-4" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search descriptions or categories..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-950/60 border border-slate-850 focus:border-primary-500 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none transition-all text-sm"
                    />
                </div>

                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Filter className="w-4 h-4" />
                    </div>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full pl-9 pr-8 py-2 bg-slate-950/60 border border-slate-850 focus:border-primary-500 rounded-xl text-slate-200 focus:outline-none transition-all text-sm appearance-none cursor-pointer"
                    >
                        <option value="ALL">All Types</option>
                        <option value="INCOME">Income Only</option>
                        <option value="EXPENSE">Expense Only</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                        <ChevronDown className="w-4 h-4" />
                    </div>
                </div>

                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full pl-3 pr-8 py-2 bg-slate-950/60 border border-slate-850 focus:border-primary-500 rounded-xl text-slate-200 focus:outline-none transition-all text-sm appearance-none cursor-pointer"
                        >
                            <option value="TRANSACTION_DATE">
                                Sort by Date
                            </option>
                            <option value="AMOUNT">Sort by Amount</option>
                            <option value="UPDATED_AT">
                                Sort by Edit Date
                            </option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                            <ChevronDown className="w-4 h-4" />
                        </div>
                    </div>

                    <button
                        onClick={toggleSortDirection}
                        className="px-3 py-2 bg-slate-950/60 hover:bg-slate-900 border border-slate-850 hover:border-slate-750 text-slate-350 hover:text-slate-200 rounded-xl transition-all"
                        title={
                            direction === "DESC" ? "Descending" : "Ascending"
                        }
                    >
                        <ArrowUpDown
                            className={`w-4 h-4 transform transition-transform ${direction === "ASC" ? "rotate-180" : ""}`}
                        />
                    </button>
                </div>
            </div>

            <Card className="!p-0 overflow-hidden">
                {isLoading && transactions.length === 0 ? (
                    <div className="py-20 flex items-center justify-center">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="py-20 text-center text-slate-500">
                        <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-650" />
                        <h3 className="text-base font-semibold text-white">
                            No transactions found
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto px-4">
                            Try adjusting your filters, query search, or log a
                            new transaction to populate the ledger.
                        </p>
                    </div>
                ) : (
                    <div>
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-850 bg-slate-900/10 text-xs font-bold text-slate-450 uppercase tracking-widest">
                                        <th className="py-4 px-6">
                                            Record Info
                                        </th>
                                        <th className="py-4 px-6">Category</th>
                                        <th className="py-4 px-6">
                                            Transaction Date
                                        </th>
                                        <th className="py-4 px-6 text-right">
                                            Amount
                                        </th>
                                        <th className="py-4 px-6 text-center w-24">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-850/40">
                                    {transactions.map((tx) => (
                                        <tr
                                            key={tx.id}
                                            className="hover:bg-slate-900/35 transition-colors group/row"
                                        >
                                            <td className="py-4 px-6">
                                                <div className="font-semibold text-slate-100">
                                                    {tx.description ||
                                                        "No Description"}
                                                </div>
                                                <div className="text-[10px] text-slate-500 font-mono mt-0.5 uppercase tracking-wider">
                                                    {tx.type}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900/60 border border-slate-800/80 text-slate-350">
                                                    <Tag className="w-3 h-3 text-slate-450" />
                                                    {tx.category ||
                                                        "Uncategorized"}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-slate-400">
                                                {formatDate(tx.transactionDate)}
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <span
                                                    className={`font-bold font-mono text-sm ${
                                                        tx.type === "INCOME"
                                                            ? "text-emerald-440"
                                                            : "text-rose-440"
                                                    }`}
                                                >
                                                    {formatCurrency(tx.amount)}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <button
                                                    onClick={() =>
                                                        handleOpenEditModal(tx)
                                                    }
                                                    className="p-2 bg-slate-800/30 hover:bg-slate-800 border border-transparent hover:border-slate-700/60 text-slate-400 hover:text-white rounded-lg transition-all"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="md:hidden divide-y divide-slate-850/50">
                            {transactions.map((tx) => (
                                <div
                                    key={tx.id}
                                    onClick={() => handleOpenEditModal(tx)}
                                    className="p-4 flex items-center justify-between active:bg-slate-900/40 cursor-pointer"
                                >
                                    <div className="min-w-0">
                                        <h4 className="font-semibold text-white text-sm truncate">
                                            {tx.description || "No Description"}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-slate-400 uppercase font-mono">
                                                {tx.type}
                                            </span>
                                            <span className="text-[11px] text-slate-450">
                                                {tx.category || "Uncategorized"}
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-slate-500 block mt-1">
                                            {new Date(
                                                tx.transactionDate,
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span
                                            className={`font-bold font-mono text-sm ${
                                                tx.type === "INCOME"
                                                    ? "text-emerald-440"
                                                    : "text-rose-440"
                                            }`}
                                        >
                                            {tx.type === "INCOME" ? "+" : "-"}$
                                            {parseFloat(tx.amount).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Card>

            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                transaction={selectedTransaction}
                onSuccess={fetchTransactions}
            />
        </div>
    );
}
