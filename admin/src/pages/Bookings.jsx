import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import DataTable from '../components/DataTable';
import Loader from '../components/Loader';
import { FiAlertCircle, FiX } from 'react-icons/fi';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [pendingAction, setPendingAction] = useState({ id: null, status: '' });

  const fetchBookings = async () => {
    try {
      const res = await axiosInstance.get('/admin/bookings');
      setBookings(res.data);
    } catch (error) { 
      console.error(error); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { 
    fetchBookings(); 
  }, []);

  const handleActionClick = (id, status) => {
    setPendingAction({ id, status });
    setShowModal(true);
  };

  const confirmStatusUpdate = async () => {
    try {
      await axiosInstance.put(`/bookings/${pendingAction.id}/status`, { status: pendingAction.status });
      setShowModal(false);
      fetchBookings();
    } catch (error) { 
      alert('Status update failed'); 
    }
  };

  const columns = [
    { header: 'ID', accessor: (row) => row._id.substring(row._id.length - 6).toUpperCase() },
    { header: 'User', accessor: (row) => row.passengerDetails?.name || 'N/A' },
    { header: 'Route', accessor: (row) => `${row.pickup?.city} → ${row.destination?.city}` },
    { header: 'Date', accessor: (row) => new Date(row.journeyDate).toLocaleDateString() },
    { header: 'Price', accessor: (row) => (
      <span className="font-bold text-black">
        ₹{row.totalFare || row.price || '0'}
      </span>
    )},
    { header: 'Status', accessor: (row) => (
      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
        row.status === 'Completed' ? 'bg-green-100 text-green-800' :
        row.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
        row.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
        'bg-red-100 text-red-800'
      }`}>
        {row.status}
      </span>
    )},
    { header: 'Actions', accessor: (row) => {
      if (row.status === 'Pending') {
        return (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handleActionClick(row._id, 'Approved')} 
              className="bg-black text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-neutral-800 transition-colors"
            >
              Accept
            </button>
            <button 
              onClick={() => handleActionClick(row._id, 'Cancelled')} 
              className="bg-white border border-gray-300 text-red-600 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-red-50 transition-colors"
            >
              Reject
            </button>
          </div>
        );
      }
      
      if (row.status === 'Approved') {
        return (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handleActionClick(row._id, 'Completed')} 
              className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700 transition-colors"
            >
              Complete
            </button>
            <button 
              onClick={() => handleActionClick(row._id, 'Cancelled')} 
              className="bg-white border border-gray-300 text-gray-600 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        );
      }

      return <span className="text-gray-400 text-xs italic font-medium px-2">No actions available</span>;
    }}
  ];

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 px-4 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-extrabold text-black tracking-tight">Manage Bookings</h2>
        <div className="text-sm font-medium text-gray-500">Total: {bookings.length}</div>
      </div>
      
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <DataTable columns={columns} data={bookings} />
      </div>

      {/* CUSTOM CONFIRMATION MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
            onClick={() => setShowModal(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95 fade-in duration-300">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="bg-gray-100 p-3 rounded-2xl text-black">
                  <FiAlertCircle size={28} />
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-black transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>

              <h3 className="text-2xl font-bold text-black mb-2 tracking-tight">Confirm Action</h3>
              <p className="text-gray-600 font-medium leading-relaxed">
                Are you sure you want to mark this booking as <span className="text-black font-bold uppercase">{pendingAction.status}</span>? 
                This action cannot be undone.
              </p>
            </div>

            <div className="bg-gray-50 p-6 flex items-center gap-3">
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 bg-white border border-gray-200 text-black py-3.5 rounded-2xl font-bold text-sm hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={confirmStatusUpdate}
                className="flex-1 bg-black text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-neutral-800 transition-all shadow-lg"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;