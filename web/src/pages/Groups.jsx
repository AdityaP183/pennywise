import { useState } from 'react';
import Card from '../components/common/Card';
import { Users, Plus, Sparkles, Check, DollarSign, UserCheck } from 'lucide-react';

const INITIAL_MOCK_GROUPS = [
  {
    id: 1,
    name: 'Flatmates 302',
    members: ['Alice', 'Bob', 'You'],
    netBalance: -45.0, // negative means you owe
    balances: [
      { from: 'You', to: 'Alice', amount: 30.0 },
      { from: 'You', to: 'Bob', amount: 15.0 },
    ],
  },
  {
    id: 2,
    name: 'Trip to Tokyo',
    members: ['John', 'Kate', 'Leo', 'Mia', 'You'],
    netBalance: 240.0, // positive means you are owed
    balances: [
      { from: 'John', to: 'You', amount: 140.0 },
      { from: 'Kate', to: 'You', amount: 100.0 },
    ],
  },
  {
    id: 3,
    name: 'Family Ledger',
    members: ['Mom', 'Dad', 'Brother', 'You'],
    netBalance: 0.0,
    balances: [],
  },
];

export default function Groups() {
  const [groups, setGroups] = useState(INITIAL_MOCK_GROUPS);
  const [selectedGroup, setSelectedGroup] = useState(INITIAL_MOCK_GROUPS[0]);
  const [successMsg, setSuccessMsg] = useState('');

  const selectGroup = (group) => {
    setSelectedGroup(group);
  };

  const handleSettleDebt = (index) => {
    if (!selectedGroup) return;

    const updatedBalances = [...selectedGroup.balances];
    const settledItem = updatedBalances[index];
    updatedBalances.splice(index, 1);

    // Calculate new net balance
    const adjustment = settledItem.from === 'You' ? settledItem.amount : -settledItem.amount;
    const newNet = selectedGroup.netBalance - adjustment;

    const updatedGroup = {
      ...selectedGroup,
      netBalance: newNet,
      balances: updatedBalances,
    };

    // Update global state
    setGroups((prev) => prev.map((g) => (g.id === selectedGroup.id ? updatedGroup : g)));
    setSelectedGroup(updatedGroup);

    setSuccessMsg(`Settled debt with ${settledItem.to || settledItem.from}!`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const formatCurrency = (val) => {
    const absVal = Math.abs(val);
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(absVal);
    return val < 0 ? `-${formatted}` : formatted;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Groups</span>
            <span className="text-[10px] bg-primary-600/20 text-primary-400 px-1.5 py-0.5 rounded border border-primary-500/20 font-bold uppercase tracking-wider font-mono">
              Coming Soon
            </span>
          </h2>
          <p className="text-sm text-slate-400">Collaborative shared bills, settlements, and split ratios.</p>
        </div>

        <button
          disabled
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-900 border border-slate-800 text-slate-500 rounded-xl text-xs font-semibold cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          <span>New Group</span>
        </button>
      </div>

      {/* Info Tip Banner */}
      <div className="p-4 bg-primary-500/5 border border-primary-500/10 text-slate-300 rounded-2xl text-sm flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-white text-sm">Interactive Sandbox</h4>
          <p className="text-xs text-slate-450 mt-1">
            This screen previews collaborative shared expenses. You can click the "Settle Debt" button on the balances drawer to settle debt calculations locally in this UI demo!
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
        {/* Groups List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xs font-bold text-slate-450 uppercase tracking-widest px-1">Your Groups</h3>
          <div className="space-y-2">
            {groups.map((g) => {
              const isSelected = selectedGroup?.id === g.id;
              const hasOwed = g.netBalance > 0;
              const hasOwe = g.netBalance < 0;

              return (
                <div
                  key={g.id}
                  onClick={() => selectGroup(g)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary-650/10 border-primary-500/30'
                      : 'bg-slate-900/30 border-slate-900/60 hover:bg-slate-900/60 hover:border-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className={`font-semibold text-sm ${isSelected ? 'text-primary-400' : 'text-slate-100'}`}>
                        {g.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {g.members.length} members ({g.members.join(', ')})
                      </p>
                    </div>

                    <div className="text-right">
                      {hasOwed && <span className="text-[10px] text-emerald-400 font-bold font-mono">OWED</span>}
                      {hasOwe && <span className="text-[10px] text-rose-400 font-bold font-mono">OWE</span>}
                      {g.netBalance === 0 && <span className="text-[10px] text-slate-500 font-bold font-mono">SETTLED</span>}

                      <p
                        className={`text-xs font-bold font-mono mt-1 ${
                          hasOwed ? 'text-emerald-450' : hasOwe ? 'text-rose-455' : 'text-slate-400'
                        }`}
                      >
                        {g.netBalance === 0 ? '' : g.netBalance > 0 ? '+' : ''}
                        {formatCurrency(g.netBalance)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Group Details Drawer */}
        <div className="lg:col-span-2">
          {selectedGroup ? (
            <Card
              title={selectedGroup.name}
              subtitle="Group settlements and member split balances"
            >
              {selectedGroup.balances.length === 0 ? (
                <div className="py-12 text-center text-slate-500 border border-dashed border-slate-800/80 rounded-xl bg-slate-950/10">
                  <UserCheck className="w-10 h-10 mx-auto text-slate-600 mb-2.5" />
                  <h4 className="font-semibold text-white text-sm">All Balanced Up!</h4>
                  <p className="text-xs text-slate-450 mt-1 max-w-[220px] mx-auto">
                    There are no pending debts in this group. Everyone is settled.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-450 uppercase tracking-widest px-1">Active Debts</h4>
                  <div className="space-y-3">
                    {selectedGroup.balances.map((bal, idx) => {
                      const isOwe = bal.from === 'You';
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3.5 bg-slate-900/30 border border-slate-850/65 rounded-xl hover:border-slate-800 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center border font-bold text-xs ${
                                isOwe
                                  ? 'bg-rose-500/10 border-rose-500/20 text-rose-450'
                                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-450'
                              }`}
                            >
                              $
                            </div>
                            <div className="text-sm">
                              {isOwe ? (
                                <p className="text-slate-350">
                                  You owe <span className="font-semibold text-white">{bal.to}</span>
                                </p>
                              ) : (
                                <p className="text-slate-350">
                                  <span className="font-semibold text-white">{bal.from}</span> owes you
                                </p>
                              )}
                              <p className="text-[10px] text-slate-500 font-mono uppercase mt-0.5">Shared split</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className={`font-mono font-bold text-sm ${isOwe ? 'text-rose-400' : 'text-emerald-400'}`}>
                              {formatCurrency(bal.amount)}
                            </span>

                            <button
                              onClick={() => handleSettleDebt(idx)}
                              className="px-3 py-1.5 bg-slate-850 hover:bg-primary-600/15 border border-slate-800 hover:border-primary-500/30 text-slate-300 hover:text-primary-400 rounded-lg text-xs font-semibold transition-colors"
                            >
                              Settle Debt
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </Card>
          ) : (
            <Card className="text-center py-16">
              <Users className="w-10 h-10 mx-auto text-slate-600 mb-3" />
              <h4 className="font-semibold text-white text-sm">Select a group</h4>
              <p className="text-xs text-slate-450 mt-1">
                Pick a group from the list to display split balances and settle debts.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
