import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { User, Mail, ShieldAlert, Key, Check } from 'lucide-react';

export default function Profile() {
  const { user, updateProfile, changePassword } = useAuth();
  
  // Profile Update Form States
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Password Update Form States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setProfileError('Name fields cannot be blank.');
      return;
    }

    setIsUpdatingProfile(true);
    setProfileError('');
    setProfileSuccess(false);

    try {
      await updateProfile(firstName.trim(), lastName.trim());
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordError('Current password is required.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setIsChangingPassword(true);
    setPasswordError('');
    setPasswordSuccess(false);

    try {
      await changePassword(currentPassword, newPassword);
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      setPasswordError(err.message || 'Password update failed. Verify your current password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Account Settings</h2>
        <p className="text-sm text-slate-400">Manage your profile details and change credentials.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Info Left Card */}
        <div className="md:col-span-1">
          <Card className="flex flex-col items-center text-center p-6 sticky top-[90px]">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-500 flex items-center justify-center font-bold text-3xl text-white shadow-xl shadow-primary-500/10 mb-4">
              {user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : 'U'}
            </div>
            <h3 className="font-display font-bold text-lg text-white">
              {user ? `${user.firstName} ${user.lastName}` : 'Guest User'}
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-1">{user?.email}</p>

            <div className="mt-6 pt-5 border-t border-slate-800/80 w-full text-left space-y-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Account Created</span>
                <p className="text-xs font-semibold text-slate-200 mt-0.5">{formatDate(user?.createdAt)}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Authentication</span>
                <p className="text-xs font-semibold text-slate-200 mt-0.5">Secure JWT Cookies</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Forms Right Columns */}
        <div className="md:col-span-2 space-y-6">
          {/* Edit Profile Form */}
          <Card title="Profile Information" subtitle="Update your account name information.">
            {profileSuccess && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 rounded-xl text-xs font-semibold flex items-center gap-1.5 animate-in fade-in">
                <Check className="w-4 h-4" />
                <span>Profile updated successfully!</span>
              </div>
            )}
            {profileError && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-455 rounded-xl text-xs font-semibold">
                {profileError}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-800 focus:border-primary-500 rounded-xl text-slate-250 focus:outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-800 focus:border-primary-500 rounded-xl text-slate-250 focus:outline-none transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Email Address (Unchangeable)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-950/40 border border-slate-900/80 rounded-xl text-slate-500 focus:outline-none text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-indigo-650 hover:from-primary-500 hover:to-indigo-550 text-white rounded-xl text-xs font-semibold shadow-lg shadow-primary-500/10 transition-all duration-200 disabled:opacity-50"
                >
                  {isUpdatingProfile ? <LoadingSpinner size="sm" /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </Card>

          {/* Change Password Form */}
          <Card title="Security Credentials" subtitle="Update your account login password.">
            {passwordSuccess && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 rounded-xl text-xs font-semibold flex items-center gap-1.5 animate-in fade-in">
                <Check className="w-4 h-4" />
                <span>Password changed successfully!</span>
              </div>
            )}
            {passwordError && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-455 rounded-xl text-xs font-semibold">
                {passwordError}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Key className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-900/60 border border-slate-800 focus:border-primary-500 rounded-xl text-slate-200 focus:outline-none transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Key className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="•••••••• (Min 8 chars)"
                    minLength={8}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-900/60 border border-slate-800 focus:border-primary-500 rounded-xl text-slate-200 focus:outline-none transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Key className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-900/60 border border-slate-800 focus:border-primary-500 rounded-xl text-slate-200 focus:outline-none transition-all text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-indigo-650 hover:from-primary-500 hover:to-indigo-550 text-white rounded-xl text-xs font-semibold shadow-lg shadow-primary-500/10 transition-all duration-200 disabled:opacity-50"
                >
                  {isChangingPassword ? <LoadingSpinner size="sm" /> : 'Change Password'}
                </button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
