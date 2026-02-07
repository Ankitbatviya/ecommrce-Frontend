import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import AdminNav from '../../components/admin/AdminNav'; 

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isDark, setIsDark] = useState(true);
  const navigate = useNavigate();

  const PRIMARY_ADMIN = 'ankitbatviya94@gmail.com';

  const fetchUsers = async () => {
    try {
      const token = Cookies.get('authToken');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/all`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { 
          page: currentPage, 
          limit: 10, 
          search: searchTerm, 
          role: roleFilter === 'all' ? '' : roleFilter 
        }
      });
      if (response.data.success) {
        setUsers(response.data.data || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setTotalUsers(response.data.pagination?.totalUsers || 0);
      }
    } catch (error) { 
      toast.error('Sync failed'); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchUsers(); }, [currentPage, searchTerm, roleFilter]);

  const updateUserRole = async (userId, newRole) => {
    try {
      const token = Cookies.get('authToken');
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/users/${userId}/role`, { role: newRole }, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success) { 
        toast.success('Role Updated'); 
        fetchUsers(); 
      }
    } catch (error) { 
      toast.error('Update failed'); 
    }
  };

  const deleteUser = async (userId, userEmail) => {
    if (userEmail === PRIMARY_ADMIN) return toast.error('Protected Admin');
    if (!window.confirm(`Permanent removal of this entity?`)) return;
    try {
      const token = Cookies.get('authToken');
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/${userId}`, { headers: { Authorization: `Bearer ${token}` },data: { permanent: true } });
      if (response.data.success) { 
        toast.success('Entity Removed'); 
        fetchUsers(); 
      }
    } catch (error) { 
      toast.error('Deletion error'); 
    }
  };

  const theme = isDark 
    ? { card: 'bg-[#111] border-white/5', input: 'bg-white/5 border-white/10 text-white', option: 'bg-[#1a1a1a] text-white' }
    : { card: 'bg-white border-slate-200 shadow-sm', input: 'bg-white border-slate-300 text-slate-900', option: 'bg-white text-slate-900' };

  if (loading) return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#050505]' : 'bg-slate-50'}`}>
      <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#050505] text-white' : 'bg-slate-50 text-slate-900'} transition-colors duration-500 pb-32 font-sans overflow-x-hidden`}>
      
      {/* Global Navigation Component */}
      <AdminNav isDark={isDark} setIsDark={setIsDark} />

      <main className="max-w-7xl mx-auto pt-24 px-4 animate-in slide-in-from-right-10 fade-in duration-700">
        
        {/* Laptop/Desktop Header with Back Button */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* BACK BTN FOR LAPTOP */}
            <button 
                onClick={() => navigate('/admin/dashboard')} 
                className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${isDark ? 'bg-white/5 border-white/10 text-slate-400 hover:text-amber-500' : 'bg-white border-slate-200 text-slate-600 hover:text-amber-600'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
              Dashboard
            </button>
            <div>
              <h2 className="text-3xl font-black tracking-tighter">Identity Manager</h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">User Directory & Permissions</p>
            </div>
          </div>

          {/* Mini Stats for Desktop */}
          <div className="flex gap-2">
            {[
              { l: 'Total', v: totalUsers },
              { l: 'Admins', v: users.filter(u => (u.Role || u.role) === 'admin').length },
            ].map((s, i) => (
              <div key={i} className={`${theme.card} hidden md:flex px-4 py-2 rounded-xl border flex-col items-center min-w-[80px]`}>
                <p className="text-sm font-black">{s.v}</p>
                <p className="text-[7px] uppercase font-black text-amber-500 tracking-widest">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <input
              type="text" placeholder="Search pulse..." value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className={`w-full ${theme.input} rounded-2xl py-4 px-12 text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none transition-all shadow-sm`}
            />
            <svg className="absolute left-4 top-4   w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>

          <div className="relative">
            <select 
              value={roleFilter} 
              onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
              className={`appearance-none w-full md:w-48 ${theme.input} rounded-2xl py-4 px-6 text-[11px] font-black uppercase tracking-widest cursor-pointer outline-none shadow-sm`}
            >
              <option className={theme.option} value="all">Global Access</option>
              <option className={theme.option} value="user">Customers</option>
              <option className={theme.option} value="admin">Admins</option>
              <option className={theme.option} value="partner">Partners</option>
            </select>
            <div className="absolute right-4 top-5 pointer-events-none text-amber-500">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="4" d="M19 9l-7 7-7-7"/></svg>
            </div>
          </div>
        </div>

        {/* User Table */}
        <div className={`${theme.card} rounded-[2rem] border overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-500`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className={`${isDark ? 'bg-white/5 text-slate-500' : 'bg-slate-100 text-slate-400'} text-[10px] font-black uppercase tracking-[0.2em]`}>
                  <th className="px-6 py-5">Identity</th>
                  <th className="px-6 py-5">Privilege</th>
                  <th className="px-6 py-5 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.length > 0 ? users.map((u) => {
                  const isOwner = (u.Email || u.email) === PRIMARY_ADMIN;
                  return (
                    <tr key={u._id} className="hover:bg-amber-500/[0.03] transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-black group-hover:scale-105 transition-transform">
                            {(u.Fullname || 'U').charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-black text-sm tracking-tight truncate flex items-center gap-2">
                              {u.Fullname || u.fullname}
                              {isOwner && <span className="text-[8px] bg-amber-500 text-black px-1.5 py-0.5 rounded font-black">ROOT</span>}
                            </p>
                            <p className="text-[10px] font-bold text-slate-500">{u.Email || u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="relative w-max">
                          <select
                            value={u.Role || u.role}
                            onChange={(e) => updateUserRole(u._id, e.target.value)}
                            disabled={isOwner}
                            className={`appearance-none bg-transparent ${isOwner ? 'opacity-30' : 'text-amber-500'} font-black text-[10px] uppercase tracking-widest pr-4 outline-none cursor-pointer`}
                          >
                            <option className={theme.option} value="user">User</option>
                            <option className={theme.option} value="admin">Admin</option>
                            <option className={theme.option} value="partner">Partner</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        {!isOwner ? (
                          <button 
                            onClick={() => deleteUser(u._id, u.email || u.Email)} 
                            className="p-2 text-red-500/30 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all active:scale-90"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                          </button>
                        ) : <span className="text-[9px] font-black uppercase opacity-20 italic">Secure</span>}
                      </td>
                    </tr>
                  )
                }) : (
                  <tr>
                    <td colSpan="3" className="py-20 text-center opacity-40 font-black text-xs uppercase tracking-widest">
                      No matching entities found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={`p-5 flex justify-between items-center ${isDark ? 'bg-white/[0.02]' : 'bg-slate-50'}`}>
              <button 
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(p => p - 1)} 
                className="text-[10px] font-black uppercase tracking-widest disabled:opacity-20 hover:text-amber-500 transition-colors"
              >
                Prev
              </button>
              <span className="text-[10px] font-black opacity-40 uppercase tracking-[0.3em]">Pulse {currentPage} / {totalPages}</span>
              <button 
                disabled={currentPage === totalPages} 
                onClick={() => setCurrentPage(p => p + 1)} 
                className="text-[10px] font-black uppercase tracking-widest disabled:opacity-20 hover:text-amber-500 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;