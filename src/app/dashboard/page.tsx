'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg('');

    try {
      const res = await api.put('/auth/profile', { name, email });
      setProfileMsg(res.data.message);
      const updatedUser = { ...user, name, email };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err: any) {
      setProfileMsg(err.response?.data?.message || 'Update failed');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
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
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to permanently delete your account?')) {
      return;
    }

    try {
      await api.delete('/auth/account');
      localStorage.clear();
      router.push('/');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Account deletion failed');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xs font-medium text-slate-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* User Card */}
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
              <h1 className="text-base font-bold text-slate-900">{user?.name}</h1>
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
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-xl transition"
            >
              Save Profile
            </button>
          </form>
        </div>

        {/* Change Password */}
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
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-xl transition"
            >
              Update Password
            </button>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-red-600 uppercase tracking-wider">Delete Account</h3>
            <p className="text-xs text-slate-500 mt-0.5">Permanently remove your account and data.</p>
          </div>
          <button
            onClick={handleDeleteAccount}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-xl transition"
          >
            Delete Account
          </button>
        </div>

      </div>
    </div>
  );
}