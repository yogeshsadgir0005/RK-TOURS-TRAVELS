import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import DataTable from '../components/DataTable';
import Loader from '../components/Loader';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      // Assuming a backend route exists to fetch all users for admin
      const res = await axiosInstance.get('/admin/users');
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axiosInstance.delete(`/admin/users/${id}`);
        fetchUsers();
      } catch (error) {
        alert('Delete failed');
      }
    }
  };

  const columns = [
    { header: 'Name', accessor: (row) => row.name },
    { header: 'Email', accessor: (row) => row.email },
    { header: 'Phone', accessor: (row) => row.phone || 'N/A' },
    { header: 'Role', accessor: (row) => (
      <span className={`px-2 py-1 rounded text-xs font-bold ${row.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
        {row.role.toUpperCase()}
      </span>
    )},
    { header: 'Verified', accessor: (row) => row.isVerified ? 'Yes' : 'No' }
  ];

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Manage Users</h2>
      <DataTable columns={columns} data={users} onDelete={handleDelete} />
    </div>
  );
};
export default Users;