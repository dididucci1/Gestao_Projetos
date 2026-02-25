import { useEffect, useState } from 'react';
import { Plus, Search, Calendar, Users, DollarSign, LayoutGrid, List, Pencil } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Project, ProjectStatus } from '../types';
import { loadProjects, loadUsers, saveProjects } from '../storage';

export default function Projects() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState<Project[]>(() => loadProjects());
  const [users] = useState(() => loadUsers());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<ProjectStatus | 'Todos'>('Todos');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [showModal, setShowModal] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [newProject, setNewProject] = useState<Partial<Project>>({
    name: '',
    description: '',
    client: '',
    startDate: '',
    endDate: '',
    status: 'Planejamento',
    progress: 0,
    teamMembers: [],
    responsible: '',
  });

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'Todos' || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setEditingProjectId(null);
      setShowModal(true);
    }
  }, [searchParams]);

  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  const clearNewParam = () => {
    if (searchParams.get('new') === 'true') {
      setSearchParams({}, { replace: true });
    }
  };

  const resetProjectForm = () => {
    setEditingProjectId(null);
    setNewProject({
      name: '',
      description: '',
      client: '',
      startDate: '',
      endDate: '',
      status: 'Planejamento',
      progress: 0,
      teamMembers: [],
      responsible: '',
    });
  };

  const handleCreateProject = () => {
    if (!newProject.name?.trim()) {
      return;
    }

    if (editingProjectId) {
      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project.id === editingProjectId
            ? {
                ...project,
                name: newProject.name || project.name,
                description: newProject.description || '',
                client: newProject.client || '',
                startDate: newProject.startDate || project.startDate,
                endDate: newProject.endDate || project.endDate,
                status: newProject.status || project.status,
                responsible: newProject.responsible || '',
              }
            : project
        )
      );
      setShowModal(false);
      clearNewParam();
      resetProjectForm();
      return;
    }

    const project: Project = {
      id: String(projects.length + 1),
      name: newProject.name || 'Novo Projeto',
      description: newProject.description || '',
      client: newProject.client || '',
      startDate: newProject.startDate || new Date().toISOString().split('T')[0],
      endDate: newProject.endDate || new Date().toISOString().split('T')[0],
      status: newProject.status || 'Planejamento',
      progress: 0,
      teamMembers: newProject.teamMembers || [],
      responsible: newProject.responsible || '',
    };
    setProjects([...projects, project]);
    setShowModal(false);
    clearNewParam();
    resetProjectForm();
  };

  const handleEditProject = (project: Project) => {
    setEditingProjectId(project.id);
    setNewProject({
      name: project.name,
      description: project.description,
      client: project.client,
      startDate: project.startDate,
      endDate: project.endDate,
      status: project.status,
      progress: project.progress,
      teamMembers: project.teamMembers,
      responsible: project.responsible,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    clearNewParam();
    resetProjectForm();
  };

  const getStatusColor = (status: ProjectStatus) => {
    const colors = {
      Planejamento: 'bg-blue-100 text-blue-800',
      'Em execução': 'bg-green-100 text-green-800',
      Concluído: 'bg-gray-100 text-gray-800',
      Cancelado: 'bg-red-100 text-red-800',
      Pausado: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projetos</h1>
          <p className="text-gray-600 mt-1">Gerencie todos os seus projetos</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'cards' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
              title="Visualizar em cards"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'table' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
              title="Visualizar em tabela"
            >
              <List size={18} />
            </button>
          </div>
          <button
            onClick={() => {
              resetProjectForm();
              setShowModal(true);
            }}
            className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus size={20} />
            <span>Novo Projeto</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar projetos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as ProjectStatus | 'Todos')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="Todos">Todos os status</option>
            <option value="Planejamento">Planejamento</option>
            <option value="Em execução">Em execução</option>
            <option value="Concluído">Concluído</option>
            <option value="Pausado">Pausado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>
      </div>

      {/* Projects View */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users size={16} className="mr-2" />
                    <span>Cliente: {project.client}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar size={16} className="mr-2" />
                    <span>
                      {new Date(project.startDate).toLocaleDateString('pt-BR')} -{' '}
                      {new Date(project.endDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  {project.budget && (
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign size={16} className="mr-2" />
                      <span>
                        R$ {project.actualCost?.toLocaleString('pt-BR')} / R${' '}
                        {project.budget.toLocaleString('pt-BR')}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progresso</span>
                    <span className="font-medium text-gray-900">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex -space-x-2">
                      {project.teamMembers.slice(0, 3).map((memberId) => {
                        const member = users.find((u) => u.id === memberId);
                        return (
                          <div
                            key={memberId}
                            className="w-8 h-8 bg-primary-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-semibold"
                            title={member?.name}
                          >
                            {member?.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                        );
                      })}
                      {project.teamMembers.length > 3 && (
                        <div className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center text-gray-600 text-xs font-semibold">
                          +{project.teamMembers.length - 3}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleEditProject(project)}
                      className="text-sm text-primary-700 hover:text-primary-800 font-medium"
                    >
                      Editar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projeto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsável</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Período</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progresso</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProjects.map((project) => {
                  const responsible = users.find((user) => user.id === project.responsible);
                  return (
                    <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{project.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{project.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{project.client}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{responsible?.name || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(project.startDate).toLocaleDateString('pt-BR')} -{' '}
                        {new Date(project.endDate).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3 min-w-[180px]">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary-600 h-2 rounded-full"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 min-w-[42px]">{project.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleEditProject(project)}
                          className="inline-flex items-center space-x-1 text-primary-700 hover:text-primary-800 font-medium text-sm"
                        >
                          <Pencil size={14} />
                          <span>Editar</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingProjectId ? 'Editar Projeto' : 'Novo Projeto'}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Projeto</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cliente</label>
                <input
                  type="text"
                  value={newProject.client}
                  onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data de Início</label>
                  <input
                    type="date"
                    value={newProject.startDate}
                    onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data de Término</label>
                  <input
                    type="date"
                    value={newProject.endDate}
                    onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={newProject.status}
                  onChange={(e) => setNewProject({ ...newProject, status: e.target.value as ProjectStatus })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="Planejamento">Planejamento</option>
                  <option value="Em execução">Em execução</option>
                  <option value="Concluído">Concluído</option>
                  <option value="Pausado">Pausado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Responsável</label>
                <select
                  value={newProject.responsible}
                  onChange={(e) => setNewProject({ ...newProject, responsible: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Selecione um responsável</option>
                  {users.filter((u) => u.role !== 'Cliente').map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} - {user.role}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateProject}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                {editingProjectId ? 'Salvar Alterações' : 'Criar Projeto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
