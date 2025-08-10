import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "fas fa-tachometer-alt" },
  { href: "/assessments", label: "Assessments", icon: "fas fa-brain" },
  { href: "/learning", label: "Learning Path", icon: "fas fa-route" },
  { href: "/hackathons", label: "Hackathons", icon: "fas fa-trophy" },
  { href: "/leaderboard", label: "Leaderboard", icon: "fas fa-medal" },
  { href: "/recommendations", label: "AI Recommendations", icon: "fas fa-robot" },
];

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuth();
  const [location] = useLocation();
  const isMobile = useIsMobile();

  if (!user) return null;

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        ${className}
        ${isMobile ? "fixed inset-y-0 left-0 z-40" : "sticky top-16"}
        ${isCollapsed ? "w-16" : "w-64"}
        h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        transition-all duration-300 ease-in-out
      `}
    >
      <div className="p-4">
        {/* Collapse Toggle */}
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <i className={`fas fa-chevron-${isCollapsed ? "right" : "left"}`}></i>
          </Button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2">
          {sidebarLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
                  ${
                    location === link.href
                      ? "bg-light-primary dark:bg-dark-accent text-white"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }
                `}
              >
                <i className={`${link.icon} text-lg min-w-[20px]`}></i>
                {!isCollapsed && <span className="font-medium">{link.label}</span>}
              </motion.a>
            </Link>
          ))}
        </nav>

        {/* User Info */}
        {!isCollapsed && user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-light-primary to-light-accent rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  Level {user.level}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.aside>
  );
}
