import React from 'react'
import PageHeader from './PageHeader'
import About from './About'
import HowToService from './HowToService'
import Team from './Team'

const AboutPage = () => {
  return (
    <div>
        <PageHeader title='About Us'/>
        <About/>
        <Team/>
        <HowToService/>

    </div>
  )
}

export default AboutPage