const ReportsApp = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [reportData, setReportData] = useState(null);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

  useEffect(() => {
    if (activeTab === "dashboard") {
      (async () => {
        setLoading(true);
        try {
          const data = await getDashboardStats();
          setDashboardData(data.data);
        } catch (err) {
          console.error("Dashboard load failed:", err);
        } finally {
          setLoading(false);
        }
      })();
    }
    console.log(activeTab,"act");
  }, [activeTab]);

  // Memoize handleFetchReport to prevent recreating on every render
  const handleFetchReport = useCallback(async (fetchFn, ...params) => {
    setLoading(true);
    try {
      const response =await fetchFn(...params);
      setReportData(response.data);
    } catch (err) {
      console.error("Error fetching report:", err);
    } finally {
      setLoading(false);
      console.log(reportData,"reportdata")
    }
  }, []);

  const StatCard = ({ icon: Icon, title, value, subtitle, color, gradient }) => (
    <div className={`relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${gradient}`}>
      <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8">
        <div className="absolute inset-0 bg-white opacity-10 rounded-full"></div>
      </div>
      <div className="relative p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-white text-sm font-medium opacity-90 mb-1">{title}</p>
            <p className="text-white text-4xl font-bold mb-2">{value}</p>
            {subtitle && <p className="text-white text-xs opacity-75">{subtitle}</p>}
          </div>
          <div className="bg-white bg-opacity-20 rounded-full p-4">
            <Icon className="text-white" size={32} />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white opacity-20"></div>
    </div>
  );

  const DashboardView = () => {
    if (!dashboardData) return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );

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
      <div className="space-y-8 animate-fadeIn">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-800">Dashboard Overview</h2>
          <button className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg">
            <Download size={18} />
            <span>Export Report</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon={Book} 
            title="Total Books" 
            value={dashboardData.books.total} 
            subtitle={`${dashboardData.books.available} available`} 
            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <StatCard 
            icon={Users} 
            title="Total Members" 
            value={dashboardData.members.total} 
            subtitle={`${dashboardData.members.active} active`} 
            gradient="bg-gradient-to-br from-green-500 to-green-600"
          />
          <StatCard 
            icon={TrendingUp} 
            title="Active Transactions" 
            value={dashboardData.transactions.active} 
            subtitle="Currently issued" 
            gradient="bg-gradient-to-br from-amber-500 to-amber-600"
          />
          <StatCard 
            icon={AlertCircle} 
            title="Lost Books" 
            value={dashboardData.books.lost} 
            subtitle={`${dashboardData.books.write_off} write-off`} 
            gradient="bg-gradient-to-br from-red-500 to-red-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Book Status Distribution</h3>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie 
                  data={bookStatusData} 
                  cx="50%" 
                  cy="50%" 
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={110} 
                  fill="#8884d8" 
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {bookStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Members by Type</h3>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={memberTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="value" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const TransactionReportsView = () => {
    const [reportType, setReportType] = useState("daily");
    useEffect(() => {
     console.log("Effect running");

  return () => {
    setReportData(null);
    console.log("Cleanup when component unmounts or before re-run");
  };
}, []);


    const generateReport = () => {
      console.log(reportData,"rd")
      switch (reportType) {
        case "daily":
          handleFetchReport(getDailyTransactions, selectedDate);
          break;
        case "weekly":
          handleFetchReport(getWeeklyTransactions, selectedDate);
          break;
        case "monthly":
          handleFetchReport(getMonthlyTransactions, selectedYear, selectedMonth);
          break;
        case "custom":
          if (startDate && endDate) {
            handleFetchReport(getCustomRangeTransactions, startDate, endDate);
          }
          break;
      }
    };

    return (
      <div className="space-y-6 animate-fadeIn">
        <h2 className="text-3xl font-bold text-gray-800">Transaction Reports</h2>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Report Type</label>
              <select 
                value={reportType} 
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
              >
                <option value="daily">Daily Report</option>
                <option value="weekly">Weekly Report</option>
                <option value="monthly">Monthly Report</option>
                <option value="custom">Custom Date Range</option>
              </select>
            </div>

            {reportType === 'daily' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                <input 
                  type="date" 
                  value={selectedDate} 
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                />
              </div>
            )}

            {reportType === 'weekly' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Week Start Date</label>
                <input 
                  type="date" 
                  value={selectedDate} 
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                />
              </div>
            )}

            {reportType === 'monthly' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
                  <input 
                    type="number" 
                    value={selectedYear} 
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Month</label>
                  <select 
                    value={selectedMonth} 
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i} value={i + 1}>
                        {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {reportType === 'custom' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                  <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                  <input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                  />
                </div>
              </>
            )}
          </div>

          <button 
            onClick={generateReport} 
            disabled={loading}
            className="mt-6 w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Generate Report'}
          </button>
        </div>

        {reportData && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium mb-1">Books Issued</p>
                    <p className="text-4xl font-bold">{reportData.issued?.count || 0}</p>
                  </div>
                  <Book className="text-blue-200" size={48} />
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium mb-1">Books Returned</p>
                    <p className="text-4xl font-bold">{reportData.returned?.count || 0}</p>
                  </div>
                  <CheckCircle className="text-green-200" size={48} />
                </div>
              </div>

              {reportData.averages && (
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium mb-1">Avg. Per Day</p>
                      <p className="text-2xl font-bold">
                        {reportData.averages.issuedPerDay} / {reportData.averages.returnedPerDay}
                      </p>
                      <p className="text-xs text-purple-100 mt-1">Issued / Returned</p>
                    </div>
                    <TrendingUp className="text-purple-200" size={48} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const BookReportsView = () => {
    const [bookReportType, setBookReportType] = useState("most-issued");


    const generateReport = () => {
      switch (bookReportType) {
        case "most-issued":
          handleFetchReport(getMostIssuedBooks, 10);
          break;
        case "by-status":
          handleFetchReport(getBooksByStatus);
          break;
        case "lost":
          handleFetchReport(getLostBooksReport);
          break;
        case "writeOff":
          handleFetchReport(getWriteOffBooksReport);
          break;
    };
  }


    return (
      <div className="space-y-6 animate-fadeIn">
        <h2 className="text-3xl font-bold text-gray-800">Book Reports</h2>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Report Type</label>
          <select 
            value={bookReportType} 
            onChange={(e) => setBookReportType(e.target.value)}
            className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
          >
            <option value="most-issued">Most Issued Books</option>
            <option value="by-status">Books by Status</option>
            <option value="lost">Lost Books Report</option>
            <option value="writeOff">Write-off Books Report</option>
          </select>
          <button 
            onClick={generateReport} 
            disabled={loading}
            className="mt-6 w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Generate Report'}
          </button>
        </div>

        {reportData && bookReportType === 'most-issued' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Top 10 Most Issued Books</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={reportData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#6b7280" />
                <YAxis dataKey="title" type="category" width={200} stroke="#6b7280" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="issueCount" fill="url(#barGradient)" radius={[0, 8, 8, 0]} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#60a5fa" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {reportData && (bookReportType === 'lost' || bookReportType === 'writeOff') && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border-l-4 border-red-500">
                <p className="text-sm text-gray-600 font-medium mb-2">Total Books</p>
                <p className="text-4xl font-bold text-red-600">
                  {reportData.totalLost || reportData.totalWriteOff || 0}
                </p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border-l-4 border-red-500">
                <p className="text-sm text-gray-600 font-medium mb-2">Total Value</p>
                <p className="text-4xl font-bold text-red-600">
                  ₹{reportData.totalValue?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const MemberReportsView = () => {
    const [memberReportType, setMemberReportType] = useState("by-type");

    const generateReport = () => {
     switch (memberReportType) {
        case "by-type":
          handleFetchReport(getMembersByType);
          break;
        case "by-course":
          handleFetchReport(getMembersByCourse);
          break;
        case "by-year":
          handleFetchReport(getMembersByYear);
          break;
        case "inactive":
          handleFetchReport(getInactiveMembersReport);
          break;
      }
  }

    return (
      <div className="space-y-6 animate-fadeIn">
        <h2 className="text-3xl font-bold text-gray-800">Member Reports</h2>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Report Type</label>
          <select 
            value={memberReportType} 
            onChange={(e) => setMemberReportType(e.target.value)}
            className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
          >
            <option value="by-type">Members by Type</option>
            <option value="by-course">Members by Course</option>
            <option value="by-year">Members by Year</option>
            <option value="inactive">Inactive Members</option>
          </select>
          <button 
            onClick={generateReport} 
            disabled={loading}
            className="mt-6 w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Generate Report'}
          </button>
        </div>

        {reportData && memberReportType !== 'inactive' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={reportData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="_id" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" name="Total" radius={[8, 8, 0, 0]} />
                {reportData[0]?.active !== undefined && (
                  <Bar dataKey="active" fill="#10b981" name="Active" radius={[8, 8, 0, 0]} />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {reportData && memberReportType === 'inactive' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                Total Inactive Members: <span className="text-amber-600">{reportData.totalInactive}</span>
              </h3>
            </div>
          </div>
        )}
      </div>
    );
  };

  const FinancialReportsView = () => {
    useEffect(() => {
      handleFetchReport(getBookValueReport);
      console.log("financial report loaded");
    }, []);

    return (
      <div className="space-y-6 animate-fadeIn">
        <h2 className="text-3xl font-bold text-gray-800">Financial Reports</h2>

        {reportData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium mb-1">Total Value</p>
                    <p className="text-4xl font-bold">
                      ₹{reportData.overall?.totalValue?.toLocaleString() || 0}
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-full p-4">
                    <DollarSign className="text-white" size={40} />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium mb-1">Total Books</p>
                    <p className="text-4xl font-bold">{reportData.overall?.totalBooks || 0}</p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-full p-4">
                    <Book className="text-white" size={40} />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium mb-1">Average Value</p>
                    <p className="text-4xl font-bold">
                      ₹{reportData.overall?.averageValue?.toFixed(2) || 0}
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-full p-4">
                    <TrendingUp className="text-white" size={40} />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Value by Status</h3>
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie 
                      data={reportData.byStatus} 
                      cx="50%" 
                      cy="50%" 
                      labelLine={false}
                      label={({ _id, totalValue }) => `${_id}: ₹${totalValue.toLocaleString()}`}
                      outerRadius={110} 
                      fill="#8884d8" 
                      dataKey="totalValue"
                      animationBegin={0}
                      animationDuration={800}
                    >
                      {reportData.byStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => `₹${value.toLocaleString()}`} 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Top Suppliers by Value</h3>
                <div className="space-y-4">
                  {reportData.bySupplier?.slice(0, 5).map((supplier, idx) => (
                    <div 
                      key={idx} 
                      className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-blue-100 transition-all border border-gray-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                          {idx + 1}
                        </div>
                        <span className="font-semibold text-gray-800">{supplier._id}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600 text-lg">₹{supplier.totalValue.toLocaleString()}</p>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">Library Reports System</h1>
              <p className="text-blue-100">Comprehensive analytics and insights</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                <p className="text-blue-100 text-xs">Last Updated</p>
                <p className="text-white font-semibold">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl whitespace-nowrap font-semibold transition-all transform hover:scale-105 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                }`}
              >
                <Icon size={20} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {loading && (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Book className="text-blue-600" size={32} />
              </div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Loading report data...</p>
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

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ReportsApp;