import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SystemProvider } from './contexts/SystemContext';
import { SearchProvider } from './contexts/SearchContext';
import { Layout } from './components/Layout/Layout';
import { LoginForm } from './components/Auth/LoginForm';
import { Dashboard } from './components/Dashboard/Dashboard';
import { TicketList } from './components/Tickets/TicketList';
import { UserManagement } from './components/Users/UserManagement';
import { DepartmentManagement } from './components/Departments/DepartmentManagement';
import { KnowledgeBase } from './components/Knowledge/KnowledgeBase';
import { Reports } from './components/Reports/Reports';
import { Settings } from './components/Settings/Settings';
import { AIAssistant } from './components/AI/AIAssistant';
import { Security } from './components/Security/Security';
import { Email } from './components/Email/Email';
import { useAuth } from './contexts/AuthContext';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tickets" element={<TicketList />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/departments" element={<DepartmentManagement />} />
        <Route path="/knowledge" element={<KnowledgeBase />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/ai" element={<AIAssistant />} />
        <Route path="/security" element={<Security />} />
        <Route path="/email" element={<Email />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <SystemProvider>
          <SearchProvider>
            <AppContent />
          </SearchProvider>
        </SystemProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;