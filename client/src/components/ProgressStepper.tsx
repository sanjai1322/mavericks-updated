import { motion } from "framer-motion";

interface ProgressStep {
  label: string;
  progress: number;
  color?: string;
}

interface ProgressStepperProps {
  steps: ProgressStep[];
  className?: string;
}

export default function ProgressStepper({ steps, className }: ProgressStepperProps) {
  const getProgressColor = (color?: string) => {
    switch (color) {
      case "blue":
        return "from-blue-500 to-blue-600";
      case "green":
        return "from-green-500 to-green-600";
      case "purple":
        return "from-purple-500 to-purple-600";
      case "orange":
        return "from-orange-500 to-orange-600";
      default:
        return "from-light-primary to-light-accent";
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {steps.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="space-y-2"
        >
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-900 dark:text-white">
              {step.label}
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              {step.progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${step.progress}%` }}
              transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
              className={`bg-gradient-to-r ${getProgressColor(step.color)} h-2 rounded-full`}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
