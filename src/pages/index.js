import Head from "next/head";
import Image from "next/image";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CampGrid from "@/components/CampGrid";
import WhyJoinUs from "@/components/WhyJoinUs";
import About from "@/components/About";
import Footer from "@/components/Footer";

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
