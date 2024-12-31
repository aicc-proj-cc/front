import React from 'react';
import SideBar from './Sidebar';
import Upperbar from './UpperBar';
import FiledSlider from './FiledSlider';
import Section from './Section';
import Footer from './Footer';

function Main() {
  return (
    <div>
      <SideBar />
      <Upperbar />
      <FiledSlider />
      <Section />
      <Footer />
    </div>
  );
}

export default Main;
