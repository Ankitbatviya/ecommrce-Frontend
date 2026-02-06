import React from 'react'
import Hero from '../components/Home/Hero'
import Service from '../components/Home/Service'
import BrandShowcase from '../components/Home/BrandShowcase'
import Footer from '../components/global/Footer'
function Home() {
  return (
    <div>
      <Hero/>
      <Service/>
      <BrandShowcase/>
      <Footer/>
    </div>
  )
}

export default Home
