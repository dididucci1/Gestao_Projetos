import { useState } from 'react';
import { Mail, Briefcase, Clock, Plus, Search } from 'lucide-react';
import { mockUsers, mockTasks } from '../mockData';
import { User, UserRole } from '../types';

export default function Team() {
  const [users] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'Todos'>('Todos');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'Todos' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getUserTasks = (userId: string) => {
    return mockTasks.filter((task) => task.assignee === userId);
  };

  const getRoleColor = (role: UserRole) => {
    const colors = {
      Admin: 'bg-purple-100 text-purple-800',
      Gerente: 'bg-blue-100 text-blue-800',
      Colaborador: 'bg-green-100 text-green-800',
      Cliente: 'bg-gray-100 text-gray-800',
    };
    return colors[role];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Equipe</h1>
          <p className="text-gray-600 mt-1">Gerencie membros da equipe e alocações</p>
        </div>
        <button className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
          <Plus size={20} />
          <span>Adicionar Membro</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar membros..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as UserRole | 'Todos')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="Todos">Todas as funções</option>
            <option value="Admin">Admin</option>
            <option value="Gerente">Gerente</option>
            <option value="Colaborador">Colaborador</option>
            <option value="Cliente">Cliente</option>
          </select>
        </div>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {(['Admin', 'Gerente', 'Colaborador', 'Cliente'] as UserRole[]).map((role) => {
          const count = users.filter((u) => u.role === role).length;
          return (
            <div key={role} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium mb-2 ${getRoleColor(role)}`}>
                {role}
              </div>
              <p className="text-3xl font-bold text-gray-900">{count}</p>
              <p className="text-sm text-gray-600">membro{count !== 1 ? 's' : ''}</p>
            </div>
          );
        })}
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => {
          const userTasks = getUserTasks(user.id);
          const completedTasks = userTasks.filter((t) => t.status === 'Concluído').length;
          const activeTasks = userTasks.filter((t) => t.status === 'Em progresso').length;

          return (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center text-white text-xl font-semibold flex-shrink-0">
                  {user.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{user.name}</h3>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail size={16} className="mr-2" />
                  <span className="truncate">{user.email}</span>
                </div>
                {user.department && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Briefcase size={16} className="mr-2" />
                    <span>{user.department}</span>
                  </div>
                )}
                {user.workload > 0 && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock size={16} className="mr-2" />
                    <span>{user.workload}h/semana</span>
                  </div>
                )}
              </div>

              {user.role !== 'Cliente' && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{activeTasks}</p>
                      <p className="text-xs text-gray-600">Em andamento</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary-600">{completedTasks}</p>
                      <p className="text-xs text-gray-600">Concluídas</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                    {selectedUser.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedUser.name}</h2>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium mt-2 ${getRoleColor(selectedUser.role)}`}>
                      {selectedUser.role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Informações</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <Mail size={18} className="mr-3" />
                    <span>{selectedUser.email}</span>
                  </div>
                  {selectedUser.department && (
                    <div className="flex items-center text-gray-600">
                      <Briefcase size={18} className="mr-3" />
                      <span>{selectedUser.department}</span>
                    </div>
                  )}
                  {selectedUser.workload > 0 && (
                    <div className="flex items-center text-gray-600">
                      <Clock size={18} className="mr-3" />
                      <span>{selectedUser.workload} horas por semana</span>
                    </div>
                  )}
                </div>
              </div>

              {selectedUser.role !== 'Cliente' && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Tarefas Atribuídas</h3>
                  <div className="space-y-2">
                    {getUserTasks(selectedUser.id).map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{task.title}</p>
                          <p className="text-sm text-gray-600">{task.status}</p>
                        </div>
                        <div className="ml-4">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary-600 h-2 rounded-full"
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    {getUserTasks(selectedUser.id).length === 0 && (
                      <p className="text-gray-500 text-center py-4">Nenhuma tarefa atribuída</p>
                    )}
                  </div>
                </div>
              )}

              {selectedUser.role !== 'Cliente' && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Carga de Trabalho</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Utilização semanal</span>
                      <span className="font-medium text-gray-900">
                        {getUserTasks(selectedUser.id).reduce((acc, task) => acc + (task.estimatedHours || 0), 0)} / {selectedUser.workload}h
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          (getUserTasks(selectedUser.id).reduce((acc, task) => acc + (task.estimatedHours || 0), 0) / selectedUser.workload) * 100 > 100
                            ? 'bg-red-500'
                            : 'bg-primary-600'
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            (getUserTasks(selectedUser.id).reduce((acc, task) => acc + (task.estimatedHours || 0), 0) / selectedUser.workload) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
