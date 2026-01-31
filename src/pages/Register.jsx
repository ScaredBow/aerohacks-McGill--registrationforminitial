import RegistrationForm from "../components/RegistrationForm";
import Footer from "../components/Footer";
import SEO from "../components/SEO";

export default function RegisterPage() {
  return (
    <>
      <SEO
        title="Register for McGill AeroHacks 2026 | Drone Programming Hackathon"
        description="Register for McGill AeroHacks 2026! Secure your spot at Montreal's premier drone programming hackathon. March 13 - March 15, 2026. Free to attend!"
        keywords="register McGill AeroHacks, hackathon registration, drone programming signup, student hackathon Montreal, free tech event, aerospace competition registration"
      />
      
      <div className="min-h-screen">
        <RegistrationForm />
        <Footer />
      </div>
    </>
  );
}
