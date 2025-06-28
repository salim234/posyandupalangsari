import React, { useEffect, useState, useMemo } from 'react';
import { User, Role, Child, Article, GrowthStatus } from '../../types';
import { dataService } from '../../services/dataService';
import Card, { CardContent, CardHeader } from '../ui/Card';
import { ICONS, IconComponent } from '../../constants';
import { getGrowthStatus } from '../../utils/healthUtils';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';


const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      const [allUsers, allChildren, allArticles] = await Promise.all([
        dataService.getAllUsers(),
        dataService.getAllChildren(),
        dataService.getAllArticles(),
      ]);
      setUsers(allUsers);
      setChildren(allChildren);
      setArticles(allArticles);
      setLoading(false);
    };
    fetchAllData();
  }, []);
  
  const systemStats = useMemo(() => {
      const growthStatusCounts = children.reduce((acc, child) => {
          const status = getGrowthStatus(child);
          acc[status] = (acc[status] || 0) + 1;
          return acc;
      }, {} as Record<GrowthStatus, number>);

      return {
          admins: users.filter(u => u.role === Role.Admin).length,
          kaders: users.filter(u => u.role === Role.Kader).length,
          warga: users.filter(u => u.role === Role.Warga).length,
          totalChildren: children.length,
          childrenWithIssues: (growthStatusCounts[GrowthStatus.Underweight] || 0) + (growthStatusCounts[GrowthStatus.SevereUnderweight] || 0),
          totalArticles: articles.length,
          growthStatusData: Object.entries(growthStatusCounts).map(([name, value]) => ({name, value})).filter(d => d.name !== GrowthStatus.Unknown),
          userRoleData: [
              { name: 'Admin', value: users.filter(u => u.role === Role.Admin).length },
              { name: 'Kader', value: users.filter(u => u.role === Role.Kader).length },
              { name: 'Warga', value: users.filter(u => u.role === Role.Warga).length },
          ]
      }
  }, [users, children, articles]);

  const StatCard: React.FC<{title: string; value: number | string; icon: IconComponent; color: string}> = ({title, value, icon: Icon, color}) => (
      <Card className="shadow-lg">
        <CardContent className="flex items-center justify-between">
            <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{title}</p>
                <p className="text-4xl font-extrabold text-slate-800">{value}</p>
            </div>
            <div className={`p-4 rounded-2xl ${color}`}>
              <Icon className='w-8 h-8' />
            </div>
        </CardContent>
      </Card>
  )
  
  const PIE_COLORS: Record<GrowthStatus, string> = {
    [GrowthStatus.SevereUnderweight]: '#ef4444',
    [GrowthStatus.Underweight]: '#f59e0b',
    [GrowthStatus.Good]: '#10b981',
    [GrowthStatus.OverweightRisk]: '#f97316',
    [GrowthStatus.Unknown]: '#64748b',
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Pengguna" value={users.length} icon={ICONS.users} color="bg-blue-200 text-blue-600" />
        <StatCard title="Total Anak" value={systemStats.totalChildren} icon={ICONS.babyBoy} color="bg-primary-200 text-primary-600" />
        <StatCard title="Anak Berisiko Gizi" value={systemStats.childrenWithIssues} icon={ICONS.alertTriangle} color="bg-red-200 text-red-600" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <Card className="lg:col-span-2">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <ICONS.pieChart className="w-6 h-6 text-primary-500" />
                    <h2 className="text-xl font-bold text-slate-800">Distribusi Status Gizi</h2>
                </div>
            </CardHeader>
            <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={systemStats.growthStatusData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                const radius = innerRadius + (outerRadius - innerRadius) * 1.3;
                                const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                                const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                                return (
                                    <text x={x} y={y} fill="#334155" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="12px" fontWeight="bold">
                                        {`${(percent * 100).toFixed(0)}%`}
                                    </text>
                                );
                            }}
                        >
                            {systemStats.growthStatusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={PIE_COLORS[entry.name as GrowthStatus]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value} anak`}/>
                        <Legend iconSize={12} wrapperStyle={{fontSize: '12px'}} />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
             <CardHeader>
                <div className="flex items-center gap-3">
                    <ICONS.users className="w-6 h-6 text-primary-500" />
                    <h2 className="text-xl font-bold text-slate-800">Komposisi Pengguna</h2>
                </div>
            </CardHeader>
             <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={systemStats.userRoleData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false}/>
                        <XAxis type="number" allowDecimals={false} />
                        <YAxis type="category" dataKey="name" width={60}/>
                        <Tooltip cursor={{fill: 'rgba(20, 184, 166, 0.1)'}}/>
                        <Bar dataKey="value" fill="#14b8a6" barSize={30} name="Jumlah Pengguna">
                           {systemStats.userRoleData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={['#ef4444', '#f59e0b', '#10b981'][index % 3]} />
                           ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;