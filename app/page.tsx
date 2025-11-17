'use client'
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;


import {ThemeProvider} from 'next-themes'
import Navbar from '@/components/HomePage/Navbar/Navbar'
import HeadlineContent from "@/components/HomePage/HeadlineContent/HeadlineContent";
import Companies from "@/components/HomePage/Companies/Companies";
import Services from "@/components/HomePage/Services/Services";
import Goals from "@/components/HomePage/Goals/Goals"
import ContactUs from "@/components/HomePage/ContactUs/ContactUs"
import VisitBlog from "@/components/HomePage/VisitBlog/VisitBlog";
import Founder from "@/components/HomePage/Founder/Founder";
import Footer from '@/components/HomePage/Footer/Footer'


export default function Home() {
  return (
    <ThemeProvider enableSystem={true} attribute="class" >
      <div className="home" id="home-section">
        <div className="headline">
          <Navbar />
          <HeadlineContent />
          <Companies />
        </div>
        <Services />
        <Goals />
        <ContactUs />
        <VisitBlog />
        <Founder />
      </div>
              <Footer />

    </ThemeProvider>
  )
}
