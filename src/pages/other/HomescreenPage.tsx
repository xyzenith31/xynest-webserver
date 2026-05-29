import { useNavigate } from 'react-router-dom';

export default function HomescreenPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Selamat Datang di XyNest! 🎉</h1>
      <p className="text-gray-600 mb-8">Kamu berhasil login.</p>
      <button 
        onClick={handleLogout}
        className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}