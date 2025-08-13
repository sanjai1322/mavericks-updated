import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Target, 
  Clock, 
  Star, 
  Brain, 
  Code, 
  Users, 
  BookOpen,
  Zap,
  Trophy,
  Settings,
  ChevronRight,
  Plus
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CustomizationForm {
  goal: string;
  experience: string;
  timeCommitment: number[];
  preferredTopics: string[];
  learningStyle: string;
  projectPreference: string;
  difficultyPreference: string;
  specializations: string[];
  customGoals: string;
  weeklyHours: number[];
}

const learningGoals = [
  { id: "career-change", label: "Career Change", icon: "🔄", description: "Switch to a new tech career" },
  { id: "skill-upgrade", label: "Skill Upgrade", icon: "⬆️", description: "Enhance current technical skills" },
  { id: "interview-prep", label: "Interview Preparation", icon: "💼", description: "Prepare for coding interviews" },
  { id: "freelance", label: "Freelancing", icon: "💻", description: "Build skills for freelance work" },
  { id: "startup", label: "Startup Skills", icon: "🚀", description: "Learn to build products from scratch" },
  { id: "certification", label: "Certification", icon: "🏆", description: "Prepare for technical certifications" }
];

const experienceLevels = [
  { id: "absolute-beginner", label: "Absolute Beginner", description: "No programming experience" },
  { id: "some-basics", label: "Some Basics", description: "Familiar with basic programming concepts" },
  { id: "intermediate", label: "Intermediate", description: "Can build simple applications" },
  { id: "advanced", label: "Advanced", description: "Experienced developer looking to specialize" }
];

const topicAreas = [
  { id: "web-frontend", label: "Frontend Web Development", icon: "🌐", color: "bg-blue-100 text-blue-800" },
  { id: "web-backend", label: "Backend Development", icon: "⚙️", color: "bg-green-100 text-green-800" },
  { id: "mobile", label: "Mobile Development", icon: "📱", color: "bg-purple-100 text-purple-800" },
  { id: "data-science", label: "Data Science & ML", icon: "📊", color: "bg-orange-100 text-orange-800" },
  { id: "algorithms", label: "Algorithms & DSA", icon: "🧠", color: "bg-red-100 text-red-800" },
  { id: "devops", label: "DevOps & Cloud", icon: "☁️", color: "bg-cyan-100 text-cyan-800" },
  { id: "security", label: "Cybersecurity", icon: "🔒", color: "bg-gray-100 text-gray-800" },
  { id: "game-dev", label: "Game Development", icon: "🎮", color: "bg-pink-100 text-pink-800" }
];

const learningStyles = [
  { id: "hands-on", label: "Hands-on Projects", description: "Learn by building real applications", icon: "🔨" },
  { id: "theory-first", label: "Theory First", description: "Understand concepts before implementation", icon: "📚" },
  { id: "mixed", label: "Mixed Approach", description: "Balance between theory and practice", icon: "⚖️" },
  { id: "video-heavy", label: "Video Learning", description: "Prefer video tutorials and demonstrations", icon: "🎥" }
];

const projectTypes = [
  { id: "portfolio", label: "Portfolio Projects", description: "Build impressive projects for your portfolio" },
  { id: "real-world", label: "Real-world Applications", description: "Work on projects that solve actual problems" },
  { id: "tutorial-guided", label: "Guided Tutorials", description: "Step-by-step project walkthroughs" },
  { id: "open-source", label: "Open Source", description: "Contribute to existing open source projects" }
];

const specializations = [
  "React/Vue.js", "Node.js/Express", "Python/Django", "Java/Spring", "Machine Learning",
  "Cloud Computing", "Blockchain", "IoT", "AR/VR", "API Development", "Database Design",
  "UI/UX Design", "Testing", "Performance Optimization", "Microservices"
];

