import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/layout/AdminLayout.jsx';
import Avatar from '../../components/common/Avatar.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../utils/api.js';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null); // user being confirmed for deletion

  const fetchUsers = useCallback(() => {
    setLoading(true);
    api.get('/admin/users', { params: { page, q: search } })
      .then(({ data }) => {
        setUsers(data.users);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => setPage(1), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleRoleToggle = async (targetUser) => {
    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    try {
      await api.put(`/admin/users/${targetUser._id}/role`, { role: newRole });
      setUsers((prev) => prev.map((u) => u._id === targetUser._id ? { ...u, role: newRole } : u));
      toast.success(`${targetUser.name} is now ${newRole === 'admin' ? 'an admin' : 'a regular user'}`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (targetUser) => {
    try {
      await api.delete(`/admin/users/${targetUser._id}`);
      setUsers((prev) => prev.filter((u) => u._id !== targetUser._id));
      setTotal((t) => t - 1);
      toast.success(`${targetUser.name} was deleted`);
      setConfirmDelete(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <AdminLayout>
      {/* Search */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="relative max-w-sm w-full">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-textSecondary"
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="input-field pl-9 py-2.5 text-sm"
          />
        </div>
        <p className="text-sm text-brand-textSecondary">
          {total} user{total !== 1 ? 's' : ''} total
        </p>
      </div>

      {/* Table */}
      <div className="card-surface overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : users.length === 0 ? (
          <p className="text-center text-brand-textSecondary py-16">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-border/50 text-left">
                  <th className="px-5 py-3 text-xs font-medium text-brand-textSecondary uppercase tracking-wider">User</th>
                  <th className="px-5 py-3 text-xs font-medium text-brand-textSecondary uppercase tracking-wider hidden sm:table-cell">Joined</th>
                  <th className="px-5 py-3 text-xs font-medium text-brand-textSecondary uppercase tracking-wider hidden md:table-cell">List Items</th>
                  <th className="px-5 py-3 text-xs font-medium text-brand-textSecondary uppercase tracking-wider">Role</th>
                  <th className="px-5 py-3 text-xs font-medium text-brand-textSecondary uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isSelf = u._id === currentUser._id;
                  return (
                    <tr key={u._id} className="border-b border-brand-border/30 last:border-0 hover:bg-brand-surfaceHover/50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar user={u} size="sm" />
                          <div className="min-w-0">
                            <p className="font-medium text-brand-textPrimary truncate">
                              {u.name} {isSelf && <span className="text-brand-textSecondary text-xs">(you)</span>}
                            </p>
                            <p className="text-xs text-brand-textSecondary truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-brand-textSecondary hidden sm:table-cell whitespace-nowrap">
                        {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(u.createdAt))}
                      </td>
                      <td className="px-5 py-3 text-brand-textSecondary hidden md:table-cell">
                        {u.myList?.length ?? 0}
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => handleRoleToggle(u)}
                          disabled={isSelf}
                          className={`text-xs px-2.5 py-1 rounded-full border transition-all duration-200
                                     ${u.role === 'admin'
                                       ? 'border-brand-accent/40 text-brand-accent'
                                       : 'border-brand-border text-brand-textSecondary'
                                     } ${isSelf ? 'opacity-50 cursor-not-allowed' : 'hover:border-brand-accent hover:text-brand-accent cursor-pointer'}`}
                          title={isSelf ? "You can't change your own role" : `Make ${u.role === 'admin' ? 'regular user' : 'admin'}`}
                        >
                          {u.role === 'admin' ? 'Admin' : 'User'}
                        </button>
                      </td>
                      <td className="px-5 py-3 text-right">
                        {confirmDelete === u._id ? (
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-xs text-brand-textSecondary">Delete?</span>
                            <button
                              onClick={() => handleDelete(u)}
                              className="text-xs text-brand-danger hover:underline"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="text-xs text-brand-textSecondary hover:text-brand-textPrimary"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(u._id)}
                            disabled={isSelf}
                            className={`text-brand-textSecondary transition-colors ${
                              isSelf ? 'opacity-30 cursor-not-allowed' : 'hover:text-brand-danger'
                            }`}
                            aria-label={`Delete ${u.name}`}
                          >
                            <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </AdminLayout>
  );
};

export default AdminUsers;
