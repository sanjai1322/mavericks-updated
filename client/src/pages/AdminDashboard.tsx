import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, BookOpen, Trophy, TrendingUp, Plus, Edit, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  level: number;
  points: number;
  createdAt: string;
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  topic: string;
  acceptance: string;
  problemStatement: string;
  starterCode?: string;
  testCases: any;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: string;
  lessons: number;
  duration: string;
  category: string;
  progress: number;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Fetch admin data
  const { data: users = [] } = useQuery({
    queryKey: ['/api/admin/users'],
    queryFn: () => apiRequest('/api/admin/users'),
  });

  const { data: assessments = [] } = useQuery({
    queryKey: ['/api/admin/assessments'],
    queryFn: () => apiRequest('/api/admin/assessments'),
  });

  const { data: learningPaths = [] } = useQuery({
    queryKey: ['/api/admin/learning-paths'],
    queryFn: () => apiRequest('/api/admin/learning-paths'),
  });

  const { data: stats } = useQuery({
    queryKey: ['/api/admin/stats'],
    queryFn: () => apiRequest('/api/admin/stats'),
  });

  // Mutations
  const createAssessmentMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/admin/assessments', { method: 'POST', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/assessments'] });
      toast({ title: "Assessment created successfully" });
      setIsCreateModalOpen(false);
    },
  });

  const updateUserRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      apiRequest(`/api/admin/users/${userId}/role`, { method: 'PUT', body: { role } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({ title: "User role updated successfully" });
    },
  });

  const deleteAssessmentMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/admin/assessments/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/assessments'] });
      toast({ title: "Assessment deleted successfully" });
    },
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage users, assessments, and platform content</p>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="users" data-testid="tab-users">Users</TabsTrigger>
          <TabsTrigger value="assessments" data-testid="tab-assessments">Assessments</TabsTrigger>
          <TabsTrigger value="learning-paths" data-testid="tab-learning-paths">Learning Paths</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card data-testid="card-total-users">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalUsers || users.length}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.newUsersToday || 0} new today
                </p>
              </CardContent>
            </Card>

            <Card data-testid="card-total-assessments">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Assessments</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{assessments.length}</div>
                <p className="text-xs text-muted-foreground">
                  Across {new Set(assessments.map((a: Assessment) => a.topic)).size} topics
                </p>
              </CardContent>
            </Card>

            <Card data-testid="card-total-learning-paths">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Learning Paths</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{learningPaths.length}</div>
                <p className="text-xs text-muted-foreground">
                  {new Set(learningPaths.map((p: LearningPath) => p.category)).size} categories
                </p>
              </CardContent>
            </Card>

            <Card data-testid="card-platform-activity">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Activity</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalSubmissions || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Total submissions
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user roles and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user: User) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`user-row-${user.id}`}>
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">@{user.username}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Level {user.level} • {user.points} pts
                      </span>
                      <Select
                        value={user.role}
                        onValueChange={(role) => updateUserRoleMutation.mutate({ userId: user.id, role })}
                      >
                        <SelectTrigger className="w-24" data-testid={`role-selector-${user.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessments" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Assessment Management</h2>
            <Button onClick={() => setIsCreateModalOpen(true)} data-testid="button-create-assessment">
              <Plus className="h-4 w-4 mr-2" />
              Create Assessment
            </Button>
          </div>

          <div className="grid gap-4">
            {assessments.map((assessment: Assessment) => (
              <Card key={assessment.id} data-testid={`assessment-card-${assessment.id}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{assessment.title}</CardTitle>
                      <CardDescription>{assessment.description}</CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Badge variant={
                        assessment.difficulty === 'Easy' ? 'secondary' :
                        assessment.difficulty === 'Medium' ? 'default' : 'destructive'
                      }>
                        {assessment.difficulty}
                      </Badge>
                      <Badge variant="outline">{assessment.topic}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Acceptance Rate: {assessment.acceptance}
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingItem(assessment)}
                        data-testid={`button-edit-${assessment.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteAssessmentMutation.mutate(assessment.id)}
                        data-testid={`button-delete-${assessment.id}`}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="learning-paths" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Learning Path Management</h2>
            <Button onClick={() => setIsCreateModalOpen(true)} data-testid="button-create-learning-path">
              <Plus className="h-4 w-4 mr-2" />
              Create Learning Path
            </Button>
          </div>

          <div className="grid gap-4">
            {learningPaths.map((path: LearningPath) => (
              <Card key={path.id} data-testid={`learning-path-card-${path.id}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{path.icon}</span>
                      <div>
                        <CardTitle className="text-lg">{path.title}</CardTitle>
                        <CardDescription>{path.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Badge variant="outline">{path.difficulty}</Badge>
                      <Badge variant="secondary">{path.category}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>{path.lessons} lessons</span>
                      <span>{path.duration}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingItem(path)}
                        data-testid={`button-edit-path-${path.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Assessment Modal would go here */}
      {isCreateModalOpen && (
        <CreateAssessmentModal
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={(data) => createAssessmentMutation.mutate(data)}
        />
      )}
    </div>
  );
}

function CreateAssessmentModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'Easy',
    topic: '',
    acceptance: '50%',
    problemStatement: '',
    starterCode: '',
    testCases: '[]'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      testCases: JSON.parse(formData.testCases || '[]')
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Create New Assessment</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              data-testid="input-assessment-title"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              data-testid="textarea-assessment-description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
                <SelectTrigger data-testid="select-difficulty">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                required
                data-testid="input-assessment-topic"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="problemStatement">Problem Statement</Label>
            <Textarea
              id="problemStatement"
              value={formData.problemStatement}
              onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
              required
              rows={5}
              data-testid="textarea-problem-statement"
            />
          </div>

          <div>
            <Label htmlFor="starterCode">Starter Code (Optional)</Label>
            <Textarea
              id="starterCode"
              value={formData.starterCode}
              onChange={(e) => setFormData({ ...formData, starterCode: e.target.value })}
              rows={4}
              data-testid="textarea-starter-code"
            />
          </div>

          <div className="flex space-x-4">
            <Button type="button" variant="outline" onClick={onClose} data-testid="button-cancel-assessment">
              Cancel
            </Button>
            <Button type="submit" data-testid="button-submit-assessment">
              Create Assessment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}