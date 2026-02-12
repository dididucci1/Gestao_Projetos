import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { mockProjects, mockTasks, mockUsers } from '../mockData';

export default function Timeline() {
  const [viewMode, setViewMode] = useState<'gantt' | 'calendario'>('gantt');
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  // Função para calcular dias entre datas
  const getDaysBetween = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Função para calcular posição no Gantt
  const getGanttPosition = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const today = new Date();
    const yearStart = new Date(today.getFullYear(), 0, 1);
    
    const daysFromYearStart = Math.floor((start.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24));
    const duration = getDaysBetween(startDate, endDate);
    
    return { left: `${(daysFromYearStart / 365) * 100}%`, width: `${(duration / 365) * 100}%` };
  };

  const months = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cronograma</h1>
          <p className="text-gray-600 mt-1">Visualize o timeline dos projetos e tarefas</p>
        </div>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('gantt')}
            className={`px-4 py-2 rounded-md transition-colors ${
              viewMode === 'gantt' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
            }`}
          >
            Gantt
          </button>
          <button
            onClick={() => setViewMode('calendario')}
            className={`px-4 py-2 rounded-md transition-colors ${
              viewMode === 'calendario' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
            }`}
          >
            Calendário
          </button>
        </div>
      </div>

      {/* Gantt View */}
      {viewMode === 'gantt' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Gráfico de Gantt - 2026</h2>
            
            {/* Timeline Header */}
            <div className="flex border-b border-gray-200 pb-2 mb-4">
              <div className="w-64 font-medium text-gray-700">Projeto</div>
              <div className="flex-1 flex justify-between px-4">
                {months.map((month) => (
                  <div key={month} className="text-xs text-gray-500 text-center" style={{ width: '8.33%' }}>
                    {month}
                  </div>
                ))}
              </div>
            </div>

            {/* Projects Timeline */}
            <div className="space-y-4">
              {mockProjects.map((project) => {
                const position = getGanttPosition(project.startDate, project.endDate);
                return (
                  <div key={project.id} className="flex items-center">
                    <div className="w-64">
                      <div className="font-medium text-gray-900 text-sm">{project.name}</div>
                      <div className="text-xs text-gray-500">{project.client}</div>
                    </div>
                    <div className="flex-1 relative h-10 px-4">
                      <div className="absolute inset-0 flex items-center">
                        <div
                          className={`h-8 rounded-lg relative ${
                            project.status === 'Concluído'
                              ? 'bg-green-500'
                              : project.status === 'Em execução'
                              ? 'bg-primary-500'
                              : 'bg-blue-500'
                          }`}
                          style={{ ...position, minWidth: '40px' }}
                        >
                          <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium px-2">
                            {project.progress}%
                          </div>
                        </div>
                      </div>
                      {/* Grid lines */}
                      {months.map((_, i) => (
                        <div
                          key={i}
                          className="absolute top-0 bottom-0 border-l border-gray-100"
                          style={{ left: `${(i / 12) * 100}%` }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tasks Timeline */}
          <div className="border-t border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tarefas Principais</h2>
            <div className="space-y-2">
              {mockTasks.slice(0, 5).map((task) => {
                const project = mockProjects.find((p) => p.id === task.projectId);
                const assignee = mockUsers.find((u) => u.id === task.assignee);
                const position = getGanttPosition(project?.startDate || task.dueDate, task.dueDate);
                
                return (
                  <div key={task.id} className="flex items-center text-sm">
                    <div className="w-64">
                      <div className="text-gray-900">{task.title}</div>
                      <div className="text-xs text-gray-500">{assignee?.name}</div>
                    </div>
                    <div className="flex-1 relative h-8 px-4">
                      <div className="absolute inset-0 flex items-center">
                        <div
                          className={`h-6 rounded ${
                            task.status === 'Concluído'
                              ? 'bg-green-400'
                              : task.status === 'Em progresso'
                              ? 'bg-blue-400'
                              : task.status === 'Bloqueado'
                              ? 'bg-red-400'
                              : 'bg-gray-400'
                          }`}
                          style={{ ...position, minWidth: '20px' }}
                        />
                      </div>
                      {months.map((_, i) => (
                        <div
                          key={i}
                          className="absolute top-0 bottom-0 border-l border-gray-100"
                          style={{ left: `${(i / 12) * 100}%` }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Calendar View */}
      {viewMode === 'calendario' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {selectedMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  const newDate = new Date(selectedMonth);
                  newDate.setMonth(newDate.getMonth() - 1);
                  setSelectedMonth(newDate);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => {
                  const newDate = new Date(selectedMonth);
                  newDate.setMonth(newDate.getMonth() + 1);
                  setSelectedMonth(newDate);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Milestones */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Marcos do Mês</h3>
            <div className="space-y-2">
              {mockProjects
                .filter((p) => {
                  const endDate = new Date(p.endDate);
                  return (
                    endDate.getMonth() === selectedMonth.getMonth() &&
                    endDate.getFullYear() === selectedMonth.getFullYear()
                  );
                })
                .map((project) => (
                  <div key={project.id} className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg">
                    <Calendar className="text-primary-600" size={20} />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{project.name}</div>
                      <div className="text-sm text-gray-600">
                        Prazo final: {new Date(project.endDate).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <span className="text-sm font-medium text-primary-600">{project.status}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Deadlines */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Prazos de Tarefas</h3>
            <div className="space-y-2">
              {mockTasks
                .filter((t) => {
                  const dueDate = new Date(t.dueDate);
                  return (
                    dueDate.getMonth() === selectedMonth.getMonth() &&
                    dueDate.getFullYear() === selectedMonth.getFullYear()
                  );
                })
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                .map((task) => {
                  const project = mockProjects.find((p) => p.id === task.projectId);
                  const assignee = mockUsers.find((u) => u.id === task.assignee);
                  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Concluído';
                  
                  return (
                    <div
                      key={task.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg border ${
                        isOverdue ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{task.title}</div>
                        <div className="text-sm text-gray-600">
                          {project?.name} • {assignee?.name}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                          {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="text-xs text-gray-500">{task.status}</div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
