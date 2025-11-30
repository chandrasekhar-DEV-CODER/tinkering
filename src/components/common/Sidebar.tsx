import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bus, 
  Route as RouteIcon, 
  Users, 
  MapPin, 
  History, 
  Settings,
  Map
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: 'Live Tracking', path: '/tracking', icon: <Map className="w-5 h-5" /> },
  { name: 'Vehicles', path: '/vehicles', icon: <Bus className="w-5 h-5" /> },
  { name: 'Routes', path: '/routes', icon: <RouteIcon className="w-5 h-5" /> },
  { name: 'Stops', path: '/stops', icon: <MapPin className="w-5 h-5" /> },
  { name: 'Students', path: '/students', icon: <Users className="w-5 h-5" /> },
  { name: 'Trip History', path: '/trips', icon: <History className="w-5 h-5" /> },
  { name: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5" /> },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Bus className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">My School Ride</h1>
            <p className="text-xs text-muted-foreground">Bus Tracking System</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth',
                'hover:bg-secondary/50',
                isActive && 'bg-primary/10 text-primary border border-primary/20'
              )}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          © 2025 My School Ride
        </div>
      </div>
    </aside>
  );
}
