import { useState } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Shield,
  User,
  AlertCircle,
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'suspended' | 'inactive';
  joinDate: string;
  lastActive: string;
  rides: {
    total: number;
    thisMonth: number;
  };
  violations: number;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'user',
    status: 'active',
    joinDate: '2024-01-15',
    lastActive: '2024-04-01',
    rides: {
      total: 45,
      thisMonth: 8,
    },
    violations: 0,
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@admin.com',
    role: 'admin',
    status: 'active',
    joinDate: '2023-11-20',
    lastActive: '2024-04-02',
    rides: {
      total: 12,
      thisMonth: 2,
    },
    violations: 0,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.j@example.com',
    role: 'user',
    status: 'suspended',
    joinDate: '2024-02-01',
    lastActive: '2024-03-15',
    rides: {
      total: 15,
      thisMonth: 0,
    },
    violations: 2,
  },
];

export default function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
        <button className="btn btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="border border-gray-300 rounded-lg px-4 py-2"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <select
          className="border border-gray-300 rounded-lg px-4 py-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="flex gap-6">
        {/* Users List */}
        <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Rides
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedUser(user)}
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {user.role === 'admin' ? (
                        <Shield className="w-3 h-3 mr-1" />
                      ) : (
                        <User className="w-3 h-3 mr-1" />
                      )}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        user.status
                      )}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.rides.total}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <button className="text-gray-400 hover:text-gray-500">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* User Details Panel */}
        {selectedUser && (
          <div className="w-80 bg-white rounded-lg shadow-sm p-6 space-y-6 h-fit">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  {selectedUser.name}
                </h2>
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
              </div>
              <button className="text-gray-400 hover:text-gray-500">
                <Edit2 className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-2">
                  Account Status
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      selectedUser.status
                    )}`}
                  >
                    {selectedUser.status}
                  </span>
                  {selectedUser.violations > 0 && (
                    <span className="flex items-center text-xs text-red-600">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {selectedUser.violations} violations
                    </span>
                  )}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-500 mb-2">
                  Role & Access
                </div>
                <span
                  className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                    selectedUser.role === 'admin'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {selectedUser.role === 'admin' ? (
                    <Shield className="w-3 h-3 mr-1" />
                  ) : (
                    <User className="w-3 h-3 mr-1" />
                  )}
                  {selectedUser.role}
                </span>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-500 mb-2">
                  Activity
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Total Rides</div>
                    <div className="text-lg font-medium text-gray-900">
                      {selectedUser.rides.total}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">This Month</div>
                    <div className="text-lg font-medium text-gray-900">
                      {selectedUser.rides.thisMonth}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-500 mb-2">Dates</div>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm text-gray-500">Joined</div>
                    <div className="text-sm text-gray-900">
                      {new Date(selectedUser.joinDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Last Active</div>
                    <div className="text-sm text-gray-900">
                      {new Date(selectedUser.lastActive).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 