import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 antialiased selection:bg-indigo-500 selection:text-white">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-6 transition-all duration-300 hover:shadow-md">
        <div className="text-center flex flex-col gap-1.5">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
        
        <div className="flex flex-col gap-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;