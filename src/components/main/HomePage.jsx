import React from 'react';
import SideBar from '../common/Sidebar';
import Upperbar from '../common/UpperBar';
import FiledSlider from './FiledSlider';
import Section from './Section';
import Footer from '../common/Footer';

function HomePage() {
  return (
    <div>
      <FiledSlider />
      <Section />
      <Footer />
    </div>
  );
}

export default HomePage;
