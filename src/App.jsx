import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';

import { useSession } from './context/SessionContext';
import { Loader2 } from 'lucide-react';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const SignLanguage = lazy(() => import('./pages/SignLanguage'));
const Maths = lazy(() => import('./pages/Maths'));
const Science = lazy(() => import('./pages/Science'));
const ProgressReport = lazy(() => import('./pages/ProgressReport'));
const TeacherPanel = lazy(() => import('./pages/TeacherPanel'));

const App = () => {
  const { loading } = useSession();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="animate-spin w-12 h-12 text-primary-sign" />
      </div>
    );
  }

  return (
    <Router>
      <div style={{ minHeight: "100vh", backgroundColor: "#090909" }}>
        <Header />
        <Suspense fallback={
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
            <div style={{ width: 32, height: 32, border: "2px solid #262626", borderTopColor: "#6a4cf5", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sign-language/*" element={<SignLanguage />} />
            <Route path="/maths/*" element={<Maths />} />
            <Route path="/science/*" element={<Science />} />
            <Route path="/progress-report" element={<ProgressReport />} />
            <Route path="/teacher" element={<TeacherPanel />} />
            <Route path="*" element={<div style={{ textAlign: "center", padding: "80px 24px", color: "#999", fontSize: 18 }}>404 — Page not found</div>} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
};

export default App;
