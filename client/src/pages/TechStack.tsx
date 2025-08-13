import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Code, 
  Database, 
  Globe, 
  Server, 
  Brain, 
  Shield, 
  Zap, 
  Users,
  ExternalLink,
  CheckCircle
} from "lucide-react";

interface TechCategory {
  title: string;
  icon: JSX.Element;
  description: string;
  technologies: TechItem[];
}

interface TechItem {
  name: string;
  description: string;
  version?: string;
  purpose: string;
  status: 'active' | 'integrated' | 'configured';
}

const techStack: TechCategory[] = [
  {
    title: "Frontend Technologies",
    icon: <Globe className="w-6 h-6" />,
    description: "Modern web technologies for responsive user interface",
    technologies: [
      {
        name: "React 18",
        description: "Component-based UI library with hooks and modern features",
        version: "18.x",
        purpose: "Core frontend framework for building interactive user interfaces",
        status: "active"
      },
      {
        name: "TypeScript",
        description: "Typed superset of JavaScript for better development experience",
        version: "5.x",
        purpose: "Type safety and enhanced developer productivity",
        status: "active"
      },
      {
        name: "Vite",
        description: "Fast build tool and development server",
        version: "Latest",
        purpose: "Lightning-fast development and optimized production builds",
        status: "active"
      },
      {
        name: "Tailwind CSS",
        description: "Utility-first CSS framework for rapid UI development",
        version: "3.x",
        purpose: "Consistent styling system with responsive design",
        status: "active"
      },
      {
        name: "shadcn/ui",
        description: "Beautiful and accessible UI components",
        version: "Latest",
        purpose: "Pre-built accessible components with consistent design",
        status: "active"
      },
      {
        name: "Framer Motion",
        description: "Production-ready motion library for React",
        version: "11.x",
        purpose: "Smooth animations and interactive transitions",
        status: "active"
      },
      {
        name: "TanStack Query",
        description: "Powerful data synchronization for React",
        version: "5.x",
        purpose: "Server state management and caching",
        status: "active"
      },
      {
        name: "Wouter",
        description: "Minimalist routing for React applications",
        version: "3.x",
        purpose: "Client-side routing and navigation",
        status: "active"
      }
    ]
  },
  {
    title: "Backend Technologies",
    icon: <Server className="w-6 h-6" />,
    description: "Robust server-side architecture and APIs",
    technologies: [
      {
        name: "Node.js",
        description: "JavaScript runtime for server-side development",
        version: "20.x",
        purpose: "Backend runtime environment",
        status: "active"
      },
      {
        name: "Express.js",
        description: "Fast, unopinionated web framework for Node.js",
        version: "4.x",
        purpose: "RESTful API development and middleware",
        status: "active"
      },
      {
        name: "TypeScript",
        description: "Type-safe backend development",
        version: "5.x",
        purpose: "Server-side type safety and enhanced development",
        status: "active"
      },
      {
        name: "Drizzle ORM",
        description: "TypeScript ORM for SQL databases",
        version: "Latest",
        purpose: "Type-safe database operations and migrations",
        status: "active"
      },
      {
        name: "JWT (JSON Web Tokens)",
        description: "Secure authentication tokens",
        version: "Latest",
        purpose: "Stateless authentication and authorization",
        status: "active"
      },
      {
        name: "bcrypt",
        description: "Password hashing library",
        version: "5.x",
        purpose: "Secure password storage and verification",
        status: "active"
      }
    ]
  },
  {
    title: "Database & Storage",
    icon: <Database className="w-6 h-6" />,
    description: "Reliable data persistence and management",
    technologies: [
      {
        name: "PostgreSQL",
        description: "Advanced open-source relational database",
        version: "15.x",
        purpose: "Primary database for all application data",
        status: "active"
      },
      {
        name: "Neon Database",
        description: "Serverless PostgreSQL platform",
        version: "Latest",
        purpose: "Cloud-hosted PostgreSQL with branching",
        status: "integrated"
      },
      {
        name: "Drizzle Kit",
        description: "Database migration and introspection toolkit",
        version: "Latest",
        purpose: "Schema migrations and database management",
        status: "active"
      }
    ]
  },
  {
    title: "AI & External APIs",
    icon: <Brain className="w-6 h-6" />,
    description: "Intelligent features and third-party integrations",
    technologies: [
      {
        name: "OpenAI API",
        description: "Advanced AI language models",
        version: "GPT-4",
        purpose: "AI-powered code analysis and recommendations",
        status: "configured"
      },
      {
        name: "OpenRouter API",
        description: "Access to multiple AI models",
        version: "Latest",
        purpose: "Fallback AI service for enhanced recommendations",
        status: "configured"
      },
      {
        name: "Hugging Face API",
        description: "Open-source AI model platform",
        version: "Latest",
        purpose: "Alternative AI processing for skill analysis",
        status: "configured"
      },
      {
        name: "Judge0 CE API",
        description: "Code execution engine",
        version: "1.13.0",
        purpose: "Real-time code execution across 40+ programming languages",
        status: "integrated"
      },
      {
        name: "FastAPI (Python)",
        description: "High-performance Python web framework",
        version: "Latest",
        purpose: "Resume parsing and NLP processing microservice",
        status: "active"
      },
      {
        name: "spaCy",
        description: "Advanced NLP library",
        version: "3.x",
        purpose: "Named entity recognition and text analysis",
        status: "active"
      }
    ]
  },
  {
    title: "Development Tools",
    icon: <Code className="w-6 h-6" />,
    description: "Development environment and tooling",
    technologies: [
      {
        name: "ESBuild",
        description: "Ultra-fast JavaScript bundler",
        version: "Latest",
        purpose: "Fast TypeScript compilation and bundling",
        status: "active"
      },
      {
        name: "PostCSS",
        description: "CSS post-processor",
        version: "8.x",
        purpose: "CSS optimization and Tailwind processing",
        status: "active"
      },
      {
        name: "Autoprefixer",
        description: "CSS vendor prefix automation",
        version: "Latest",
        purpose: "Cross-browser CSS compatibility",
        status: "active"
      }
    ]
  },
  {
    title: "Security & Authentication",
    icon: <Shield className="w-6 h-6" />,
    description: "Robust security and user management",
    technologies: [
      {
        name: "HTTP-only Cookies",
        description: "Secure token storage",
        version: "Standard",
        purpose: "Secure JWT token storage in browser",
        status: "active"
      },
      {
        name: "Zod Validation",
        description: "TypeScript-first schema validation",
        version: "3.x",
        purpose: "Request/response validation and type safety",
        status: "active"
      },
      {
        name: "Express Session",
        description: "Session management middleware",
        version: "1.x",
        purpose: "User session handling and persistence",
        status: "active"
      },
      {
        name: "CORS",
        description: "Cross-Origin Resource Sharing",
        version: "Standard",
        purpose: "Secure cross-origin request handling",
        status: "active"
      }
    ]
  },
  {
    title: "Performance & Optimization",
    icon: <Zap className="w-6 h-6" />,
    description: "Speed and efficiency enhancements",
    technologies: [
      {
        name: "React Query Caching",
        description: "Intelligent data caching",
        version: "5.x",
        purpose: "Optimized API request caching and synchronization",
        status: "active"
      },
      {
        name: "Code Splitting",
        description: "Dynamic import optimization",
        version: "Built-in",
        purpose: "Reduced initial bundle size and faster loading",
        status: "active"
      },
      {
        name: "Image Optimization",
        description: "Efficient asset delivery",
        version: "Built-in",
        purpose: "Optimized image loading and performance",
        status: "active"
      }
    ]
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
    case 'integrated':
      return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
    case 'configured':
      return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
    default:
      return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
  }
};

