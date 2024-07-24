import React from 'react';
import aa from '../assets/banner.jpg'

// 조시현팀장이 테스트용 페이지 만들어달래서 만들어두긴했는데 아직 쓸일이 없음, 일단 냅두고 추후에 유기
const JosihyeonTest: React.FC = () => {
  return (
    <div className='flex'>
    <div className='w-1/2 border border-black '>
      <h2>내용</h2>
      <img src={aa} alt="" />
    </div>
    <div className='w-1/2 border border-black'>
      <h2>내용</h2>
    </div>
    </div>
  );
}

export default JosihyeonTest;