export default function CustomizeLearningPath() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CustomizationForm>({
    goal: "",
    experience: "",
    timeCommitment: [10],
    preferredTopics: [],
    learningStyle: "",
    projectPreference: "",
    difficultyPreference: "progressive",
    specializations: [],
    customGoals: "",
    weeklyHours: [5]
  });

  const createCustomPathMutation = useMutation({
    mutationFn: (data: CustomizationForm) =>
      apiRequest('/api/learning-paths/customize', {
        method: 'POST',
        body: data
      }),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['/api/learning-paths'] });
      toast({ 
        title: "Custom Learning Path Created!", 
        description: "Your personalized learning journey is ready." 
      });
      window.location.href = `/learning/${response.pathId}`;
    },
    onError: () => {
      toast({ 
        title: "Error", 
        description: "Failed to create custom learning path.", 
        variant: "destructive" 
      });
    }
  });

  const handleTopicToggle = (topicId: string) => {
    setFormData(prev => ({
      ...prev,
      preferredTopics: prev.preferredTopics.includes(topicId)
        ? prev.preferredTopics.filter(id => id !== topicId)
        : [...prev.preferredTopics, topicId]
    }));
  };

  const handleSpecializationToggle = (spec: string) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter(s => s !== spec)
        : [...prev.specializations, spec]
    }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = () => {
    createCustomPathMutation.mutate(formData);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to customize your learning path</h1>
          <Button onClick={() => window.location.href = "/login"}>Go to Login</Button>
        </div>
      </div>
    );
  }

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1 
              className="text-3xl font-bold text-foreground mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Customize Your Learning Path
            </motion.h1>
            <motion.p 
              className="text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Create a personalized learning journey tailored to your goals and preferences
            </motion.p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Step {step} of {totalSteps}</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% complete</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <motion.div
                className="bg-primary h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Step Content */}
          <Card className="mb-8">
            <CardContent className="p-8">
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <CardHeader className="p-0 mb-6">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      What's your primary learning goal?
                    </CardTitle>
                  </CardHeader>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {learningGoals.map((goal) => (
                      <div
                        key={goal.id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.goal === goal.id
                            ? 'border-primary bg-primary/5'
                            : 'border-muted hover:border-primary/50'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, goal: goal.id }))}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{goal.icon}</span>
                          <div>
                            <h3 className="font-semibold mb-1">{goal.label}</h3>
                            <p className="text-sm text-muted-foreground">{goal.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <Label htmlFor="custom-goals">Additional Goals (Optional)</Label>
                    <Textarea
                      id="custom-goals"
                      placeholder="Describe any specific goals or requirements..."
                      value={formData.customGoals}
                      onChange={(e) => setFormData(prev => ({ ...prev, customGoals: e.target.value }))}
                      className="mt-2"
                    />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <CardHeader className="p-0 mb-6">
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      What's your experience level?
                    </CardTitle>
                  </CardHeader>
                  
                  <RadioGroup
                    value={formData.experience}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}
                  >
                    {experienceLevels.map((level) => (
                      <div key={level.id} className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50">
                        <RadioGroupItem value={level.id} id={level.id} />
                        <div className="flex-1">
                          <Label htmlFor={level.id} className="font-medium cursor-pointer">
                            {level.label}
                          </Label>
                          <p className="text-sm text-muted-foreground">{level.description}</p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>

                  <div className="mt-6">
                    <Label className="text-base font-medium mb-4 block">
                      How many hours per week can you dedicate to learning?
                    </Label>
                    <div className="px-4">
                      <Slider
                        value={formData.weeklyHours}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, weeklyHours: value }))}
                        max={40}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-2">
                        <span>1 hour</span>
                        <span className="font-medium">{formData.weeklyHours[0]} hours/week</span>
                        <span>40 hours</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <CardHeader className="p-0 mb-6">
                    <CardTitle className="flex items-center gap-2">
                      <Code className="w-5 h-5" />
                      What topics interest you most?
                    </CardTitle>
                    <p className="text-muted-foreground">Select all that apply</p>
                  </CardHeader>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {topicAreas.map((topic) => (
                      <div
                        key={topic.id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.preferredTopics.includes(topic.id)
                            ? 'border-primary bg-primary/5'
                            : 'border-muted hover:border-primary/50'
                        }`}
                        onClick={() => handleTopicToggle(topic.id)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{topic.icon}</span>
                          <div className="flex-1">
                            <h3 className="font-semibold">{topic.label}</h3>
                          </div>
                          {formData.preferredTopics.includes(topic.id) && (
                            <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <CardHeader className="p-0 mb-6">
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      How do you prefer to learn?
                    </CardTitle>
                  </CardHeader>
                  
                  <div className="space-y-4 mb-6">
                    {learningStyles.map((style) => (
                      <div
                        key={style.id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.learningStyle === style.id
                            ? 'border-primary bg-primary/5'
                            : 'border-muted hover:border-primary/50'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, learningStyle: style.id }))}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{style.icon}</span>
                          <div>
                            <h3 className="font-semibold mb-1">{style.label}</h3>
                            <p className="text-sm text-muted-foreground">{style.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <Label className="text-base font-medium mb-4 block">
                      What type of projects do you want to work on?
                    </Label>
                    <Select 
                      value={formData.projectPreference} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, projectPreference: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            <div>
                              <div className="font-medium">{type.label}</div>
                              <div className="text-sm text-muted-foreground">{type.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <CardHeader className="p-0 mb-6">
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Final customizations
                    </CardTitle>
                  </CardHeader>
                  
                  <div className="space-y-6">
                    <div>
                      <Label className="text-base font-medium mb-4 block">
                        Specializations (Optional)
                      </Label>
                      <p className="text-sm text-muted-foreground mb-4">
                        Select specific technologies or areas you want to focus on
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {specializations.map((spec) => (
                          <div key={spec} className="flex items-center space-x-2">
                            <Checkbox
                              id={spec}
                              checked={formData.specializations.includes(spec)}
                              onCheckedChange={() => handleSpecializationToggle(spec)}
                            />
                            <Label htmlFor={spec} className="text-sm cursor-pointer">
                              {spec}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-medium mb-4 block">
                        Difficulty Progression
                      </Label>
                      <RadioGroup
                        value={formData.difficultyPreference}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, difficultyPreference: value }))}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="progressive" id="progressive" />
                          <Label htmlFor="progressive">Progressive (Start easy, gradually increase)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="challenge" id="challenge" />
                          <Label htmlFor="challenge">Challenge me (Jump into intermediate concepts)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="review" id="review" />
                          <Label htmlFor="review">Review fundamentals first</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={step === 1}
            >
              Previous
            </Button>
            
            {step < totalSteps ? (
              <Button
                onClick={nextStep}
                disabled={
                  (step === 1 && !formData.goal) ||
                  (step === 2 && !formData.experience) ||
                  (step === 3 && formData.preferredTopics.length === 0) ||
                  (step === 4 && !formData.learningStyle)
                }
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={createCustomPathMutation.isPending}
              >
                {createCustomPathMutation.isPending ? (
                  "Creating..."
                ) : (
                  <>
                    Create My Learning Path
                    <Plus className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}