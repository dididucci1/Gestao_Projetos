import { Activity, Project, Task, User } from './types';

const STORAGE_KEYS = {
  projects: 'maze-projects',
  tasks: 'maze-tasks',
  users: 'maze-users',
  activities: 'maze-activities',
} as const;

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function loadProjects(): Project[] {
  return safeParse<Project[]>(localStorage.getItem(STORAGE_KEYS.projects), []);
}

export function saveProjects(projects: Project[]): void {
  localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(projects));
}

export function loadTasks(): Task[] {
  return safeParse<Task[]>(localStorage.getItem(STORAGE_KEYS.tasks), []);
}

export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
}

export function loadUsers(): User[] {
  return safeParse<User[]>(localStorage.getItem(STORAGE_KEYS.users), []);
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
}

export function loadActivities(): Activity[] {
  return safeParse<Activity[]>(localStorage.getItem(STORAGE_KEYS.activities), []);
}

export function saveActivities(activities: Activity[]): void {
  localStorage.setItem(STORAGE_KEYS.activities, JSON.stringify(activities));
}
