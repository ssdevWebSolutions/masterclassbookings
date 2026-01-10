
import Head from "next/head";



import RegistrationProfileKids from "@/components/RegistrationProfileKids";
import DashboardLayout from "@/pages/admin/components/DashboardLayout";


const ProfileTab =()=> {
  return (
    <>
    <DashboardLayout>
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
          
          <RegistrationProfileKids />
        </main>
       
      </div>
      </DashboardLayout>
    </>
  );
}

export default ProfileTab;
