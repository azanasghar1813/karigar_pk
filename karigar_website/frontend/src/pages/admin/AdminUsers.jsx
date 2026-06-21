import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShieldAlert, Trash2, Ban, UserCheck, AlertTriangle } from 'lucide-react';
import api from '../../config/api';
import { formatPhone, getTelLink } from '../../utils/format';

export default function AdminUsers() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchFilter = searchParams.get('search') || '';
  const pageFilter = parseInt(searchParams.get('page') || '1', 10);

  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Delete modal state
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = useCallback(() => {
    const params = new URLSearchParams();
    if (searchFilter) params.set('search', searchFilter);
    params.set('page', pageFilter);
    params.set('limit', '10');

    setLoading(true);
    api.get(`/admin/users?${params}`)
      .then(({ data }) => {
        if (data.data) {
          setUsers(data.data);
          setPagination({ page: data.page, pages: data.pages, total: data.total });
        } else {
          setUsers(data);
        }
      })
      .catch((error) => {
        console.error(error);
        showToastMsg('Failed to load users');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchFilter, pageFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const showToastMsg = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const setFilter = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value);
    else p.delete(key);
    
    if (key !== 'page') p.delete('page');
    setSearchParams(p);
  };

  const [searchInput, setSearchInput] = useState(searchFilter);
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilter('search', searchInput);
  };

  const handleToggleRestrict = async (id, currentStatus) => {
    if (!window.confirm(`Are you sure you want to ${currentStatus ? 'unrestrict' : 'restrict'} this user?`)) return;
    try {
      await api.put(`/admin/users/${id}/restrict`);
      showToastMsg(currentStatus ? 'User unrestricted' : 'User restricted');
      fetchUsers();
    } catch (error) {
      showToastMsg('Failed to update restriction');
    }
  };

  const handleDeleteConfirm = async () => {
    setActionLoading(true);
    try {
      await api.delete(`/admin/users/${deleteId}`);
      showToastMsg('User and all associated data deleted');
      setShowDelete(false);
      fetchUsers();
    } catch (error) {
      showToastMsg('Failed to delete user');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-slate-800 text-white text-sm px-4 py-3 rounded-lg shadow-xl">
          {toast}
        </div>
      )}

      {/* Delete Modal */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center gap-3 mb-4 text-red-500">
              <AlertTriangle size={24} />
              <h3 className="text-xl font-bold text-white">Delete User?</h3>
            </div>
            <p className="text-sm text-slate-400 mb-6">
              This action cannot be undone. It will permanently delete this user, as well as <strong>all of their past bookings and reviews</strong>.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDelete(false)}
                className="px-5 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={actionLoading}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium disabled:opacity-50 flex items-center gap-2"
              >
                <Trash2 size={16} />
                {actionLoading ? 'Deleting...' : 'Delete Completely'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white font-poppins">Manage Customers</h1>
        <p className="text-slate-400 text-sm mt-1">Restrict accounts or permanently delete user data.</p>
      </div>

      {/* Search */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <input 
            type="text" 
            placeholder="Search name, phone, email..." 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-secondary flex-1 max-w-md"
          />
          <button type="submit" className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            Search
          </button>
        </form>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
              <tr>
                <th className="px-6 py-4">Customer Details</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8">
                    <div className="flex justify-center"><div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin" /></div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No customers found.</td>
                </tr>
              ) : (
                users.map(u => (
                  <tr key={u._id} className="border-t border-slate-800 hover:bg-slate-800/20">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{u.fullName}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{u.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      {u.phone ? (
                        <a href={getTelLink(u.phone)} className="hover:text-orange-400 transition-colors">
                          {formatPhone(u.phone)}
                        </a>
                      ) : '—'}
                    </td>
                    <td className="px-6 py-4">
                      {u.isRestricted ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                          <Ban size={12} /> Restricted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <UserCheck size={12} /> Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleToggleRestrict(u._id, u.isRestricted)}
                          className={`text-xs font-medium flex items-center gap-1.5 hover:underline ${
                            u.isRestricted ? 'text-emerald-400 hover:text-emerald-300' : 'text-amber-400 hover:text-amber-300'
                          }`}
                        >
                          {u.isRestricted ? <UserCheck size={14} /> : <Ban size={14} />}
                          {u.isRestricted ? 'Unrestrict' : 'Restrict'}
                        </button>
                        
                        <div className="w-px h-4 bg-slate-700" />

                        <button
                          onClick={() => { setDeleteId(u._id); setShowDelete(true); }}
                          className="text-xs font-medium flex items-center gap-1.5 text-red-400 hover:text-red-300 hover:underline"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-slate-950/50">
            <span className="text-sm text-slate-500">
              Showing page {pagination.page} of {pagination.pages} ({pagination.total} total)
            </span>
            <div className="flex gap-2">
              <button 
                disabled={pagination.page <= 1}
                onClick={() => setFilter('page', (pagination.page - 1).toString())}
                className="px-3 py-1 rounded bg-slate-800 text-slate-300 text-sm disabled:opacity-50 hover:bg-slate-700"
              >
                Prev
              </button>
              <button 
                disabled={pagination.page >= pagination.pages}
                onClick={() => setFilter('page', (pagination.page + 1).toString())}
                className="px-3 py-1 rounded bg-slate-800 text-slate-300 text-sm disabled:opacity-50 hover:bg-slate-700"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
