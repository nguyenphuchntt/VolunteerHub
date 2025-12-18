import React from "react";
import "../css/LandingPage.css";
import {
  Header,
  HeroSection,
  FeaturesSection,
  Marquee,
  AboutSection,
  ProjectsSection,
  Banner,
  TestimonialsSection,
  CTASection,
  Footer,
} from "../components/LandingPage";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <Marquee />
      <AboutSection />
      <ProjectsSection />
      <Banner />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;
