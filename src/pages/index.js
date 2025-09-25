import Head from "next/head";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../Components/Header';
import Hero from "../Components/Hero";
import CampGrid from "../Components/CampGrid";
import WhyJoinUs from "../Components/WhyJoinUs";
import About from "../Components/About";
import Footer from "../Components/Footer";
import RegistrationProfile from "../Components/RegistrationProfile";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBookings } from "../Redux/bookingSlice/bookingSlice"; // redux slice we created
import AdminDashboard from "../pages/AdminDashboard"; // create this component for admin view

export default function Home() {
  const [registration, setRegistration] = useState(false);
  const dispatch = useDispatch();
  
  const token = useSelector((state) => state.auth.loginData?.token);
  const role = useSelector((state) => state.auth.loginData?.role);
  const parentId = useSelector((state) => state.auth.loginData?.id);

  useEffect(() => {
    if (token && role) {
      dispatch(fetchBookings({ token, role, parentId }));
    }
  }, [token, role, parentId, dispatch]);

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
        <CampGrid />
        <About />

        {/* Admin-specific section */}
        {role === 'ADMIN' && <AdminDashboard />}

        <Footer />
      </main>
    </>
  );
}
