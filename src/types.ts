// Tipos de Projeto
export type ProjectStatus = 'Planejamento' | 'Em execução' | 'Concluído' | 'Cancelado' | 'Pausado';

export interface Project {
  id: string;
  name: string;
  description: string;
  client: string;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  progress: number;
  teamMembers: string[];
  responsible: string;
  budget?: number;
  actualCost?: number;
}

// Tipos de Tarefa
export type TaskStatus = 'A fazer' | 'Em progresso' | 'Em revisão' | 'Concluído' | 'Bloqueado';
export type TaskPriority = 'Baixa' | 'Média' | 'Alta' | 'Urgente';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  progress: number;
  dependencies: string[];
  subtasks: SubTask[];
  comments: Comment[];
  attachments: Attachment[];
  estimatedHours?: number;
  actualHours?: number;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

// Tipos de Usuário
export type UserRole = 'Admin' | 'Gerente' | 'Colaborador' | 'Cliente';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  workload: number; // horas por semana
}

// Comunicação
export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

// Atividades
export interface Activity {
  id: string;
  type: 'task_created' | 'task_updated' | 'comment_added' | 'file_attached' | 'status_changed';
  userId: string;
  userName: string;
  description: string;
  timestamp: string;
  relatedId?: string;
}

// Dashboard
export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  delayedProjects: number;
  totalTasks: number;
  completedTasks: number;
  totalTeamMembers: number;
}
