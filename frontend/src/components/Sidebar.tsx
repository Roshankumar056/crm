import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { LayoutDashboard, Users, UserPlus, BarChart3, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'MANAGER', 'SALES'] },
    { name: 'Leads', href: '/leads', icon: Briefcase, roles: ['ADMIN', 'MANAGER', 'SALES'] },
    { name: 'Users', href: '/users', icon: Users, roles: ['ADMIN', 'MANAGER'] },
    { name: 'Add User', href: '/users/new', icon: UserPlus, roles: ['ADMIN'] },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, roles: ['ADMIN', 'MANAGER'] },
  ];

  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(user?.role || 'SALES')
  );

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-sidebar-foreground">CRM System</h1>
        <p className="text-sm text-sidebar-foreground/70 mt-1">{user?.role}</p>
      </div>
      
      <nav className="flex-1 px-3 space-y-1">
        {filteredNavigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-sidebar-border">
        <div className="text-sm text-sidebar-foreground/70">
          <p className="font-medium text-sidebar-foreground">{user?.name}</p>
          <p className="text-xs mt-1">{user?.email}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
