import RegistrationProfile from "../Components/RegistrationProfile";
import Header from "../Components/Header";
import Head from "next/head";
import Footer from "../Components/Footer";
import RegistrationProfileKids from "../Components/RegistrationProfileKids";

export default function Register() {
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

      <div className="d-flex flex-column min-vh-100">
        <main className="flex-grow-1 font-sans">
          <Header />
          <RegistrationProfileKids />
        </main>
        <Footer />
      </div>
    </>
  );
}
