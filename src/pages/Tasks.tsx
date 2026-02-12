import { useState } from 'react';
import { Plus, Search, MessageSquare, Paperclip, AlertCircle } from 'lucide-react';
import { mockTasks, mockProjects, mockUsers } from '../mockData';
import { Task, TaskStatus, TaskPriority } from '../types';

export default function Tasks() {
  const [tasks] = useState<Task[]>(mockTasks);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityColor = (priority: TaskPriority) => {
    const colors = {
      Baixa: 'bg-gray-100 text-gray-800',
      Média: 'bg-blue-100 text-blue-800',
      Alta: 'bg-orange-100 text-orange-800',
      Urgente: 'bg-red-100 text-red-800',
    };
    return colors[priority];
  };

  const getStatusColor = (status: TaskStatus) => {
    const colors = {
      'A fazer': 'bg-gray-100 text-gray-800',
      'Em progresso': 'bg-blue-100 text-blue-800',
      'Em revisão': 'bg-yellow-100 text-yellow-800',
      Concluído: 'bg-green-100 text-green-800',
      Bloqueado: 'bg-red-100 text-red-800',
    };
    return colors[status];
  };

  const isOverdue = (dueDate: string, status: TaskStatus) => {
    return new Date(dueDate) < new Date() && status !== 'Concluído';
  };

  const kanbanColumns: TaskStatus[] = ['A fazer', 'Em progresso', 'Em revisão', 'Concluído', 'Bloqueado'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tarefas</h1>
          <p className="text-gray-600 mt-1">Gerencie e acompanhe todas as tarefas</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
            >
              Lista
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-4 py-2 rounded-md transition-colors ${
                viewMode === 'kanban' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
            >
              Kanban
            </button>
          </div>
          <button className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
            <Plus size={20} />
            <span>Nova Tarefa</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar tarefas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarefa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Projeto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Responsável
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prazo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prioridade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progresso
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTasks.map((task) => {
                  const project = mockProjects.find((p) => p.id === task.projectId);
                  const assignee = mockUsers.find((u) => u.id === task.assignee);
                  const overdue = isOverdue(task.dueDate, task.status);

                  return (
                    <tr
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{task.title}</div>
                          <div className="text-sm text-gray-500 flex items-center space-x-2 mt-1">
                            {task.comments.length > 0 && (
                              <span className="flex items-center">
                                <MessageSquare size={14} className="mr-1" />
                                {task.comments.length}
                              </span>
                            )}
                            {task.attachments.length > 0 && (
                              <span className="flex items-center">
                                <Paperclip size={14} className="mr-1" />
                                {task.attachments.length}
                              </span>
                            )}
                            {task.subtasks.length > 0 && (
                              <span>
                                {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length} subtarefas
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{project?.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{assignee?.name}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className={`flex items-center ${overdue ? 'text-red-600' : 'text-gray-900'}`}>
                          {overdue && <AlertCircle size={14} className="mr-1" />}
                          {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary-600 h-2 rounded-full"
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{task.progress}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {kanbanColumns.map((column) => {
            const columnTasks = filteredTasks.filter((task) => task.status === column);
            return (
              <div key={column} className="flex-shrink-0 w-80 bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{column}</h3>
                  <span className="bg-gray-200 text-gray-700 text-sm rounded-full px-2 py-1">
                    {columnTasks.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {columnTasks.map((task) => {
                    const project = mockProjects.find((p) => p.id === task.projectId);
                    const assignee = mockUsers.find((u) => u.id === task.assignee);
                    const overdue = isOverdue(task.dueDate, task.status);

                    return (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTask(task)}
                        className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{project?.name}</span>
                          <div className={`flex items-center ${overdue ? 'text-red-600' : ''}`}>
                            {overdue && <AlertCircle size={12} className="mr-1" />}
                            {new Date(task.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                          <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            {assignee?.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            {task.comments.length > 0 && (
                              <span className="flex items-center">
                                <MessageSquare size={12} className="mr-1" />
                                {task.comments.length}
                              </span>
                            )}
                            {task.subtasks.length > 0 && (
                              <span>
                                {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedTask.title}</h2>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedTask.priority)}`}>
                      {selectedTask.priority}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTask.status)}`}>
                      {selectedTask.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Descrição</h3>
                <p className="text-gray-600">{selectedTask.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Responsável</h3>
                  <p className="text-gray-600">{mockUsers.find((u) => u.id === selectedTask.assignee)?.name}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Prazo</h3>
                  <p className={isOverdue(selectedTask.dueDate, selectedTask.status) ? 'text-red-600' : 'text-gray-600'}>
                    {new Date(selectedTask.dueDate).toLocaleDateString('pt-BR')}
                    {isOverdue(selectedTask.dueDate, selectedTask.status) && ' (Atrasada)'}
                  </p>
                </div>
              </div>

              {selectedTask.subtasks.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Subtarefas</h3>
                  <div className="space-y-2">
                    {selectedTask.subtasks.map((subtask) => (
                      <div key={subtask.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          readOnly
                          className="rounded text-primary-600"
                        />
                        <span className={subtask.completed ? 'line-through text-gray-500' : 'text-gray-900'}>
                          {subtask.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTask.estimatedHours && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Horas</h3>
                  <p className="text-gray-600">
                    {selectedTask.actualHours}h gastas / {selectedTask.estimatedHours}h estimadas
                  </p>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Progresso</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-primary-600 h-3 rounded-full transition-all"
                      style={{ width: `${selectedTask.progress}%` }}
                    />
                  </div>
                  <span className="font-medium text-gray-900">{selectedTask.progress}%</span>
                </div>
              </div>

              {selectedTask.comments.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Comentários</h3>
                  <div className="space-y-3">
                    {selectedTask.comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{comment.userName}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleString('pt-BR')}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedTask(null)}
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
