import React from 'react';
import { useSelector } from 'react-redux';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout';

function App() {
  // Get global theme from Redux
  const isDark = useSelector((state) => state.theme.isDark);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#050505]' : 'bg-[#fafafa]'}`}>
      
      {/* Redesigned Minimalist Toastify */}
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDark ? "dark" : "light"}
        transition={Slide} // Smoother 2026-style slide animation
        toastStyle={{
          // Tailwind-like inline styles for pixel-perfect control
          borderRadius: '14px',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)',
          fontSize: '10px',
          fontWeight: '900',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          fontFamily: 'Inter, sans-serif',
          backdropFilter: 'blur(12px)',
          background: isDark ? 'rgba(10, 10, 10, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.05)',
          padding: '12px 24px',
          minHeight: '48px',
        }}
      />
      
      <Layout />
    </div>
  );
}

export default App;