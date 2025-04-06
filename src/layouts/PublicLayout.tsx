import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}