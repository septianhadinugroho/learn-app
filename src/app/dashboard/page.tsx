'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Visibility Toggles
  const [showCurrPass, setShowCurrPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmNewPass, setShowConfirmNewPass] = useState(false);

  // Profile Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileMsg, setProfileMsg] = useState('');

  // Password Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const localUser = localStorage.getItem('user');

    if (!token) {
      router.push('/');
      return;
    }

    if (localUser) {
      const parsed = JSON.parse(localUser);
      setUser(parsed);
      setName(parsed.name || '');
      setEmail(parsed.email || '');
    }

    setLoading(false);
  }, [router]);

  const Spinner = () => (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  const EyeIcon = ({ show, toggle }: { show: boolean; toggle: () => void }) => (
    <button
      type="button"
      onClick={toggle}
      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1 rounded-md"
    >
      {show ? (
        // Eye Off Icon
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
          <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
          <line x1="2" x2="22" y1="2" y2="22" />
        </svg>
      ) : (
        // Eye Icon
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  );

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setProfileMsg('');

    try {
      const res = await api.put('/auth/profile', { name, email });
      setProfileMsg(res.data.message);
      const updatedUser = { ...user, name, email };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err: any) {
      setProfileMsg(err.response?.data?.message || 'Update failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setPasswordMsg('');

    try {
      const res = await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
        confirmNewPassword,
      });
      setPasswordMsg(res.data.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      setPasswordMsg(err.response?.data?.message || 'Password change failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setActionLoading(true);
    try {
      await api.delete('/auth/account');
      localStorage.clear();
      router.push('/');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Account deletion failed');
      setActionLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="flex items-center space-x-2 text-slate-600 text-xs font-semibold">
          <svg className="animate-spin h-5 w-5 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading Dashboard...</span>
        </div>
      </div>
    );
  }

  // Cek apakah akun mendaftar via Google Sign-In
  const isGoogleUser = Boolean(user?.avatar || user?.googleId);

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* User Top Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-12 h-12 rounded-full border border-slate-200 object-cover" />
            ) : (
              <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-base">
                {user?.name?.charAt(0) || 'U'}
              </div>
            )}
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base font-bold text-slate-900">{user?.name}</h1>
                {isGoogleUser && (
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-semibold rounded-full border border-blue-100">
                    Google
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
          >
            Logout
          </button>
        </div>

        {/* Update Profile */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Profile Settings</h2>
          {profileMsg && (
            <div className="p-3 bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl font-medium">
              {profileMsg}
            </div>
          )}
          <form onSubmit={handleUpdateProfile} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
              />
            </div>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-xl transition disabled:opacity-50 flex items-center"
            >
              {actionLoading && <Spinner />}
              Save Profile
            </button>
          </form>
        </div>

        {/* Change Password / Google Auth Info */}
        {!isGoogleUser ? (
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Change Password</h2>
            {passwordMsg && (
              <div className="p-3 bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl font-medium">
                {passwordMsg}
              </div>
            )}
            <form onSubmit={handleChangePassword} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrPass ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
                    placeholder="••••••••"
                  />
                  <EyeIcon show={showCurrPass} toggle={() => setShowCurrPass(!showCurrPass)} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
                    placeholder="••••••••"
                  />
                  <EyeIcon show={showNewPass} toggle={() => setShowNewPass(!showNewPass)} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmNewPass ? 'text' : 'password'}
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
                    placeholder="••••••••"
                  />
                  <EyeIcon show={showConfirmNewPass} toggle={() => setShowConfirmNewPass(!showConfirmNewPass)} />
                </div>
              </div>
              <button
                type="submit"
                disabled={actionLoading}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-xl transition disabled:opacity-50 flex items-center"
              >
                {actionLoading && <Spinner />}
                Update Password
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Security</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Your account is authenticated via Google Sign-In (Passwordless).
              </p>
            </div>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-xl">
              OAuth Active
            </span>
          </div>
        )}

        {/* Danger Zone */}
        <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-red-600 uppercase tracking-wider">Delete Account</h3>
            <p className="text-xs text-slate-500 mt-0.5">Permanently remove your account and all data.</p>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-xl transition"
          >
            Delete Account
          </button>
        </div>

      </div>

      {/* CUSTOM CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 border border-slate-100 shadow-xl">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
              !
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Are you absolutely sure?</h3>
              <p className="text-xs text-slate-500 mt-1">
                This action cannot be undone. All your personal data and account details will be permanently deleted.
              </p>
            </div>
            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={actionLoading}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition flex items-center justify-center disabled:opacity-50"
              >
                {actionLoading && <Spinner />}
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}