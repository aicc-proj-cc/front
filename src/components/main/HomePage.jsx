import React, { useState } from 'react';
import FiledSlider from './FiledSlider';
import Section from './Section';
import Signup from './Signup';
import Signin from './Signin';
import Search from './Search';
import Rank from './Rank';
import Mypage from './Mypage';
import Wordcloud from './Wordcloud';

function HomePage() {
  const [refetch, setRefetch] = useState(false);

  const handleLoginSuccess = () => {
    setRefetch((prev) => !prev); // 상태 변경으로 Mypage 업데이트 트리거
  };

  return (
    <div>
      <FiledSlider />
      <Section />
      <div className="flex w-full">
        <div>
          {/* <Signup /> */}
          <Signin onLoginSuccess={handleLoginSuccess} />
        </div>
        <div>
          <Mypage refetch={refetch} />
          {/* <Search /> */}
        </div>
        <div>
          {/* <Rank /> */}
          {/* <Wordcloud /> */}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
