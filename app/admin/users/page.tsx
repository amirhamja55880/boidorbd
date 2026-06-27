'use client';
import { useState, useEffect } from 'react';
import { Search, Shield, ShieldOff, UserCheck, X } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/users');
      setUsers(res.data.users || []);
    } catch { toast.error('লোড হয়নি!'); }
    finally { setLoading(false); }
  };

  const handleBlock = async (id: string, isBlocked: boolean) => {
    try {
      await api.patch(`/api/users/${id}/block`, { is_blocked: !isBlocked });
      toast.success(!isBlocked ? 'User Block হয়েছে!' : 'User Unblock হয়েছে!');
      fetchUsers();
      if (selectedUser?.id === id) {
        setSelectedUser({ ...selectedUser, is_blocked: !isBlocked });
      }
    } catch { toast.error('সমস্যা হয়েছে!'); }
  };

  const handleRoleChange = async (id: string, role: string) => {
    try {
      await api.patch(`/api/users/${id}/role`, { role });
      toast.success(`Role "${role}" করা হয়েছে!`);
      fetchUsers();
      if (selectedUser?.id === id) {
        setSelectedUser({ ...selectedUser, role });
      }
    } catch { toast.error('সমস্যা হয়েছে!'); }
  };

  const filteredUsers = users.filter(u =>
    !search ||
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">👥 User Management</h1>
        <p className="text-gray-400 text-sm mt-1">সব Users দেখুন, Block/Unblock করুন</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input type="text" placeholder="নাম বা Email দিয়ে খুঁজুন..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-xl focus:outline-none focus:border-blue-500 placeholder-gray-500" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'মোট Users', value: users.length, color: 'text-blue-400' },
          { label: 'Active', value: users.filter(u => !u.is_blocked).length, color: 'text-green-400' },
          { label: 'Blocked', value: users.filter(u => u.is_blocked).length, color: 'text-red-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-gray-400 text-xs mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-semibold">User</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-semibold">Role</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-semibold">Plan</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-semibold">Status</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-semibold">Join Date</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-500">লোড হচ্ছে...</td></tr>
              ) : filteredUsers.length > 0 ? filteredUsers.map(user => (
                <tr key={user.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-blue-600 flex items-center justify-center text-white text-sm font-black flex-shrink-0">
                        {user.avatar ? (
                          <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                        ) : user.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{user.name}</p>
                        <p className="text-gray-500 text-xs">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      user.role === 'admin'
                        ? 'bg-purple-900/30 text-purple-400'
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      user.subscription_type === 'premium'
                        ? 'bg-yellow-900/30 text-yellow-400'
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      {user.subscription_type}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      user.is_blocked
                        ? 'bg-red-900/30 text-red-400'
                        : 'bg-green-900/30 text-green-400'
                    }`}>
                      {user.is_blocked ? '🚫 Blocked' : '✅ Active'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-sm">
                    {new Date(user.created_at).toLocaleDateString('bn-BD')}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedUser(user)}
                        className="p-2 bg-blue-900/30 text-blue-400 rounded-lg hover:bg-blue-900/50 transition-colors">
                        <UserCheck className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleBlock(user.id, user.is_blocked)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.is_blocked
                            ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50'
                            : 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                        }`}>
                        {user.is_blocked ? <Shield className="w-4 h-4" /> : <ShieldOff className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={6} className="text-center py-10 text-gray-500">কোনো User নেই</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-gray-700">
              <h2 className="font-black text-white">👤 User Details</h2>
              <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-blue-600 flex items-center justify-center text-white text-2xl font-black">
                  {selectedUser.avatar ? (
                    <img src={selectedUser.avatar} alt="" className="w-full h-full object-cover" />
                  ) : selectedUser.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-black text-lg">{selectedUser.name}</p>
                  <p className="text-gray-400 text-sm">{selectedUser.email}</p>
                  <p className="text-gray-500 text-xs">{selectedUser.phone || 'Phone নেই'}</p>
                </div>
              </div>

              {/* Info */}
              <div className="bg-gray-700/50 rounded-xl p-4 space-y-2">
                {[
                  { label: 'Role', value: selectedUser.role },
                  { label: 'Plan', value: selectedUser.subscription_type },
                  { label: 'Status', value: selectedUser.is_blocked ? '🚫 Blocked' : '✅ Active' },
                  { label: 'Verified', value: selectedUser.is_verified ? '✅ হ্যাঁ' : '❌ না' },
                  { label: 'Join Date', value: new Date(selectedUser.created_at).toLocaleDateString('bn-BD') },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-gray-400 text-sm">{item.label}:</span>
                    <span className="text-white font-semibold text-sm">{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Role Change */}
              <div>
                <p className="text-gray-400 text-xs font-semibold mb-2">Role পরিবর্তন:</p>
                <div className="flex gap-2">
                  {['student', 'admin'].map(role => (
                    <button key={role} onClick={() => handleRoleChange(selectedUser.id, role)}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
                        selectedUser.role === role
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}>
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Block/Unblock */}
              <button onClick={() => handleBlock(selectedUser.id, selectedUser.is_blocked)}
                className={`w-full py-3 rounded-xl font-bold transition-colors ${
                  selectedUser.is_blocked
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}>
                {selectedUser.is_blocked ? '✅ Unblock করুন' : '🚫 Block করুন'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}