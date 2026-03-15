export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: 'student' | 'institute' | 'industry' | 'government' | 'admin';
  avatar?: string;
  isVerified: boolean;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AssessmentHistory {
  _id: string;
  category: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalStudents: number;
  totalInstitutes: number;
  totalAdmins: number;
  newThisMonth: number;
  recentUsers: User[];
}
