import React from 'react'
import Navbar from '../components/Homepage/Navbar';
import Hero from '../components/Homepage/Hero';
import StatsBar from '../components/Homepage/StatsBar';
import Features from '../components/Homepage/Features';
import HowItWorks from '../components/Homepage/HowItWorks';
import ProductPreview from '../components/Homepage/ProductPreview';
import Pricing from '../components/Homepage/Pricing';
import FinalCTA from '../components/Homepage/FinalCTA';
import Footer from '../components/Homepage/Footer';

const Homepage = () => {
  return (
    <div className='max-w-[1440px] mx-auto mb-6'>
        <Navbar></Navbar>
        <Hero></Hero>
        <StatsBar></StatsBar>
        <div id="features"><Features></Features></div>
        <div><HowItWorks></HowItWorks></div>
        <div><ProductPreview></ProductPreview></div>
        <div id="pricing"><Pricing></Pricing></div>
        <FinalCTA></FinalCTA>
        <div id="contact"><Footer></Footer></div>
    </div>
  )
}

export default Homepage;