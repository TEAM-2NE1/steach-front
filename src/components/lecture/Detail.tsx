import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store'
import { getCurriculaLectureList, getCurriculaDetail, applyCurricula, applyCurriculaCheck, CurriculaCancel } from '../../store/curriculaSlice'
import { getLecturelist } from '../../store/lectureSlice'
import { useDispatch } from 'react-redux';
import img1 from '../../../src/assets/checked.jpg'
import img2 from '../../../src/assets/unchecked.jpg'
import img3 from '../../../src/assets/human.png'
import { Modal } from "antd";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Text,
} from "@chakra-ui/react";

const LectureDetail: React.FC = () => {
  // 이진송
  const userDataString = localStorage.getItem("auth");
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const [_, setToday] = useState('');
  const { id } = useParams<{ id: string }>();
  const a = id
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const lectures = useSelector(
    (state: RootState) => state.curriculum.selectlectures
  );
  const lectureslist = useSelector(
    (state: RootState) => state.curriculum.lectureslist
  );

  const isApply = useSelector((state: RootState) => state.curriculum.isApply);
  const status = useSelector((state: RootState) => state.curriculum.status);
  const error = useSelector((state: RootState) => state.curriculum.error);


  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const showLoading = () => {
    setOpen(true);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const bitday = lectures?.weekdays_bitmask.split('');
  const url = lectures?.banner_img_url
  
  useEffect(() => {
    if (id) {
      dispatch(getLecturelist(id));
      dispatch(getCurriculaDetail(id));
      dispatch(getCurriculaLectureList(id));
      userData && userData.role === "STUDENT" && (
        dispatch(applyCurriculaCheck(id))
      )
    }
  }, [id, dispatch]);
              
  

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${
      currentDate.getMonth() + 1
    }-${currentDate.getDate()}`;
    setToday(formattedDate);
  }, []);
  
  async function applyCurriculaBtn() {
    if (id) {
      await dispatch(applyCurricula(id));
      window.location.reload();
    }
  }
  
  async function cancelCurriculaBtn() {
    if (id) {
      await dispatch(CurriculaCancel(id));
      window.location.reload();
    }
  }


  
  let startLecture:any;
  let daysAgo:any;
  function calculateDaysAgo(dateString: any) {
    if (!dateString) return null;
  
    const targetDate: any = new Date(dateString);
    if (isNaN(targetDate.getTime())) return null;
  
    const today: any = new Date();
    const difference = today - targetDate;
    const daysAgo = Math.floor(difference / (1000 * 60 * 60 * 24));
  
    return isNaN(daysAgo) ? null : daysAgo;
  }

  return (
    <>
      <header className="flex bg-hoverNavy text-white text-left py-2.5 justify-center">
        <div className="w-3/5">
          <div>
            <p>
              {lectures?.category} &gt; {lectures?.sub_category}
            </p>
            <h1 className="text-7xl p-3">{lectures?.title}</h1>
            <p className="p-1">{lectures?.sub_title}</p>
            <p className="p-1">{lectures?.intro}</p>
            <Link to={"/teacher/profiledetail"}>
              <div className="flex items-center">
                <img src={img3} className="w-10 h-10 m-5" />
                <span>
                  {lectures?.teacher_name} 강사님 - 강사상세페이지, 만들어야함
                </span>
              </div>
            </Link>
          </div>
        </div>
        <div className="mt-60 mr-10"></div>
        <div className="w-1/5">
          <div>
            <img src={url} className="w-60 h-60" />
          </div>
        </div>
      </header>
      <div className="bg-ivory grid grid-cols-12">
        <div className="hidden lg:col-span-1 lg:block"></div>
        <div className="lg:col-span-6 col-span-8 bg-ivory border-x-2 border-x-hardBeige p-4">
          <br className="text-black"></br>
          <ul className="flex lg:flex-row text-lg font-bold ml-4">
            <li className="mr-5 mb-10">
              <a href="#intro" className="hover:text-orange-300">
                강의 소개
              </a>
            </li>
            <li className="mr-5 mb-10">
              <a href="#day" className="hover:text-orange-300">
                강의 요일
              </a>
            </li>
            <li className="mr-5 mb-10">
              <a href="#curriculum" className="hover:text-orange-300">
                커리큘럼
              </a>
            </li>
          </ul>
          <div className="whitespace-pre-line break-words">
            <h1 className="text-5xl" id="intro">
              강의 소개
            </h1>
            <div className="bg-lightBeige rounded-lg p-10 my-10">
              <p className="text-xl">{lectures?.information}</p>
            </div>
          </div>
          <h1 className='text-5xl pt-10' id="day">강의 요일</h1>
          <div className='flex justify-center p-5'>
            {
              bitday?.map((a:string, i:number) => {
                return (
                  <div key={i} className='px-2'>
                    {
                      a === '1'
                      ? <img src={img1} className='w-20 h-20'/>
                      : <img src={img2} className='w-20 h-20'/>
                    }
                  </div>
                )
              })
            }
          </div>
          <h1 className='text-5xl py-10' id="curriculum">커리큘럼</h1>
          <Accordion className="shadow-lg" defaultIndex={[]} allowMultiple>
              {
                Array.from({ length: lectureslist?.week_count ?? 0 }, (_, index) => (
                  <AccordionItem key={index} className="rounded-lg">
                    <AccordionButton className="bg-lightBeige hover:bg-darkerBeige">
                      <Box as="span" flex="1" textAlign="left" className="p-2">
                        <Text className="text-2xl">
                          [{lectures?.title}] {index + 1}주차 강의
                        </Text>
                        <Text className="text-base text-gray-600">
                          {daysAgo > 0 ? `이미 끝난 강의입니다.` : daysAgo < 0 ? `${-daysAgo}일 후 강의입니다.` : '오늘 강의입니다.'}
                        </Text>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4} className="p-3 bg-white">
                      {
                        Array.from({ length: lectureslist?.lectures[index + 1].length ?? 0 }, (_, index2) => (
                          <div className='grid grid-cols-4 border-b border-b-2 border-hardBeige pt-1' key={index2}>
                            <div className='col-span-2'>
                              <h2 className='text-xl'>
                                {lectureslist?.lectures[index + 1][index2].lecture_title}
                              </h2>
                            </div>
                            <div className='col-span-1 text-right'>
                              <span>강의 날짜 : </span>
                              <span>시작 시간 : </span>
                            </div>
                            <div className='col-span-1'>
                              <span>{lectureslist?.lectures[index + 1][index2].lecture_start_time.slice(0, 10)}</span>
                              <p>{lectureslist?.lectures[index + 1][index2].lecture_start_time.slice(11,19)}</p>
                              <span className='hidden'>{daysAgo = calculateDaysAgo(lectureslist?.lectures[index + 1][index2].lecture_start_time.slice(0, 10))}</span>
                            </div>
                          </div>
                        )
                      )}
                    </AccordionPanel>
                  </AccordionItem>
                ))
              }
          </Accordion>
        <div>
        </div>
        </div>
        <div className="sticky top-24 lg:right-24 xl:right-44 right-0 h-96 w-96 bg-white ml-10 mt-3 p-4 flex flex-col rounded-lg border-2 border-hardBeige">
          <h3 className="text-3xl font-bold ml-4 mb-4 text-red-600">무료</h3>
          <h3 className="text-2xl font-bold mb-4">{lectures?.title}</h3>
          {userData && userData.role === "TEACHER" && userData.nickname === lectures?.teacher_name ? (
            
            <button
              className="w-full mb-5 py-2 px-4 bg-gray-500 text-white font-bold rounded self-center"
              onClick={() => {navigate(`/curricula/update/${id}`)}}
            >
              수정하기
            </button>
          ) : (
              userData && userData.role === "TEACHER" && userData.nickname ? (
            <button
              className="w-full mb-5 py-2 px-4 bg-gray-500 text-white font-bold rounded self-center"
              disabled
            >
              수강 신청은 학생만 가능합니다.
            </button>
          ) : (
            isApply === false ? (
              <button
                className="w-full mb-5 py-2 px-4 bg-pink-500 hover:bg-pink-700 text-white font-bold rounded self-center"
                onClick={showLoading}
              >
                수강 신청
              </button>
            ) : (
              <button
                className="w-full mb-5 py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded self-center"
                onClick={showLoading}
              >
                수강 취소
              </button>
            )))}
          <Modal
            title={<p>수강 신청</p>}
            footer={isApply === false
              ?
              <button
                className="w-full mb-5 py-2 px-4 bg-pink-500 hover:bg-pink-700 text-white font-bold rounded self-center"
                onClick={applyCurriculaBtn}>
              수강신청
            </button>
              :
              <button
                className="w-full mb-5 py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded self-center"
                onClick={cancelCurriculaBtn}>
              수강취소
            </button>
            }
            loading={loading}
            open={open}
            onCancel={() => setOpen(false)}
          >
          <div className='flex justify-center'>
          <img src={url} className='w-60 h-60 m-10 border-4 border-pink-500 rounded-lg'/>
          </div>
          <div className='grid grid-cols-2'>
            <div>
              <ul>
                <li>지식공유자</li>
                <li>총 강의수</li>
                <li>분류</li>
                <li>현재 수강 인원</li>
                <li>수료증 발급 유무</li>
              </ul>
            </div>
            <div>
              <span className='hidden'>{startLecture = calculateDaysAgo(lectures?.start_date)}</span>
              <ul>
                <li>{lectures?.teacher_name} 강사님</li>
                <li>{lectureslist?.lecture_count}개 강의</li>
                <li>{lectures?.category}</li>
                <li>{lectures?.current_attendees} / {lectures?.max_attendees}</li>
                <li>발급</li>
              </ul>
            </div>
          </div>
          </Modal>
          <div className='grid grid-cols-2'>
            <div>
              <ul>
                <li>지식공유자</li>
                <li>총 강의수</li>
                <li>분류</li>
                <li>현재 수강 인원</li>
                <li>수료증 발급 유무</li>
              </ul>
            </div>
            <div>
              <span className='hidden'>{startLecture = calculateDaysAgo(lectures?.start_date)}</span>
              <ul>
                <li>{lectures?.teacher_name} 강사님</li>
                <li>{lectureslist?.lecture_count}개 강의</li>
                <li>{lectures?.category}</li>
                <li>
                  {lectures?.current_attendees} / {lectures?.max_attendees}
                </li>
                <li>발급</li>
              </ul>
            </div>
          </div>
          <p className="text-center mt-auto text-xl">
            {startLecture > 0
              ? `이미 ${startLecture}일 전에 강의가 시작했어요!`
              : startLecture < 0
              ? `${-startLecture}일 후에 시작하는 강의에요!`
              : "오늘부터 시작하는 강의에요!"}
          </p>
        </div>
        <div className="lg:col-span-3 col-span-1"></div>
      </div>
      <div></div>
      
    </>
  );
};

export default LectureDetail;
