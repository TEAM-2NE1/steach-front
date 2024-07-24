import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios';
import ax from '../../assets/teacher.png'

  // 이진송
  // 틀만 짜서 디자인 정하고 서버받고 난 후 axios 해야함
const LectureSignUp: React.FC = () => {
  

  return (
    <>
      <div className='bg-[#000000] grid grid-cols-12'>
      <div className='col-span-2'></div>
      <div className='col-span-8 bg-[#999999] p-4'>
        <div className='whitespace-pre-line break-words'>
        <div className='p-5 border'>
        <h1 className='text-6xl'>강의 등록시 주의사항</h1>
            강의 등록시 주의사항
            설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명
        </div>
          </div>
          {/* 
          강의 제목
          textarea

          강의 커리큘럼
          date, time

          상세 설명
          textarta
          */}
          <h1 className='text-6xl'>강의 소개-information</h1>
          <textarea className='w-full h-40' id='information'></textarea>
        
          <br className='text-black'></br>

          <h1 className='text-6xl'>강의 커리큘럼</h1>
          <p>
            강의 시작일 : 
          </p>
            <input type="date" /><br/>
          <p>
            강의 종료일 : 
          </p>
            <input type="date" /><br/>
          <p>
            시작 시간 : <input type="time" /><br/>
          </p>
          <p>
            종료 시간 : <input type="time" /><br/>
          </p>
          월<input type="checkbox" />
          화<input type="checkbox" />
          수<input type="checkbox" />
          목<input type="checkbox" />
          금<input type="checkbox" />
          토<input type="checkbox" />
          일<input type="checkbox" />
          <p>상세 설명</p>
          <textarea className='w-full h-40' id=''></textarea>
          
          <h1 className='text-6xl'>강의 대상</h1>
          <textarea className='w-full h-40' id='target'></textarea>
          <h1 className='text-6xl'>학습 요구사항</h1>
          <textarea className='w-full h-40' id='requirement'></textarea>
           

          {/* sub_title : 서브 제목 */}
          {/* intro : 강의 소개 */}
          {/* target : 강의를 들으면 좋겠는 대상 */}
          {/* requirement : 학습 요구사항(선수과목) */}
          {/* information : 강의 정보 */}
          {/* sub_category : 과목 카테고리 */}
          {/* weekdays : 월화수목금토일 */}
          {/* start_date : 시작일
          end_date : 종료일
          lecture_start_time : 시작시간
          lecture_end_time : 종료시간 */}



      </div>
      <div className='col-span-2'></div>
      </div>
    </>
  )
}

export default LectureSignUp;