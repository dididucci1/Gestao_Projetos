import { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { loadProjects, loadTasks, loadUsers } from '../storage';

export default function Reports() {
  const [dateRange, setDateRange] = useState('month');
  const projects = loadProjects();
  const tasks = loadTasks();
  const users = loadUsers();

  // Cálculos para relatórios
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === 'Em execução').length;
  const completedProjects = projects.filter((p) => p.status === 'Concluído').length;
  const delayedProjects = projects.filter(
    (p) => new Date(p.endDate) < new Date() && p.status !== 'Concluído'
  ).length;

  const totalBudget = projects.reduce((acc, p) => acc + (p.budget || 0), 0);
  const totalSpent = projects.reduce((acc, p) => acc + (p.actualCost || 0), 0);
  const totalSavings = totalBudget - totalSpent;

  const tasksByStatus = {
    'A fazer': tasks.filter((t) => t.status === 'A fazer').length,
    'Em progresso': tasks.filter((t) => t.status === 'Em progresso').length,
    'Em revisão': tasks.filter((t) => t.status === 'Em revisão').length,
    Concluído: tasks.filter((t) => t.status === 'Concluído').length,
    Bloqueado: tasks.filter((t) => t.status === 'Bloqueado').length,
  };

  const projectsByStatus = {
    Planejamento: projects.filter((p) => p.status === 'Planejamento').length,
    'Em execução': projects.filter((p) => p.status === 'Em execução').length,
    Concluído: projects.filter((p) => p.status === 'Concluído').length,
    Pausado: projects.filter((p) => p.status === 'Pausado').length,
    Cancelado: projects.filter((p) => p.status === 'Cancelado').length,
  };

  const tasksByUser = users
    .filter((u) => u.role !== 'Cliente')
    .map((user) => {
      const userTasks = tasks.filter((t) => t.assignee === user.id);
      return {
        name: user.name,
        total: userTasks.length,
        completed: userTasks.filter((t) => t.status === 'Concluído').length,
        inProgress: userTasks.filter((t) => t.status === 'Em progresso').length,
      };
    })
    .sort((a, b) => b.total - a.total);

  const totalEstimatedHours = tasks.reduce((acc, t) => acc + (t.estimatedHours || 0), 0);
  const totalActualHours = tasks.reduce((acc, t) => acc + (t.actualHours || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600 mt-1">Análises e insights dos seus projetos</p>
        </div>
        <button className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
          <Download size={20} />
          <span>Exportar Relatório</span>
        </button>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <Calendar className="text-gray-400" size={20} />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="week">Última Semana</option>
            <option value="month">Último Mês</option>
            <option value="quarter">Último Trimestre</option>
            <option value="year">Último Ano</option>
            <option value="all">Todo o Período</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Projetos Ativos</h3>
            <div className="bg-primary-50 p-2 rounded-lg">
              <BarChart3 className="text-primary-600" size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{activeProjects}</p>
          <p className="text-sm text-gray-500 mt-1">de {totalProjects} totais</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Taxa de Conclusão</h3>
            <div className="bg-green-50 p-2 rounded-lg">
              <CheckCircle className="text-green-600" size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0}%
          </p>
          <p className="text-sm text-gray-500 mt-1">{completedProjects} concluídos</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Projetos Atrasados</h3>
            <div className="bg-red-50 p-2 rounded-lg">
              <AlertCircle className="text-red-600" size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{delayedProjects}</p>
          <p className="text-sm text-gray-500 mt-1">requerem atenção</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Economia</h3>
            <div className="bg-blue-50 p-2 rounded-lg">
              <DollarSign className="text-blue-600" size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            R$ {totalSavings.toLocaleString('pt-BR')}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {totalBudget > 0 ? Math.round((totalSavings / totalBudget) * 100) : 0}% do orçamento
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects by Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Projetos por Status</h2>
          <div className="space-y-4">
            {Object.entries(projectsByStatus).map(([status, count]) => {
              const percentage = totalProjects > 0 ? (count / totalProjects) * 100 : 0;
              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{status}</span>
                    <span className="text-sm text-gray-600">
                      {count} ({Math.round(percentage)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-primary-600 h-3 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tasks by Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tarefas por Status</h2>
          <div className="space-y-4">
            {Object.entries(tasksByStatus).map(([status, count]) => {
              const percentage = tasks.length > 0 ? (count / tasks.length) * 100 : 0;
              const colors = {
                'A fazer': 'bg-gray-500',
                'Em progresso': 'bg-blue-500',
                'Em revisão': 'bg-yellow-500',
                Concluído: 'bg-green-500',
                Bloqueado: 'bg-red-500',
              };
              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{status}</span>
                    <span className="text-sm text-gray-600">
                      {count} ({Math.round(percentage)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`${colors[status as keyof typeof colors]} h-3 rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tasks by Collaborator */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tarefas por Colaborador</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Colaborador
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Concluídas
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Em Progresso
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taxa de Conclusão
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasksByUser.map((user) => {
                const completionRate = user.total > 0 ? (user.completed / user.total) * 100 : 0;
                return (
                  <tr key={user.name}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-gray-900">{user.total}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-green-600 font-medium">{user.completed}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-blue-600 font-medium">{user.inProgress}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ width: `${completionRate}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{Math.round(completionRate)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hours Report */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Horas Trabalhadas</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg">
              <span className="text-gray-700 font-medium">Total Estimado</span>
              <span className="text-2xl font-bold text-primary-600">{totalEstimatedHours}h</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <span className="text-gray-700 font-medium">Total Trabalhado</span>
              <span className="text-2xl font-bold text-green-600">{totalActualHours}h</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-medium">Variação</span>
              <span
                className={`text-2xl font-bold ${
                  totalActualHours <= totalEstimatedHours ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {totalEstimatedHours > 0
                  ? Math.round(((totalActualHours - totalEstimatedHours) / totalEstimatedHours) * 100)
                  : 0}
                %
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Rentabilidade</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <span className="text-gray-700 font-medium">Orçamento Total</span>
              <span className="text-2xl font-bold text-blue-600">
                R$ {totalBudget.toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
              <span className="text-gray-700 font-medium">Gasto Atual</span>
              <span className="text-2xl font-bold text-orange-600">
                R$ {totalSpent.toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <span className="text-gray-700 font-medium">Economia</span>
              <span className="text-2xl font-bold text-green-600">
                R$ {totalSavings.toLocaleString('pt-BR')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
