import React from 'react'
import Navbar from '../components/Homepage/Navbar';
import Hero from '../components/Homepage/Hero';
import StatsBar from '../components/Homepage/StatsBar';
import Features from '../components/Homepage/Features';
import HowItWorks from '../components/Homepage/HowItWorks';
import ProductPreview from '../components/Homepage/ProductPreview';
import FinalCTA from '../components/Homepage/FinalCTA';
import Footer from '../components/Homepage/Footer';

const Homepage = () => {
  return (
    <div className='max-w-[1440px] mx-auto mb-6'>
        <Navbar></Navbar>
        <Hero></Hero> 
        <StatsBar></StatsBar>
        <Features></Features>
        <HowItWorks></HowItWorks>
        <ProductPreview></ProductPreview>
        <FinalCTA></FinalCTA>
        <Footer></Footer>
    </div>
  )
}

export default Homepage;