import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, FileText, BookOpen, Trophy, Settings, Eye, Edit, Trash2, Plus } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
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
  problemsSolved: number;
  createdAt: string;
  extractedSkills?: any;
  skillStrengths?: any;
  resumeText?: string;
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  topic: string;
  acceptance: string;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  lessons: number;
  duration: string;
  category: string;
}

export default function AdminPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createType, setCreateType] = useState<'assessment' | 'learning-path'>('assessment');

  // Fetch users
  const { data: users = [], isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
  });

  // Fetch assessments
  const { data: assessments = [], isLoading: assessmentsLoading } = useQuery<Assessment[]>({
    queryKey: ['/api/assessments'],
  });

  // Fetch learning paths
  const { data: learningPaths = [], isLoading: pathsLoading } = useQuery<LearningPath[]>({
    queryKey: ['/api/learning-paths'],
  });

  // Delete mutations
  const deleteAssessmentMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/admin/assessments/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/assessments'] });
      toast({ title: "Assessment deleted successfully" });
    },
  });

  const UserDetailModal = ({ user }: { user: User }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" data-testid={`view-user-${user.id}`}>
          <Eye className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Details: {user.firstName} {user.lastName}</DialogTitle>
          <DialogDescription>
            Comprehensive user profile and analytics
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div><strong>Username:</strong> {user.username}</div>
              <div><strong>Email:</strong> {user.email}</div>
              <div><strong>Role:</strong> 
                <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'} className="ml-2">
                  {user.role}
                </Badge>
              </div>
              <div><strong>Level:</strong> {user.level}</div>
              <div><strong>Points:</strong> {user.points}</div>
              <div><strong>Problems Solved:</strong> {user.problemsSolved}</div>
              <div><strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}</div>
            </CardContent>
          </Card>

          {user.extractedSkills && (
            <Card>
              <CardHeader>
                <CardTitle>AI-Extracted Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(user.extractedSkills).map(([skill, confidence]: [string, any]) => (
                    <Badge key={skill} variant="outline">
                      {skill} ({Math.round(confidence * 100)}%)
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {user.skillStrengths && (
            <Card>
              <CardHeader>
                <CardTitle>Skill Strengths Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(user.skillStrengths).map(([category, strength]: [string, any]) => (
                    <div key={category} className="flex justify-between">
                      <span className="capitalize">{category}:</span>
                      <Badge variant="secondary">{strength}/10</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {user.resumeText && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Resume Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-40 overflow-y-auto p-3 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                  {user.resumeText}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  const CreateModal = () => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      difficulty: 'Easy',
      topic: '',
      acceptance: '',
      problemStatement: '',
      starterCode: '',
      // Learning path specific
      lessons: 0,
      duration: '',
      category: '',
      icon: ''
    });

    const createMutation = useMutation({
      mutationFn: (data: any) => {
        const endpoint = createType === 'assessment' ? '/api/admin/assessments' : '/api/admin/learning-paths';
        return apiRequest(endpoint, { method: 'POST', body: data });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [createType === 'assessment' ? '/api/assessments' : '/api/learning-paths'] });
        setIsCreateModalOpen(false);
        setFormData({
          title: '', description: '', difficulty: 'Easy', topic: '', acceptance: '',
          problemStatement: '', starterCode: '', lessons: 0, duration: '', category: '', icon: ''
        });
        toast({ title: `${createType === 'assessment' ? 'Assessment' : 'Learning path'} created successfully` });
      },
    });

    return (
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New {createType === 'assessment' ? 'Assessment' : 'Learning Path'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate(formData);
          }} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                data-testid="input-title"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
                data-testid="textarea-description"
              />
            </div>

            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={formData.difficulty} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}>
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

            {createType === 'assessment' ? (
              <>
                <div>
                  <Label htmlFor="topic">Topic</Label>
                  <Input
                    id="topic"
                    value={formData.topic}
                    onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                    required
                    data-testid="input-topic"
                  />
                </div>
                
                <div>
                  <Label htmlFor="acceptance">Acceptance Rate</Label>
                  <Input
                    id="acceptance"
                    value={formData.acceptance}
                    onChange={(e) => setFormData(prev => ({ ...prev, acceptance: e.target.value }))}
                    placeholder="e.g., 45.2%"
                    data-testid="input-acceptance"
                  />
                </div>

                <div>
                  <Label htmlFor="problemStatement">Problem Statement</Label>
                  <Textarea
                    id="problemStatement"
                    value={formData.problemStatement}
                    onChange={(e) => setFormData(prev => ({ ...prev, problemStatement: e.target.value }))}
                    required
                    className="min-h-32"
                    data-testid="textarea-problem"
                  />
                </div>

                <div>
                  <Label htmlFor="starterCode">Starter Code</Label>
                  <Textarea
                    id="starterCode"
                    value={formData.starterCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, starterCode: e.target.value }))}
                    className="font-mono text-sm"
                    data-testid="textarea-code"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lessons">Number of Lessons</Label>
                    <Input
                      id="lessons"
                      type="number"
                      value={formData.lessons}
                      onChange={(e) => setFormData(prev => ({ ...prev, lessons: parseInt(e.target.value) || 0 }))}
                      required
                      data-testid="input-lessons"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="e.g., 4-6 weeks"
                      required
                      data-testid="input-duration"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      required
                      data-testid="input-category"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="icon">Icon</Label>
                    <Input
                      id="icon"
                      value={formData.icon}
                      onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                      placeholder="e.g., 🚀"
                      required
                      data-testid="input-icon"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-2">
              <Button type="submit" disabled={createMutation.isPending} data-testid="button-create">
                {createMutation.isPending ? 'Creating...' : 'Create'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <Badge variant="destructive">Admin Access Required</Badge>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="assessments" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Assessments
          </TabsTrigger>
          <TabsTrigger value="learning-paths" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Learning Paths
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage platform users and view their progress</CardDescription>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <div className="text-center py-8">Loading users...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Problems</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.firstName} {user.lastName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.level}</TableCell>
                        <TableCell>{user.points}</TableCell>
                        <TableCell>{user.problemsSolved}</TableCell>
                        <TableCell>
                          <UserDetailModal user={user} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessments" className="space-y-4">
          <div className="flex justify-between items-center">
            <Card className="flex-1 mr-4">
              <CardHeader>
                <CardTitle>Assessment Management</CardTitle>
                <CardDescription>Create and manage coding assessments</CardDescription>
              </CardHeader>
            </Card>
            <Button onClick={() => { setCreateType('assessment'); setIsCreateModalOpen(true); }} data-testid="button-create-assessment">
              <Plus className="w-4 h-4 mr-2" />
              Create Assessment
            </Button>
          </div>

          <Card>
            <CardContent className="pt-6">
              {assessmentsLoading ? (
                <div className="text-center py-8">Loading assessments...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Topic</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead>Acceptance</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assessments.map((assessment) => (
                      <TableRow key={assessment.id}>
                        <TableCell>{assessment.title}</TableCell>
                        <TableCell>{assessment.topic}</TableCell>
                        <TableCell>
                          <Badge variant={
                            assessment.difficulty === 'Easy' ? 'secondary' :
                            assessment.difficulty === 'Medium' ? 'default' : 'destructive'
                          }>
                            {assessment.difficulty}
                          </Badge>
                        </TableCell>
                        <TableCell>{assessment.acceptance}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" data-testid={`edit-assessment-${assessment.id}`}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => deleteAssessmentMutation.mutate(assessment.id)}
                              data-testid={`delete-assessment-${assessment.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learning-paths" className="space-y-4">
          <div className="flex justify-between items-center">
            <Card className="flex-1 mr-4">
              <CardHeader>
                <CardTitle>Learning Path Management</CardTitle>
                <CardDescription>Create and manage learning paths</CardDescription>
              </CardHeader>
            </Card>
            <Button onClick={() => { setCreateType('learning-path'); setIsCreateModalOpen(true); }} data-testid="button-create-path">
              <Plus className="w-4 h-4 mr-2" />
              Create Learning Path
            </Button>
          </div>

          <Card>
            <CardContent className="pt-6">
              {pathsLoading ? (
                <div className="text-center py-8">Loading learning paths...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead>Lessons</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {learningPaths.map((path) => (
                      <TableRow key={path.id}>
                        <TableCell>{path.title}</TableCell>
                        <TableCell>{path.category}</TableCell>
                        <TableCell>
                          <Badge variant={
                            path.difficulty === 'Beginner' ? 'secondary' :
                            path.difficulty === 'Intermediate' ? 'default' : 'destructive'
                          }>
                            {path.difficulty}
                          </Badge>
                        </TableCell>
                        <TableCell>{path.lessons}</TableCell>
                        <TableCell>{path.duration}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" data-testid={`edit-path-${path.id}`}>
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="stat-total-users">{users.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Total Assessments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="stat-total-assessments">{assessments.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Learning Paths</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="stat-total-paths">{learningPaths.length}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Level Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map(level => {
                  const count = users.filter(u => u.level === level).length;
                  const percentage = users.length > 0 ? (count / users.length) * 100 : 0;
                  return (
                    <div key={level} className="flex items-center justify-between">
                      <span>Level {level}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{count} users</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateModal />
    </div>
  );
}