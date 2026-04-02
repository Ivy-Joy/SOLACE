import Navbar from "../components/navbar/Navbar"
import Hero from "../components/hero/Hero"
import AboutSolace from "../components/landing/AboutSolace"

//import JoinSolace from "../components/cta/JoinSolace"
import SolaceClasses from "../components/landing/SolaceClasses"
import EventsPreview from "../components/landing/EventsPreview"
import Footer from "../components/footer/Footer"
import Testimonies from "../components/landing/Testimonies"
import PartnerSection from "../components/landing/PartnerWithUs"
import DiscipleshipForm from "../components/landing/DiscipleshipForm"

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <AboutSolace />
      <SolaceClasses />
      <DiscipleshipForm />
      <EventsPreview />
      <Testimonies />
      <PartnerSection />
      <Footer />
      {/* <JoinSolace /> */}
    </>
  )
}