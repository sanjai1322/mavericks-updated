import { motion } from "framer-motion";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: "fas fa-code",
    title: "Interactive Challenges",
    description: "Solve coding problems with our interactive code editor and instant feedback.",
    gradient: "from-blue-500 to-purple-600"
  },
  {
    icon: "fas fa-trophy",
    title: "Competitive Programming",
    description: "Participate in hackathons and climb the leaderboard to showcase your skills.",
    gradient: "from-green-500 to-teal-600"
  },
  {
    icon: "fas fa-route",
    title: "Personalized Learning",
    description: "AI-powered learning paths tailored to your skill level and goals.",
    gradient: "from-orange-500 to-red-600"
  },
  {
    icon: "fas fa-users",
    title: "Community Driven",
    description: "Connect with fellow developers and learn from each other.",
    gradient: "from-purple-500 to-pink-600"
  },
  {
    icon: "fas fa-chart-line",
    title: "Progress Tracking",
    description: "Monitor your improvement with detailed analytics and progress reports.",
    gradient: "from-indigo-500 to-blue-600"
  },
  {
    icon: "fas fa-certificate",
    title: "Certifications",
    description: "Earn certificates and badges to validate your programming skills.",
    gradient: "from-yellow-500 to-orange-600"
  }
];

const stats = [
  { number: "500+", label: "Coding Challenges" },
  { number: "10K+", label: "Active Learners" },
  { number: "50+", label: "Hackathons Hosted" }
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg text-gray-900 dark:text-gray-100">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-light-primary via-light-accent to-light-primary dark:from-dark-primary dark:via-dark-accent dark:to-dark-primary"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="animate-float"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-light-primary to-light-accent dark:from-dark-accent dark:to-dark-accent bg-clip-text text-transparent">
                Mavericks
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">Coding Platform</span>
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
          >
            Learn. Compete. Grow.
          </motion.p>
          
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto"
          >
            Master coding skills through interactive challenges, compete in hackathons, and grow with a community of passionate developers.
          </motion.p>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            {user ? (
              <Link href="/dashboard">
                <Button 
                  size="lg"
                  className="px-8 py-4 bg-gradient-to-r from-light-primary to-light-accent dark:from-dark-primary dark:to-dark-accent text-white font-semibold rounded-xl hover:scale-105 transition-transform shadow-lg hover:shadow-xl"
                >
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/register">
                  <Button 
                    size="lg"
                    className="px-8 py-4 bg-gradient-to-r from-light-primary to-light-accent dark:from-dark-primary dark:to-dark-accent text-white font-semibold rounded-xl hover:scale-105 transition-transform shadow-lg hover:shadow-xl"
                  >
                    Start Learning
                  </Button>
                </Link>
                <Button 
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 border-2 border-light-primary dark:border-dark-accent text-light-primary dark:text-dark-accent font-semibold rounded-xl hover:bg-light-primary hover:text-white dark:hover:bg-dark-accent dark:hover:text-black transition-all"
                >
                  Watch Demo
                </Button>
              </>
            )}
          </motion.div>

          {/* Feature Stats */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-light-primary dark:text-dark-accent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Everything you need to become a better developer
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-lg flex items-center justify-center mb-4`}>
                  <i className={`${feature.icon} text-white text-xl`}></i>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
