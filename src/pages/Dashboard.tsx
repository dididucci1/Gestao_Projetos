import {
  TrendingUp,
  TrendingDown,
  FolderKanban,
  Users,
  CheckCircle,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { loadActivities, loadProjects, loadTasks, loadUsers } from '../storage';

export default function Dashboard() {
  const projects = loadProjects();
  const tasks = loadTasks();
  const activities = loadActivities();
  const users = loadUsers();

  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === 'Em execução').length;
  const delayedProjects = projects.filter(
    (p) => new Date(p.endDate) < new Date() && p.status !== 'Concluído'
  ).length;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Concluído').length;
  const delayedTasks = tasks.filter(
    (t) => new Date(t.dueDate) < new Date() && t.status !== 'Concluído'
  ).length;

  const stats = [
    {
      label: 'Projetos Ativos',
      value: activeProjects,
      total: totalProjects,
      icon: FolderKanban,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      change: '+12%',
      trend: 'up',
    },
    {
      label: 'Tarefas Concluídas',
      value: completedTasks,
      total: totalTasks,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+8%',
      trend: 'up',
    },
    {
      label: 'Projetos Atrasados',
      value: delayedProjects,
      total: totalProjects,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      change: '-3%',
      trend: 'down',
    },
    {
      label: 'Membros da Equipe',
      value: users.filter((u) => u.role !== 'Cliente').length,
      total: users.length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+2',
      trend: 'up',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Visão geral dos seus projetos e atividades
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                  <div className="flex items-baseline space-x-2 mt-2">
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-500">/ {stat.total}</p>
                  </div>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={stat.color} size={24} />
                </div>
              </div>
              <div className="flex items-center mt-4 space-x-2">
                {stat.trend === 'up' ? (
                  <TrendingUp className="text-green-500" size={16} />
                ) : (
                  <TrendingDown className="text-green-500" size={16} />
                )}
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                <span className="text-sm text-gray-500">vs último mês</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Projects Overview & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Projects */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Projetos em Andamento</h2>
          </div>
          <div className="p-6 space-y-4">
            {projects
              .filter((p) => p.status === 'Em execução')
              .map((project) => (
                <div key={project.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">{project.name}</h3>
                    <span className="text-sm text-gray-600">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Cliente: {project.client}</span>
                    <span className="text-gray-500">
                      Prazo: {new Date(project.endDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Atividades Recentes</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <Clock className="text-primary-600" size={16} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.userName}</span>{' '}
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.timestamp).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {activities.length === 0 && (
              <p className="text-sm text-gray-500">Sem atividades registradas.</p>
            )}
          </div>
        </div>
      </div>

      {/* Tasks Alert */}
      {delayedTasks > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <AlertCircle className="text-red-600" size={24} />
            <div>
              <h3 className="text-red-900 font-semibold">Atenção</h3>
              <p className="text-red-700 text-sm">
                Você tem {delayedTasks} tarefa(s) atrasada(s) que requerem atenção imediata.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
