import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Calendar,
  Users,
  BarChart3,
  Settings,
  Menu,
  X,
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/projects', icon: FolderKanban, label: 'Projetos' },
  { path: '/tasks', icon: CheckSquare, label: 'Tarefas' },
  { path: '/timeline', icon: Calendar, label: 'Cronograma' },
  { path: '/team', icon: Users, label: 'Equipe' },
  { path: '/reports', icon: BarChart3, label: 'Relatórios' },
  { path: '/settings', icon: Settings, label: 'Configurações' },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-16'
        } bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className={`p-4 border-b border-gray-200 ${isSidebarOpen ? 'relative' : 'flex justify-center'}`}>
            {isSidebarOpen && (
              <h1 className="text-2xl font-bold text-primary-600 leading-tight text-center">
                Maze
              </h1>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${
                isSidebarOpen ? 'absolute right-4 top-1/2 -translate-y-1/2' : ''
              }`}
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isSidebarOpen ? 'space-x-3' : 'justify-center'
                  } ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  {isSidebarOpen && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-gray-200">
            <div className={`flex items-center ${isSidebarOpen ? 'space-x-3' : 'justify-center'}`}>
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
                JS
              </div>
              {isSidebarOpen && (
                <div>
                  <p className="font-medium text-gray-900">João Silva</p>
                  <p className="text-sm text-gray-500">Admin</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Page Content */}
      <div className="flex-1 overflow-auto">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
