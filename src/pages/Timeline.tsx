import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { loadProjects, loadTasks, loadUsers } from '../storage';

export default function Timeline() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [projects] = useState(() => loadProjects());
  const [tasks] = useState(() => loadTasks());
  const [users] = useState(() => loadUsers());

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const isSameDay = (dateA: Date, dateB: Date) =>
    dateA.getDate() === dateB.getDate() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getFullYear() === dateB.getFullYear();

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => isSameDay(new Date(task.dueDate), date));
  };

  const getMilestonesForDate = (date: Date) => {
    return projects.filter((project) => isSameDay(new Date(project.endDate), date));
  };

  const getPriorityTag = (priority: string) => {
    const colors = {
      Baixa: 'bg-gray-100 text-gray-700',
      Média: 'bg-blue-100 text-blue-700',
      Alta: 'bg-orange-100 text-orange-700',
      Urgente: 'bg-red-100 text-red-700',
    };
    return colors[priority as keyof typeof colors] ?? 'bg-gray-100 text-gray-700';
  };

  const getStatusDot = (status: string) => {
    const colors = {
      'A fazer': 'bg-gray-400',
      'Em progresso': 'bg-blue-500',
      'Em revisão': 'bg-yellow-500',
      Concluído: 'bg-green-500',
      Bloqueado: 'bg-red-500',
    };
    return colors[status as keyof typeof colors] ?? 'bg-gray-400';
  };

  const getCalendarDays = () => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const firstWeekDay = firstDayOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPreviousMonth = new Date(year, month, 0).getDate();

    const calendarDays: { date: Date; isCurrentMonth: boolean }[] = [];

    for (let i = firstWeekDay - 1; i >= 0; i--) {
      calendarDays.push({
        date: new Date(year, month - 1, daysInPreviousMonth - i),
        isCurrentMonth: false,
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push({
        date: new Date(year, month, day),
        isCurrentMonth: true,
      });
    }

    const remainingDays = 42 - calendarDays.length;
    for (let day = 1; day <= remainingDays; day++) {
      calendarDays.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false,
      });
    }

    return calendarDays;
  };

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];
  const selectedDateMilestones = selectedDate ? getMilestonesForDate(selectedDate) : [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Cronograma</h1>
        <p className="text-gray-600 mt-1">Calendário mensal de projetos e tarefas</p>
      </div>

      {/* Calendar View */}
      <>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex items-center space-x-2">
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
                <button
                  onClick={() => setSelectedMonth(new Date())}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hoje
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-1">
              {weekDays.map((day) => (
                <div key={day} className="text-xs font-semibold text-gray-500 uppercase text-center py-1">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {getCalendarDays().map(({ date, isCurrentMonth }) => {
                const tasksForDay = getTasksForDate(date);
                const milestonesForDay = getMilestonesForDate(date);
                const isToday = isSameDay(date, new Date());
                const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;

                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    className={`text-left h-20 p-1.5 rounded-lg border transition-colors overflow-hidden ${
                      isSelected
                        ? 'border-primary-400 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-xs font-medium ${
                          isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                        }`}
                      >
                        {date.getDate()}
                      </span>
                      {isToday && <span className="w-2 h-2 rounded-full bg-primary-600" />}
                    </div>

                    <div className="space-y-1">
                      {tasksForDay.slice(0, 1).map((task) => (
                        <div key={task.id} className="text-xs bg-white border border-gray-200 rounded px-2 py-1 truncate">
                          <span className={`inline-block w-2 h-2 rounded-full mr-1 ${getStatusDot(task.status)}`} />
                          {task.title}
                        </div>
                      ))}

                      {tasksForDay.length === 0 && milestonesForDay.slice(0, 1).map((project) => (
                        <div
                          key={project.id}
                          className="text-xs bg-primary-100 text-primary-700 rounded px-2 py-1 truncate"
                        >
                          Entrega: {project.name}
                        </div>
                      ))}

                      {tasksForDay.length + milestonesForDay.length > 1 && (
                        <div className="text-xs text-gray-500">
                          +{tasksForDay.length + milestonesForDay.length - 1} mais
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
        </div>

        {selectedDate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Detalhes do Dia</h2>
                  <p className="text-gray-600 mt-1">
                    {selectedDate.toLocaleDateString('pt-BR', {
                      weekday: 'long',
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDate(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Tarefas do Dia</h3>
                  {selectedDateTasks.length === 0 ? (
                    <p className="text-gray-500">Nenhuma tarefa com prazo para este dia.</p>
                  ) : (
                    <div className="space-y-3">
                      {selectedDateTasks.map((task) => {
                        const project = projects.find((p) => p.id === task.projectId);
                        const assignee = users.find((u) => u.id === task.assignee);
                        return (
                          <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h4 className="font-medium text-gray-900">{task.title}</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  {project?.name} • {assignee?.name}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityTag(task.priority)}`}>
                                  {task.priority}
                                </span>
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                  {task.status}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">{task.description}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Marcos de Projeto</h3>
                  {selectedDateMilestones.length === 0 ? (
                    <p className="text-gray-500">Nenhum marco de projeto para este dia.</p>
                  ) : (
                    <div className="space-y-3">
                      {selectedDateMilestones.map((project) => (
                        <div key={project.id} className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg">
                          <Calendar className="text-primary-600" size={18} />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{project.name}</div>
                            <div className="text-sm text-gray-600">Cliente: {project.client}</div>
                          </div>
                          <span className="text-sm font-medium text-primary-700">{project.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setSelectedDate(null)}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
}
