import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Navigation } from './components/Navigation';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { ProductList } from './components/products/ProductList';
import { RequestList } from './components/requests/RequestList';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <Toaster />
          <Routes>
            <Route path="/" element={<Navigate to="/products" replace />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/my-requests" element={<RequestList showAllRequests={false} />} />
            <Route path="/all-requests" element={<RequestList showAllRequests={true} />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