export default function TechStack() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1 
              className="text-4xl font-bold text-foreground mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Technology Stack
            </motion.h1>
            <motion.p 
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Modern technologies powering the Mavericks Coding Platform
            </motion.p>
          </div>

          {/* Architecture Overview */}
          <div className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Platform Architecture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Globe className="w-12 h-12 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Frontend</h3>
                    <p className="text-sm text-muted-foreground">React 18 + TypeScript + Tailwind CSS</p>
                  </div>
                  <div className="text-center">
                    <Server className="w-12 h-12 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Backend</h3>
                    <p className="text-sm text-muted-foreground">Node.js + Express + Drizzle ORM</p>
                  </div>
                  <div className="text-center">
                    <Database className="w-12 h-12 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Database</h3>
                    <p className="text-sm text-muted-foreground">PostgreSQL + Neon Cloud</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Technology Categories */}
          {techStack.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {category.icon}
                    {category.title}
                  </CardTitle>
                  <p className="text-muted-foreground">{category.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.technologies.map((tech, techIndex) => (
                      <motion.div
                        key={tech.name}
                        className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: (categoryIndex * 0.1) + (techIndex * 0.05) }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <h4 className="font-semibold">{tech.name}</h4>
                            {tech.version && (
                              <Badge variant="outline" className="text-xs">
                                v{tech.version}
                              </Badge>
                            )}
                          </div>
                          <Badge className={getStatusColor(tech.status)}>
                            {tech.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {tech.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          <strong>Purpose:</strong> {tech.purpose}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Key Features */}
          <div className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Platform Capabilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Real-time Code Execution</h4>
                      <p className="text-sm text-muted-foreground">40+ programming languages with Judge0 CE</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">AI-Powered Analysis</h4>
                      <p className="text-sm text-muted-foreground">OpenAI GPT-4 integration for code review</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Resume Parsing</h4>
                      <p className="text-sm text-muted-foreground">Advanced NLP with spaCy and FastAPI</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Automated Testing</h4>
                      <p className="text-sm text-muted-foreground">Comprehensive test case validation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Real-time Feedback</h4>
                      <p className="text-sm text-muted-foreground">Instant performance reports and skill analysis</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Scalable Architecture</h4>
                      <p className="text-sm text-muted-foreground">Cloud-native design with PostgreSQL</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}