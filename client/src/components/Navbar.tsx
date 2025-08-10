import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard", requiresAuth: true },
  { href: "/assessments", label: "Assessments", requiresAuth: true },
  { href: "/learning", label: "Learning Path", requiresAuth: true },
  { href: "/hackathons", label: "Hackathons", requiresAuth: true },
  { href: "/leaderboard", label: "Leaderboard", requiresAuth: true },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const isMobile = useIsMobile();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const visibleNavLinks = navLinks.filter(link => !link.requiresAuth || user);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-dark-bg/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-light-primary to-light-accent dark:from-dark-primary dark:to-dark-accent rounded-lg flex items-center justify-center">
                <i className="fas fa-code text-white text-lg"></i>
              </div>
              <span className="text-xl font-bold text-light-primary dark:text-dark-accent">
                Mavericks
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="hidden md:flex items-center space-x-8">
              {visibleNavLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    className={`transition-colors ${
                      location === link.href
                        ? "text-light-primary dark:text-dark-accent font-semibold"
                        : "text-gray-600 dark:text-gray-300 hover:text-light-primary dark:hover:text-dark-accent"
                    }`}
                  >
                    {link.label}
                  </motion.a>
                </Link>
              ))}
            </div>
          )}

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <i
                className={`${
                  theme === "dark" ? "fas fa-sun text-dark-accent" : "fas fa-moon text-gray-600"
                }`}
              ></i>
            </Button>

            {/* User Menu or Auth Buttons */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-light-primary to-light-accent rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {getInitials(user.firstName, user.lastName)}
                      </span>
                    </div>
                    {!isMobile && (
                      <span className="font-medium">{user.firstName} {user.lastName}</span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => window.location.href = "/dashboard"}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden"
              >
                <i className="fas fa-bars"></i>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobile && isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white dark:bg-dark-bg border-t border-gray-200 dark:border-gray-700"
          >
            <div className="px-4 py-2 space-y-1">
              {visibleNavLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <a
                    className={`block py-3 px-4 rounded-lg transition-colors ${
                      location === link.href
                        ? "text-light-primary dark:text-dark-accent bg-gray-100 dark:bg-gray-800 font-semibold"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
