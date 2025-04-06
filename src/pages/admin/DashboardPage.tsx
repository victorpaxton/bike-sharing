import {
  Users,
  Bike,
  MapPin,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Clock,
  Battery,
} from 'lucide-react';

interface Metric {
  name: string;
  value: string | number;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ElementType;
}

interface Alert {
  id: string;
  type: 'warning' | 'error';
  message: string;
  location: string;
  time: string;
}

export default function AdminDashboardPage() {
  const metrics: Metric[] = [
    {
      name: 'Total Users',
      value: '24,316',
      change: '+4.75%',
      changeType: 'increase',
      icon: Users,
    },
    {
      name: 'Active Bikes',
      value: '487',
      change: '-0.91%',
      changeType: 'decrease',
      icon: Bike,
    },
    {
      name: 'Total Stations',
      value: '52',
      change: '0%',
      changeType: 'neutral',
      icon: MapPin,
    },
    {
      name: 'Daily Revenue',
      value: '$12,426',
      change: '+10.05%',
      changeType: 'increase',
      icon: DollarSign,
    },
  ];

  const alerts: Alert[] = [
    {
      id: '1',
      type: 'error',
      message: 'Low battery on multiple bikes',
      location: 'Central Park Station',
      time: '5 minutes ago',
    },
    {
      id: '2',
      type: 'warning',
      message: 'Station approaching capacity',
      location: 'Times Square Station',
      time: '12 minutes ago',
    },
    {
      id: '3',
      type: 'warning',
      message: 'Maintenance due for bikes',
      location: 'Brooklyn Bridge Station',
      time: '25 minutes ago',
    },
  ];

  const quickStats = [
    {
      name: 'Average Ride Duration',
      value: '24 mins',
      icon: Clock,
    },
    {
      name: 'Battery Health',
      value: '92%',
      icon: Battery,
    },
    {
      name: 'User Growth',
      value: '+22%',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
        <button className="btn btn-primary">Generate Report</button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.name}
            className="bg-white rounded-lg shadow-sm p-6 space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 bg-primary-50 rounded-lg">
                <metric.icon className="w-5 h-5 text-primary-600" />
              </div>
              <span
                className={`text-sm font-medium ${
                  metric.changeType === 'increase'
                    ? 'text-green-600'
                    : metric.changeType === 'decrease'
                    ? 'text-red-600'
                    : 'text-gray-600'
                }`}
              >
                {metric.change}
              </span>
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-gray-900">{metric.value}</h2>
              <p className="text-sm text-gray-600">{metric.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickStats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-4"
          >
            <div className="p-2 bg-gray-100 rounded-lg">
              <stat.icon className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{stat.name}</p>
              <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* System Alerts */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">System Alerts</h2>
          <span className="text-sm text-gray-500">Last 24 hours</span>
        </div>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50"
            >
              <div
                className={`p-2 rounded-lg ${
                  alert.type === 'error' ? 'bg-red-100' : 'bg-yellow-100'
                }`}
              >
                <AlertTriangle
                  className={`w-5 h-5 ${
                    alert.type === 'error' ? 'text-red-600' : 'text-yellow-600'
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {alert.message}
                </p>
                <p className="text-sm text-gray-600">{alert.location}</p>
              </div>
              <span className="text-sm text-gray-500 whitespace-nowrap">
                {alert.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 