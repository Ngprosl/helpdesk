import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  SystemConfig, 
  Ticket, 
  User, 
  Category, 
  KnowledgeArticle, 
  DashboardStats, 
  Department,
  EmailAccount,
  ImportedEmail,
  EmailProcessingRule,
  EmailSyncStatus
} from '../types';

interface SystemContextType {
  config: SystemConfig;
  updateConfig: (config: Partial<SystemConfig>) => void;
  tickets: Ticket[];
  users: User[];
  categories: Category[];
  knowledgeArticles: KnowledgeArticle[];
  departments: Department[];
  emailAccounts: EmailAccount[];
  importedEmails: ImportedEmail[];
  emailProcessingRules: EmailProcessingRule[];
  emailSyncStatus: EmailSyncStatus[];
  dashboardStats: DashboardStats;
  createTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
  deleteTicket: (id: string) => void;
  createUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  createKnowledgeArticle: (article: Omit<KnowledgeArticle, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'helpful' | 'notHelpful'>) => void;
  updateKnowledgeArticle: (id: string, updates: Partial<KnowledgeArticle>) => void;
  createDepartment: (department: Omit<Department, 'id' | 'createdAt'>) => void;
  updateDepartment: (id: string, updates: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;
  createEmailAccount: (account: Omit<EmailAccount, 'id' | 'createdAt'>) => void;
  updateEmailAccount: (id: string, updates: Partial<EmailAccount>) => void;
  deleteEmailAccount: (id: string) => void;
  testEmailConnection: (accountId: string) => Promise<boolean>;
  syncEmailAccount: (accountId: string) => Promise<void>;
  processEmail: (emailId: string) => Promise<void>;
  createEmailProcessingRule: (rule: Omit<EmailProcessingRule, 'id' | 'createdAt'>) => void;
  updateEmailProcessingRule: (id: string, updates: Partial<EmailProcessingRule>) => void;
  deleteEmailProcessingRule: (id: string) => void;
  assignTicketToAvailableTechnician: (ticketId: string) => boolean;
  getUnassignedTickets: () => Ticket[];
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

const defaultConfig: SystemConfig = {
  general: {
    companyName: 'TechSupport Pro',
    supportEmail: 'support@company.com',
    timezone: 'Europe/Madrid',
    language: 'es',
    dateFormat: 'dd/MM/yyyy'
  },
  security: {
    maxFailedAttempts: 3,
    lockoutDuration: 15,
    sessionTimeout: 480,
    requireWhitelist: false,
    strongPasswordPolicy: true
  },
  tickets: {
    autoAssignEnabled: true,
    allowSelfAssign: true,
    requireApproval: false,
    defaultPriority: 'medium',
    autoCloseAfterDays: 30
  },
  notifications: {
    emailEnabled: true,
    smtpServer: 'smtp.company.com',
    smtpPort: 587,
    smtpUsername: 'support@company.com',
    smtpPassword: '',
    newTicketNotification: true,
    ticketUpdatedNotification: true,
    assignmentNotification: true
  },
  ai: {
    enabled: false,
    providers: [
      {
        id: 'openai',
        name: 'OpenAI GPT',
        enabled: false,
        features: [
          { name: 'autoSuggestSolutions', enabled: false, config: {} },
          { name: 'autoCategorizTickets', enabled: false, config: {} },
          { name: 'chatbot', enabled: false, config: {} }
        ]
      },
      {
        id: 'claude',
        name: 'Anthropic Claude',
        enabled: false,
        features: [
          { name: 'autoSuggestSolutions', enabled: false, config: {} },
          { name: 'autoCategorizTickets', enabled: false, config: {} },
          { name: 'chatbot', enabled: false, config: {} }
        ]
      }
    ],
    autoSuggestSolutions: false,
    autoCategorizTickets: false,
    chatbotEnabled: false
  }
};

const mockTickets: Ticket[] = [];

const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@company.com',
    name: 'Administrador Sistema',
    role: 'admin',
    supportAreas: [],
    isActive: true,
    isOnline: true,
    createdAt: '2024-01-01',
    failedAttempts: 0,
    whitelistEntry: true,
    lastActivity: new Date().toISOString()
  },
  {
    id: '2',
    email: 'tech1@company.com',
    name: 'Juan Pérez',
    role: 'technician',
    department: '',
    supportAreas: [],
    isActive: true,
    isOnline: true,
    createdAt: '2024-01-01',
    failedAttempts: 0,
    lastActivity: new Date().toISOString()
  },
  {
    id: '3',
    email: 'user@company.com',
    name: 'María García',
    role: 'user',
    department: '',
    supportAreas: [],
    isActive: true,
    isOnline: false,
    createdAt: '2024-01-01',
    failedAttempts: 0,
    lastActivity: new Date(Date.now() - 3600000).toISOString()
  }
];

