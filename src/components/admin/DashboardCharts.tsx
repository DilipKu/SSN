import React, { useEffect, useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { AdminService } from '@/src/services/AdminService';
import { Loader2, PieChart as PieChartIcon } from 'lucide-react';

const salesData = [
  { name: 'Jan', sales: 4000, orders: 240 },
  { name: 'Feb', sales: 3000, orders: 198 },
  { name: 'Mar', sales: 2000, orders: 980 },
  { name: 'Apr', sales: 2780, orders: 390 },
  { name: 'May', sales: 1890, orders: 480 },
  { name: 'Jun', sales: 2390, orders: 380 },
  { name: 'Jul', sales: 3490, orders: 430 },
];

export const SalesTrendChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState(30);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const trend = await AdminService.getSalesTrend(range);
        setData(trend);
      } catch (error) {
        console.error("Error fetching sales trend:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [range]);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">Sales Trend</h3>
        <select 
          value={range}
          onChange={(e) => setRange(Number(e.target.value))}
          className="bg-slate-50 border-none text-xs font-bold uppercase tracking-widest text-slate-500 rounded-lg px-3 py-2 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
        >
          <option value={7}>Last 7 Days</option>
          <option value={30}>Last 30 Days</option>
          <option value={90}>Last 3 Months</option>
        </select>
      </div>
      
      {loading ? (
        <div className="flex-grow flex flex-col items-center justify-center gap-2 opacity-50">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Gathering Sales Insights...</span>
        </div>
      ) : data.length > 0 ? (
        <div className="flex-grow min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10 }} 
                dx={-10}
                tickFormatter={(value) => `₹${value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value}`}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Revenue']}
              />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#1A0505" 
                strokeWidth={3} 
                dot={{ r: 3, fill: '#1A0505', strokeWidth: 2, stroke: '#fff' }} 
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center text-center space-y-2 opacity-30">
          <PieChartIcon className="h-12 w-12" />
          <p className="text-xs font-medium italic">No sales data for this period</p>
        </div>
      )}
    </div>
  );
};

export const CategoryDistribution = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const distribution = await AdminService.getCategoryDistribution();
        setData(distribution);
      } catch (error) {
        console.error("Error fetching category distribution:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-[400px] flex flex-col">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Top Categories</h3>
      
      {loading ? (
        <div className="flex-grow flex flex-col items-center justify-center gap-2 opacity-50">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Analyzing Collection...</span>
        </div>
      ) : data.length > 0 ? (
        <>
          <div className="flex-grow min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 pt-4 border-t border-slate-50">
            {data.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-[10px] font-bold uppercase tracking-tight text-slate-600 truncate">{item.name}</span>
                <span className="text-[10px] font-bold text-slate-400 ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center text-center space-y-2 opacity-30">
          <PieChartIcon className="h-12 w-12" />
          <p className="text-xs font-medium italic">No data to display</p>
        </div>
      )}
    </div>
  );
};
