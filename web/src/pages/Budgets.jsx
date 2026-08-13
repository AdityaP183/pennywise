import { useState } from 'react';
import Card from '../components/common/Card';
import { Wallet, Plus, Info, AlertTriangle, Sparkles, Check } from 'lucide-react';

const INITIAL_MOCK_BUDGETS = [
  { id: 1, category: 'Food & Dining', spent: 340.5, limit: 500.0, color: 'primary' },
  { id: 2, category: 'Rent & Mortgage', spent: 1200.0, limit: 1200.0, color: 'emerald' },
  { id: 3, category: 'Utilities & Bills', spent: 185.2, limit: 250.0, color: 'indigo' },
  { id: 4, category: 'Shopping', spent: 280.0, limit: 200.0, color: 'rose' },
  { id: 5, category: 'Transportation', spent: 45.0, limit: 150.0, color: 'cyan' },
];

export default function Budgets() {
  const [budgets, setBudgets] = useState(INITIAL_MOCK_BUDGETS);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [newLimit, setNewLimit] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleEditLimit = (budget) => {
    setSelectedBudget(budget);
    setNewLimit(budget.limit.toString());
  };

  const handleSaveLimit = (e) => {
    e.preventDefault();
    if (!selectedBudget || parseFloat(newLimit) <= 0) return;

    setBudgets((prev) =>
      prev.map((b) => (b.id === selectedBudget.id ? { ...b, limit: parseFloat(newLimit) } : b))
    );
    setSuccessMsg(`Updated limit for ${selectedBudget.category}!`);
    setSelectedBudget(null);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Budgets</span>
            <span className="text-[10px] bg-primary-600/20 text-primary-400 px-1.5 py-0.5 rounded border border-primary-500/20 font-bold uppercase tracking-wider font-mono">
              Coming Soon
            </span>
          </h2>
          <p className="text-sm text-slate-400">Manage categories and track limits (Interactive Preview).</p>
        </div>

        <button
          disabled
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-900 border border-slate-800 text-slate-500 rounded-xl text-xs font-semibold cursor-not-allowed"
          title="Budget creation will be supported after backend integration"
        >
          <Plus className="w-4 h-4" />
          <span>Create Budget</span>
        </button>
      </div>

      {/* Info Tip Banner */}
      <div className="p-4 bg-primary-500/5 border border-primary-500/10 text-slate-300 rounded-2xl text-sm flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-white text-sm">Interactive Sandbox</h4>
          <p className="text-xs text-slate-450 mt-1">
            This module is pre-integrated on the UI but requires database backend controllers. You can tweak budget limits inside this preview below to see the progress meter adapt!
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 rounded-xl text-xs font-semibold flex items-center gap-1.5 animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budgets List */}
        <div className="lg:col-span-2 space-y-4">
          {budgets.map((b) => {
            const ratio = b.spent / b.limit;
            const percent = Math.min(Math.round(ratio * 100), 100);
            const isOver = ratio > 1.0;
            const isNear = ratio >= 0.85 && ratio <= 1.0;

            let barColor = 'bg-primary-500';
            if (isOver) barColor = 'bg-rose-500';
            else if (isNear) barColor = 'bg-amber-500';
            else if (b.color === 'emerald') barColor = 'bg-emerald-500';
            else if (b.color === 'indigo') barColor = 'bg-indigo-500';
            else if (b.color === 'cyan') barColor = 'bg-cyan-500';

            return (
              <Card key={b.id} className="p-5 hover:border-slate-800 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-white text-sm">{b.category}</h4>
                    <p className="text-xs text-slate-450 mt-1">
                      {formatCurrency(b.spent)} of {formatCurrency(b.limit)} limit
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {isOver && (
                      <span className="flex items-center gap-1 text-[10px] bg-rose-500/10 border border-rose-500/25 text-rose-450 px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                        <AlertTriangle className="w-3 h-3" /> Overspent
                      </span>
                    )}
                    {isNear && !isOver && (
                      <span className="flex items-center gap-1 text-[10px] bg-amber-500/10 border border-amber-500/25 text-amber-450 px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                        <Info className="w-3 h-3" /> Warning
                      </span>
                    )}
                    <button
                      onClick={() => handleEditLimit(b)}
                      className="text-xs text-primary-400 hover:text-primary-300 font-semibold transition-colors"
                    >
                      Adjust Limit
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-850">
                  <div
                    className={`h-full ${barColor} transition-all duration-500 rounded-full`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-[10px] font-mono text-slate-500">
                  <span>0%</span>
                  <span>{percent}% allocated</span>
                  <span>100%</span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Adjust Panel */}
        <div>
          {selectedBudget ? (
            <Card title="Adjust Budget Limit" subtitle={`Adjust settings for ${selectedBudget.category}`}>
              <form onSubmit={handleSaveLimit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Limit Amount ($)
                  </label>
                  <input
                    type="number"
                    step="50"
                    min="100"
                    required
                    value={newLimit}
                    onChange={(e) => setNewLimit(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-850 focus:border-primary-500 rounded-xl text-slate-200 focus:outline-none transition-all text-sm"
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedBudget(null)}
                    className="flex-1 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1.5 py-2 bg-gradient-to-r from-primary-600 to-indigo-650 hover:from-primary-500 hover:to-indigo-550 text-white rounded-lg text-xs font-semibold transition-all shadow-md shadow-primary-500/10"
                  >
                    Save limit
                  </button>
                </div>
              </form>
            </Card>
          ) : (
            <Card className="text-center py-8">
              <Wallet className="w-10 h-10 mx-auto text-slate-600 mb-3" />
              <h4 className="font-semibold text-white text-sm">Select a budget</h4>
              <p className="text-xs text-slate-450 mt-1 max-w-[200px] mx-auto">
                Click "Adjust Limit" on any budget category to tweak the limit slider locally.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
