import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLayout from './admin/AdminLayout';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import VehicleDetail from './pages/VehicleDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import CarFinder from './pages/CarFinder';
import Compare from './pages/Compare';
import Finance from './pages/Finance';
import FinanceApplication from './pages/FinanceApplication';
import SellYourCar from './pages/SellYourCar';
import Team from './pages/Team';
import Directions from './pages/Directions';
import BookAppointment from './pages/BookAppointment';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Sitemap from './pages/Sitemap';
import AdminLogin from './admin/Login';
import AdminDashboard from './admin/Dashboard';
import AdminCars from './admin/Cars';
import AdminEditCar from './admin/EditCar';
import AdminSubmissions from './admin/Submissions';
import AdminSettings from './admin/Settings';

function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-full flex flex-col bg-black text-white">
      {isAdmin ? (
        <AdminLayout>
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/cars/new" element={<AdminCars />} />
            <Route path="/admin/cars/:id/edit" element={<AdminEditCar />} />
            <Route path="/admin/submissions" element={<AdminSubmissions />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Routes>
        </AdminLayout>
      ) : (
        <>
          <Navbar />
          <main className="flex-1 pt-[104px] md:pt-[120px]">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/inventory/:slug" element={<VehicleDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/car-finder" element={<CarFinder />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/finance/application" element={<FinanceApplication />} />
              <Route path="/sell-us-your-car" element={<SellYourCar />} />
              <Route path="/team" element={<Team />} />
              <Route path="/directions" element={<Directions />} />
              <Route path="/book-appointment" element={<BookAppointment />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/sitemap" element={<Sitemap />} />
            </Routes>
          </main>
          <Footer />
        </>
      )}
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
