import React from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { CurriculumSection } from '../components/CurriculumSection';
import { Footer } from '../components/Footer';

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <CurriculumSection />
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;