import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Modal from '../common/Modal';
import LoadingSpinner from '../common/LoadingSpinner';
import { Trash2 } from 'lucide-react';

const STANDARD_CATEGORIES = {
  INCOME: ['Salary', 'Freelance', 'Investments', 'Gifts', 'Refunds', 'Other Income'],
  EXPENSE: [
    'Food & Dining',
    'Rent & Mortgage',
    'Utilities & Bills',
    'Shopping',
    'Transportation',
    'Entertainment',
    'Medical & Health',
    'Education',
    'Travel',
    'Others',
  ],
};

export default function TransactionModal({
  isOpen,
  onClose,
  onSuccess,
  transaction = null, // If set, we are in EDIT mode
}) {
  const isEdit = !!transaction;
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('EXPENSE');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Synchronize state when modal opens or transaction changes
  useEffect(() => {
    if (transaction) {
      setAmount(transaction.amount.toString());
      setType(transaction.type);
      setCategory(transaction.category || '');
      setDescription(transaction.description || '');
      
      // Convert ISO date to datetime-local format (YYYY-MM-DDTHH:MM)
      if (transaction.transactionDate) {
        const date = new Date(transaction.transactionDate);
        // Correct timezone offset to get local ISO string
        const offset = date.getTimezoneOffset() * 60000;
        const localISOTime = new Date(date.getTime() - offset).toISOString().slice(0, 16);
        setTransactionDate(localISOTime);
      } else {
        setTransactionDate('');
      }
    } else {
      // Defaults for NEW transaction
      setAmount('');
      setType('EXPENSE');
      setCategory(STANDARD_CATEGORIES.EXPENSE[0]);
      setDescription('');
      
      // Set to current local time
      const now = new Date();
      const offset = now.getTimezoneOffset() * 60000;
      const localISOTime = new Date(now.getTime() - offset).toISOString().slice(0, 16);
      setTransactionDate(localISOTime);
    }
    setErrorMsg('');
  }, [transaction, isOpen]);

  // Adjust default category when type changes
  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(STANDARD_CATEGORIES[newType][0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setErrorMsg('Amount must be greater than 0');
      return;
    }
    if (!transactionDate) {
      setErrorMsg('Transaction date is required');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const payload = {
      amount: parseFloat(amount),
      type,
      category,
      description,
      transactionDate: new Date(transactionDate).toISOString(), // Convert to Instant
    };

    try {
      if (isEdit) {
        await api.patch(`/transactions/${transaction.id}`, payload);
      } else {
        await api.post('/transactions', payload);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!transaction) return;
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;

    setIsDeleting(true);
    setErrorMsg('');

    try {
      await api.delete(`/transactions/${transaction.id}`);
      onSuccess();
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to delete transaction');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Transaction' : 'Add New Transaction'}
      size="md"
    >
      {errorMsg && (
        <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-medium">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Toggle Type */}
        <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => handleTypeChange('EXPENSE')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              type === 'EXPENSE'
                ? 'bg-rose-500/15 text-rose-450 border border-rose-500/20 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('INCOME')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              type === 'INCOME'
                ? 'bg-emerald-500/15 text-emerald-450 border border-emerald-500/20 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Income
          </button>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Amount ($)
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-800 focus:border-primary-500 rounded-xl text-slate-200 focus:outline-none transition-all text-sm"
          />
        </div>

        {/* Category & Suggestions */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Category
          </label>
          <input
            type="text"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Groceries"
            className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-800 focus:border-primary-500 rounded-xl text-slate-200 focus:outline-none transition-all text-sm mb-2"
          />
          <div className="flex flex-wrap gap-1.5">
            {STANDARD_CATEGORIES[type].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                  category === cat
                    ? 'bg-primary-600/15 border-primary-500/30 text-primary-400 font-medium'
                    : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Date Time */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Date & Time
          </label>
          <input
            type="datetime-local"
            required
            value={transactionDate}
            onChange={(e) => setTransactionDate(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-800 focus:border-primary-500 rounded-xl text-slate-200 focus:outline-none transition-all text-sm"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe this transaction..."
            rows={2}
            className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-800 focus:border-primary-500 rounded-xl text-slate-200 focus:outline-none transition-all text-sm resize-none"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-3 pt-3 border-t border-slate-800/60 mt-5">
          {isEdit && (
            <button
              type="button"
              disabled={isDeleting || isSubmitting}
              onClick={handleDelete}
              className="px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500 text-rose-450 hover:text-white border border-rose-500/20 hover:border-rose-500 rounded-xl transition-all duration-200 disabled:opacity-40 flex items-center justify-center gap-1.5"
            >
              {isDeleting ? <LoadingSpinner size="sm" /> : <Trash2 className="w-4 h-4" />}
            </button>
          )}
          
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 border border-slate-850 hover:bg-slate-800 text-slate-350 hover:text-slate-200 rounded-xl text-sm font-semibold transition-all"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting || isDeleting}
            className="flex-1.5 py-2.5 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-primary-500/10 transition-all duration-200 disabled:opacity-50"
          >
            {isSubmitting ? <LoadingSpinner size="sm" /> : isEdit ? 'Save Changes' : 'Add Transaction'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
