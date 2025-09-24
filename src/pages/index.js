import Head from "next/head";
import Image from "next/image";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import Header from '../Components/Header';
import Hero from "../Components/Hero";
import CampGrid from "../Components/CampGrid";
import WhyJoinUs from "../Components/WhyJoinUs";
import About from "../Components/About";
import Footer from "../Components/Footer";

export default function Home() {
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
        {/* <WhyJoinUs /> */}
        <About />
        <Footer />
      </main>
    </>
  );
}