const mockCategories: Category[] = [];

const mockKnowledgeArticles: KnowledgeArticle[] = [];

const mockDepartments: Department[] = [];

const mockEmailAccounts: EmailAccount[] = [];
const mockImportedEmails: ImportedEmail[] = [];
const mockEmailProcessingRules: EmailProcessingRule[] = [];
const mockEmailSyncStatus: EmailSyncStatus[] = [];

export function SystemProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SystemConfig>(defaultConfig);
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [knowledgeArticles, setKnowledgeArticles] = useState<KnowledgeArticle[]>(mockKnowledgeArticles);
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [emailAccounts, setEmailAccounts] = useState<EmailAccount[]>(mockEmailAccounts);
  const [importedEmails, setImportedEmails] = useState<ImportedEmail[]>(mockImportedEmails);
  const [emailProcessingRules, setEmailProcessingRules] = useState<EmailProcessingRule[]>(mockEmailProcessingRules);
  const [emailSyncStatus, setEmailSyncStatus] = useState<EmailSyncStatus[]>(mockEmailSyncStatus);

  useEffect(() => {
    // Cargar configuración guardada
    const savedConfig = localStorage.getItem('systemConfig');
    if (savedConfig) {
      setConfig({ ...defaultConfig, ...JSON.parse(savedConfig) });
    }

    // Cargar datos guardados
    const savedTickets = localStorage.getItem('tickets');
    if (savedTickets) {
      setTickets(JSON.parse(savedTickets));
    }

    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }

    const savedArticles = localStorage.getItem('knowledgeArticles');
    if (savedArticles) {
      setKnowledgeArticles(JSON.parse(savedArticles));
    }

    const savedDepartments = localStorage.getItem('departments');
    if (savedDepartments) {
      setDepartments(JSON.parse(savedDepartments));
    }

    const savedEmailAccounts = localStorage.getItem('emailAccounts');
    if (savedEmailAccounts) {
      setEmailAccounts(JSON.parse(savedEmailAccounts));
    }

    const savedImportedEmails = localStorage.getItem('importedEmails');
    if (savedImportedEmails) {
      setImportedEmails(JSON.parse(savedImportedEmails));
    }

    const savedEmailProcessingRules = localStorage.getItem('emailProcessingRules');
    if (savedEmailProcessingRules) {
      setEmailProcessingRules(JSON.parse(savedEmailProcessingRules));
    }
  }, []);

  const updateConfig = (newConfig: Partial<SystemConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    localStorage.setItem('systemConfig', JSON.stringify(updatedConfig));
  };

  const createTicket = (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updatedTickets = [newTicket, ...tickets];
    setTickets(updatedTickets);
    localStorage.setItem('tickets', JSON.stringify(updatedTickets));
  };

  const updateTicket = (id: string, updates: Partial<Ticket>) => {
    const updatedTickets = tickets.map(ticket => 
      ticket.id === id 
        ? { ...ticket, ...updates, updatedAt: new Date().toISOString() }
        : ticket
    );
    setTickets(updatedTickets);
    localStorage.setItem('tickets', JSON.stringify(updatedTickets));
  };

  const deleteTicket = (id: string) => {
    const updatedTickets = tickets.filter(ticket => ticket.id !== id);
    setTickets(updatedTickets);
    localStorage.setItem('tickets', JSON.stringify(updatedTickets));
  };

  const createUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    const updatedUsers = [newUser, ...users];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    const updatedUsers = users.map(user => 
      user.id === id ? { ...user, ...updates } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const deleteUser = (id: string) => {
    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const createKnowledgeArticle = (articleData: Omit<KnowledgeArticle, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'helpful' | 'notHelpful'>) => {
    const newArticle: KnowledgeArticle = {
      ...articleData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      helpful: 0,
      notHelpful: 0
    };
    const updatedArticles = [newArticle, ...knowledgeArticles];
    setKnowledgeArticles(updatedArticles);
    localStorage.setItem('knowledgeArticles', JSON.stringify(updatedArticles));
  };

  const updateKnowledgeArticle = (id: string, updates: Partial<KnowledgeArticle>) => {
    const updatedArticles = knowledgeArticles.map(article => 
      article.id === id ? { ...article, ...updates } : article
    );
    setKnowledgeArticles(updatedArticles);
    localStorage.setItem('knowledgeArticles', JSON.stringify(updatedArticles));
  };

  const createDepartment = (departmentData: Omit<Department, 'id' | 'createdAt'>) => {
    const newDepartment: Department = {
      ...departmentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    const updatedDepartments = [newDepartment, ...departments];
    setDepartments(updatedDepartments);
    localStorage.setItem('departments', JSON.stringify(updatedDepartments));
  };

  const updateDepartment = (id: string, updates: Partial<Department>) => {
    const updatedDepartments = departments.map(dept => 
      dept.id === id ? { ...dept, ...updates } : dept
    );
    setDepartments(updatedDepartments);
    localStorage.setItem('departments', JSON.stringify(updatedDepartments));
  };

  const deleteDepartment = (id: string) => {
    const updatedDepartments = departments.filter(dept => dept.id !== id);
    setDepartments(updatedDepartments);
    localStorage.setItem('departments', JSON.stringify(updatedDepartments));
  };

  const assignTicketToAvailableTechnician = (ticketId: string): boolean => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket || ticket.assignedTechnicians.length > 0) return false;

    // Buscar técnicos online con áreas de soporte relevantes
    const availableTechnicians = users.filter(user => 
      user.role === 'technician' && 
      user.isActive && 
      user.isOnline &&
      user.supportAreas.length > 0
    );

    if (availableTechnicians.length === 0) return false;

    // Asignar al primer técnico disponible
    const assignedTechnician = availableTechnicians[0];
    updateTicket(ticketId, {
      assignedTechnicians: [assignedTechnician.id],
      autoAssigned: true,
      requiresAssignment: false,
      autoAssignAttempts: (ticket.autoAssignAttempts || 0) + 1
    });

    return true;
  };

  const getUnassignedTickets = (): Ticket[] => {
    return tickets.filter(ticket => 
      ticket.status !== 'closed' && 
      ticket.assignedTechnicians.length === 0 &&
      ticket.requiresAssignment
    );
  };

  // Calcular estadísticas del dashboard
  const dashboardStats: DashboardStats = {
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    resolvedToday: 0,
    averageResolutionTime: 0,
    customerSatisfaction: 0,
    activeTicketsByPriority: {},
    ticketsByCategory: {},
    technicianWorkload: {}
  };

  return (
    <SystemContext.Provider value={{
      config,
      updateConfig,
      tickets,
      users,
      categories,
      knowledgeArticles,
      departments,
      emailAccounts,
      importedEmails,
      emailProcessingRules,
      emailSyncStatus,
      dashboardStats,
      createTicket,
      updateTicket,
      deleteTicket,
      createUser,
      updateUser,
      deleteUser,
      createKnowledgeArticle,
      updateKnowledgeArticle,
      createDepartment,
      updateDepartment,
      deleteDepartment,
      createEmailAccount,
      updateEmailAccount,
      deleteEmailAccount,
      testEmailConnection,
      syncEmailAccount,
      processEmail,
      createEmailProcessingRule,
      updateEmailProcessingRule,
      deleteEmailProcessingRule,
      assignTicketToAvailableTechnician,
      getUnassignedTickets
    }}>
      {children}
    </SystemContext.Provider>
  );
}

export function useSystem() {
  const context = useContext(SystemContext);
  if (context === undefined) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
}