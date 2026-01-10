import Head from "next/head";
import { useRouter } from "next/router";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/Header';
import Hero from "../components/Hero";
import CampGrid from "../components/CampGrid";
import WhyJoinUs from "../components/WhyJoinUs";
import About from "../components/About";
import Footer from "../components/Footer";
import RegistrationProfile from "../components/RegistrationProfile";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBookings } from "../Redux/bookingSlice/bookingSlice";

export default function Home() {
  const [registration, setRegistration] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  
  const token = useSelector((state) => state.auth.loginData?.token);
  const role = useSelector((state) => state.auth.loginData?.role);
  const parentId = useSelector((state) => state.auth.loginData?.id);

  // Only redirect admin users to AdminDashboard
  useEffect(() => {
    if (token && role === 'ADMIN') {
      router.push('/admin');
      return;
    }
  }, [token, role, router]);

  // Fetch bookings for authenticated non-admin users (but don't redirect)
  useEffect(() => {
    if (token && role && role !== 'ADMIN') {
      dispatch(fetchBookings({ token, role, parentId }));
    }
  }, [token, role, parentId, dispatch]);

  // Show loading or nothing while redirecting admin users
  if (token && role === 'ADMIN') {
    return (
      <>
        <Head>
          <title>Redirecting...</title>
        </Head>
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Redirecting to Admin Dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Cricket Camps</title>
        <meta
          name="description"
          content="Join our cricket camps – learn, play, and excel with expert coaches!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="font-sans">
        <Header />
        <Hero />
        <About />
        {/* <CampGrid /> */}
        
        {/* Registration Modal or Profile - only for non-admin users */}
        {registration && (
          <RegistrationProfile 
            registration={registration} 
            setRegistration={setRegistration} 
          />
        )}
        
        <Footer />
      </main>
    </>
  );
}
