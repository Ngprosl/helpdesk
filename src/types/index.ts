// Tipos principales del sistema

// Represents a user in the system
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'technician' | 'user';
  department?: string;
  supportAreas: string[];
  isActive: boolean;
  isOnline: boolean;
  createdAt: string;
  lastLogin?: string;
  lastActivity?: string;
  failedAttempts: number;
  blockedUntil?: string;
  whitelistEntry?: boolean;
}

// Represents a support department
export interface Department {
  id: string;
  name: string;
  description: string;
  color: string;
  supportAreas: SupportArea[];
  isActive: boolean;
  createdAt: string;
}

// Represents a support area within a department
export interface SupportArea {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  priority: number;
}

// Represents a support ticket
export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'waiting' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  subcategory?: string;
  assignedTo?: string;
  assignedTechnicians: string[];
  suggestedTechnicians: string[];
  autoAssignAttempts: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  timeSpent: number; // en minutos
  estimatedTime?: number;
  tags: string[];
  attachments: Attachment[];
  comments: Comment[];
  autoAssigned: boolean;
  requiresAssignment: boolean;
}

// Represents a comment on a ticket
export interface Comment {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  content: string;
  isInternal: boolean;
  createdAt: string;
  timeTracked?: number;
}

// Represents a file attachment
export interface Attachment {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
}

// Represents a ticket category
export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  autoAssignRules: AutoAssignRule[];
  subcategories: Subcategory[];
}

// Represents a subcategory
export interface Subcategory {
  id: string;
  name: string;
  description: string;
}

// Represents an auto-assignment rule
export interface AutoAssignRule {
  id: string;
  conditions: AssignCondition[];
  assignTo: string[];
  priority: number;
}

// Represents a condition for auto-assignment
export interface AssignCondition {
  field: string;
  operator: 'equals' | 'contains' | 'starts_with' | 'ends_with';
  value: string;
}

// Represents a knowledge base article
export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  helpful: number;
  notHelpful: number;
  isPublic: boolean;
}

// Represents an AI provider configuration
export interface AIProvider {
  id: string;
  name: string;
  enabled: boolean;
  apiKey?: string;
  model?: string;
  endpoint?: string;
  features: AIFeature[];
}

// Represents an AI feature
export interface AIFeature {
  name: string;
  enabled: boolean;
  config: Record<string, any>;
}

// Represents system configuration
export interface SystemConfig {
  general: {
    companyName: string;
    supportEmail: string;
    timezone: string;
    language: string;
    dateFormat: string;
  };
  security: {
    maxFailedAttempts: number;
    lockoutDuration: number;
    sessionTimeout: number;
    requireWhitelist: boolean;
    strongPasswordPolicy: boolean;
  };
  tickets: {
    autoAssignEnabled: boolean;
    allowSelfAssign: boolean;
    requireApproval: boolean;
    defaultPriority: string;
    autoCloseAfterDays: number;
  };
  notifications: {
    emailEnabled: boolean;
    smtpServer: string;
    smtpPort: number;
    smtpUsername: string;
    smtpPassword: string;
    newTicketNotification: boolean;
    ticketUpdatedNotification: boolean;
    assignmentNotification: boolean;
  };
  ai: {
    enabled: boolean;
    providers: AIProvider[];
    autoSuggestSolutions: boolean;
    autoCategorizTickets: boolean;
    chatbotEnabled: boolean;
  };
}

// Represents a report
export interface Report {
  id: string;
  name: string;
  type: 'tickets' | 'technicians' | 'categories' | 'time';
  filters: ReportFilter[];
  dateRange: {
    start: string;
    end: string;
  };
  createdBy: string;
  createdAt: string;
}

// Represents a report filter
export interface ReportFilter {
  field: string;
  operator: string;
  value: any;
}

// Represents dashboard statistics
export interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedToday: number;
  averageResolutionTime: number;
  customerSatisfaction: number;
  activeTicketsByPriority: Record<string, number>;
  ticketsByCategory: Record<string, number>;
  technicianWorkload: Record<string, number>;
}