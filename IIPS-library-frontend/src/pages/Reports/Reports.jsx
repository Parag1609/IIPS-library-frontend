import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Book, Users, TrendingUp, FileText, DollarSign, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api/reports'; // Adjust to your API URL

const ReportsApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [reportData, setReportData] = useState(null);
  
  // Date filters
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardData();
    }
  }, [activeTab]);

  const fetchData = async (endpoint, params = {}) => {
    setLoading(true);
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${API_BASE}${endpoint}${queryString ? '?' + queryString : ''}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Adjust based on your auth
        }
      });
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    const data = await fetchData('/dashboard');
    setDashboardData(data);
  };

  const fetchReport = async (endpoint, params) => {
    const data = await fetchData(endpoint, params);
    setReportData(data);
  };

  // Dashboard Stats Cards
  const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <Icon className="text-gray-300" size={48} />
      </div>
    </div>
  );

  // Dashboard View
  const DashboardView = () => {
    if (!dashboardData) return <div className="text-center py-8">Loading...</div>;

    const bookStatusData = [
      { name: 'Available', value: dashboardData.books.available },
      { name: 'Issued', value: dashboardData.books.issued },
      { name: 'Lost', value: dashboardData.books.lost },
      { name: 'Write-off', value: dashboardData.books.write_off }
    ];

    const memberTypeData = [
      { name: 'Students', value: dashboardData.members.byType.student },
      { name: 'Faculty', value: dashboardData.members.byType.faculty },
      { name: 'Special', value: dashboardData.members.byType.special }
    ];

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Book} title="Total Books" value={dashboardData.books.total} 
            subtitle={`${dashboardData.books.available} available`} color="#3b82f6" />
          <StatCard icon={Users} title="Total Members" value={dashboardData.members.total} 
            subtitle={`${dashboardData.members.active} active`} color="#10b981" />
          <StatCard icon={TrendingUp} title="Active Transactions" value={dashboardData.transactions.active} 
            subtitle="Currently issued" color="#f59e0b" />
          <StatCard icon={AlertCircle} title="Lost Books" value={dashboardData.books.lost} 
            subtitle={`${dashboardData.books.write_off} write-off`} color="#ef4444" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Book Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={bookStatusData} cx="50%" cy="50%" labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100} fill="#8884d8" dataKey="value">
                  {bookStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Members by Type</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={memberTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  // Transaction Reports View
  const TransactionReportsView = () => {
    const [reportType, setReportType] = useState('daily');

    const handleFetchReport = () => {
      switch (reportType) {
        case 'daily':
          fetchReport('/transactions/daily', { date: selectedDate });
          break;
        case 'weekly':
          fetchReport('/transactions/weekly', { startDate: selectedDate });
          break;
        case 'monthly':
          fetchReport('/transactions/monthly', { year: selectedYear, month: selectedMonth });
          break;
        case 'custom':
          if (startDate && endDate) {
            fetchReport('/transactions/custom', { startDate, endDate });
          }
          break;
      }
    };

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Transaction Reports</h2>

        {/* Report Type Selector */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Report Type</label>
              <select value={reportType} onChange={(e) => setReportType(e.target.value)}
                className="w-full p-2 border rounded">
                <option value="daily">Daily Report</option>
                <option value="weekly">Weekly Report</option>
                <option value="monthly">Monthly Report</option>
                <option value="custom">Custom Date Range</option>
              </select>
            </div>

            {reportType === 'daily' && (
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-2 border rounded" />
              </div>
            )}

            {reportType === 'weekly' && (
              <div>
                <label className="block text-sm font-medium mb-2">Week Start Date</label>
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-2 border rounded" />
              </div>
            )}

            {reportType === 'monthly' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Year</label>
                  <input type="number" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Month</label>
                  <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full p-2 border rounded">
                    {[...Array(12)].map((_, i) => (
                      <option key={i} value={i + 1}>{new Date(2000, i).toLocaleString('default', { month: 'long' })}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {reportType === 'custom' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Start Date</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">End Date</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 border rounded" />
                </div>
              </>
            )}
          </div>

          <button onClick={handleFetchReport} disabled={loading}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400">
            {loading ? 'Loading...' : 'Generate Report'}
          </button>
        </div>

        {/* Report Results */}
        {reportData && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Books Issued</p>
                    <p className="text-3xl font-bold text-blue-600">{reportData.issued?.count || 0}</p>
                  </div>
                  <Book className="text-blue-300" size={40} />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Books Returned</p>
                    <p className="text-3xl font-bold text-green-600">{reportData.returned?.count || 0}</p>
                  </div>
                  <CheckCircle className="text-green-300" size={40} />
                </div>
              </div>

              {reportData.averages && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Avg. Per Day</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {reportData.averages.issuedPerDay} / {reportData.averages.returnedPerDay}
                      </p>
                      <p className="text-xs text-gray-400">Issued / Returned</p>
                    </div>
                    <TrendingUp className="text-purple-300" size={40} />
                  </div>
                </div>
              )}
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Issued Books</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Member</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Book</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Accession No</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Type</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reportData.issued?.transactions?.slice(0, 10).map((txn, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2 text-sm">{txn.member?.name || 'N/A'}</td>
                        <td className="px-4 py-2 text-sm">{txn.book?.title || 'N/A'}</td>
                        <td className="px-4 py-2 text-sm">{txn.book?.accession_number || 'N/A'}</td>
                        <td className="px-4 py-2 text-sm">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {txn.member?.memberType || 'N/A'}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm">{new Date(txn.issueDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Book Reports View
  const BookReportsView = () => {
    const [bookReportType, setBookReportType] = useState('most-issued');

    useEffect(() => {
      fetchReport(`/books/${bookReportType}`, bookReportType === 'most-issued' ? { limit: 10 } : {});
    }, [bookReportType]);

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Book Reports</h2>

        <div className="bg-white rounded-lg shadow-md p-6">
          <label className="block text-sm font-medium mb-2">Report Type</label>
          <select value={bookReportType} onChange={(e) => setBookReportType(e.target.value)}
            className="w-full p-2 border rounded max-w-md">
            <option value="most-issued">Most Issued Books</option>
            <option value="by-status">Books by Status</option>
            <option value="lost">Lost Books Report</option>
            <option value="writeOff">Write-off Books Report</option>
          </select>
        </div>

        {reportData && bookReportType === 'most-issued' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Top 10 Most Issued Books</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={reportData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="title" type="category" width={200} />
                <Tooltip />
                <Bar dataKey="issueCount" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {reportData && (bookReportType === 'lost' || bookReportType === 'writeOff') && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Total Books</p>
                <p className="text-3xl font-bold text-red-600">
                  {reportData.totalLost || reportData.totalWriteOff || 0}
                </p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-3xl font-bold text-red-600">₹{reportData.totalValue?.toLocaleString() || 0}</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Accession No</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Title</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Author</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reportData.books?.map((book, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2 text-sm">{book.accession_number}</td>
                      <td className="px-4 py-2 text-sm">{book.title}</td>
                      <td className="px-4 py-2 text-sm">{book.author_name}</td>
                      <td className="px-4 py-2 text-sm">₹{book.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Member Reports View
  const MemberReportsView = () => {
    const [memberReportType, setMemberReportType] = useState('by-type');

    useEffect(() => {
      fetchReport(`/members/${memberReportType}`);
    }, [memberReportType]);

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Member Reports</h2>

        <div className="bg-white rounded-lg shadow-md p-6">
          <label className="block text-sm font-medium mb-2">Report Type</label>
          <select value={memberReportType} onChange={(e) => setMemberReportType(e.target.value)}
            className="w-full p-2 border rounded max-w-md">
            <option value="by-type">Members by Type</option>
            <option value="by-course">Members by Course</option>
            <option value="by-year">Members by Year</option>
            <option value="inactive">Inactive Members</option>
          </select>
        </div>

        {reportData && memberReportType !== 'inactive' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={reportData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" name="Total" />
                {reportData[0]?.active !== undefined && <Bar dataKey="active" fill="#10b981" name="Active" />}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {reportData && memberReportType === 'inactive' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">
              Total Inactive Members: {reportData.totalInactive}
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Member No</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Type</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Mobile</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Year</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reportData.members?.map((member, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2 text-sm">{member.name}</td>
                      <td className="px-4 py-2 text-sm">{member.memberNumber}</td>
                      <td className="px-4 py-2 text-sm">{member.memberType}</td>
                      <td className="px-4 py-2 text-sm">{member.mobile}</td>
                      <td className="px-4 py-2 text-sm">{member.yearOfJoining}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Financial Reports View
  const FinancialReportsView = () => {
    useEffect(() => {
      fetchReport('/financial/book-value');
    }, []);

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Financial Reports</h2>

        {reportData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Value</p>
                    <p className="text-3xl font-bold text-green-600">
                      ₹{reportData.overall?.totalValue?.toLocaleString() || 0}
                    </p>
                  </div>
                  <DollarSign className="text-green-300" size={40} />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Books</p>
                    <p className="text-3xl font-bold text-blue-600">{reportData.overall?.totalBooks || 0}</p>
                  </div>
                  <Book className="text-blue-300" size={40} />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Average Value</p>
                    <p className="text-3xl font-bold text-purple-600">
                      ₹{reportData.overall?.averageValue?.toFixed(2) || 0}
                    </p>
                  </div>
                  <TrendingUp className="text-purple-300" size={40} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Value by Status</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={reportData.byStatus} cx="50%" cy="50%" labelLine={false}
                      label={({ _id, totalValue }) => `${_id}: ₹${totalValue.toLocaleString()}`}
                      outerRadius={100} fill="#8884d8" dataKey="totalValue">
                      {reportData.byStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Top Suppliers by Value</h3>
                <div className="space-y-3">
                  {reportData.bySupplier?.slice(0, 5).map((supplier, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="font-medium">{supplier._id}</span>
                      <div className="text-right">
                        <p className="font-bold text-green-600">₹{supplier.totalValue.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{supplier.count} books</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'transactions', label: 'Transactions', icon: Clock },
    { id: 'books', label: 'Books', icon: Book },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'financial', label: 'Financial', icon: DollarSign }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-gray-900">Library Reports System</h1>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex space-x-2 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}>
                <Icon size={20} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        {!loading && (
          <>
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'transactions' && <TransactionReportsView />}
            {activeTab === 'books' && <BookReportsView />}
            {activeTab === 'members' && <MemberReportsView />}
            {activeTab === 'financial' && <FinancialReportsView />}
          </>
        )}
      </div>
    </div>
  );
};

export default ReportsApp;