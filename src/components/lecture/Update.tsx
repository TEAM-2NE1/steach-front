import React, { useEffect, useState } from 'react';
import Froala from '../main/FroalaEditor.tsx'
import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { TbArrowsRight } from "react-icons/tb";
import checkimg from '../../assets/checked.jpg'
import uncheckimg from '../../assets/unchecked.jpg'
import banner from '../../assets/banner2.jpg'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store.tsx';
import { petchCurriculumDetails } from '../../api/lecture/curriculumAPI.ts'
import { getCurriculaDetail } from '../../store/curriculaSlice.tsx';
import { Curricula } from '../../interface/Curriculainterface.tsx';
import { useParams, useNavigate } from 'react-router-dom';

const LectureUpdate: React.FC = () => {
  const lectures = useSelector(
    (state: RootState) => state.curriculum.selectlectures
  );
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()
  const [formData, setFormData] = useState<Partial<Curricula | null>>(null);

  useEffect(() => {
    if (id) {
      dispatch(getCurriculaDetail(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (lectures) {
      setFormData({
        title: lectures?.title,
        sub_title: lectures?.sub_title,
        intro: lectures?.intro,
        information: lectures?.information,
        category: lectures?.category,
        sub_category: lectures?.sub_category,
        banner_img_url: lectures?.banner_img_url,
        start_date: lectures?.start_date,
        end_date: lectures?.end_date,
        lecture_start_time: lectures?.lecture_start_time,
        lecture_end_time: lectures?.lecture_end_time,
        weekdays_bitmask: lectures?.weekdays_bitmask,
        max_attendees: lectures?.max_attendees,
      });
    }
  }, [lectures]);

  useEffect(() => {
    if (formData?.weekdays_bitmask) {
      const bitmaskString = formData.weekdays_bitmask.toString(2).padStart(7, '0');
      setActiveDays({
        월: bitmaskString[0] === '1',
        화: bitmaskString[1] === '1',
        수: bitmaskString[2] === '1',
        목: bitmaskString[3] === '1',
        금: bitmaskString[4] === '1',
        토: bitmaskString[5] === '1',
        일: bitmaskString[6] === '1',
      });
    }
  }, [formData?.weekdays_bitmask]);

  const [activeDays, setActiveDays] = useState<{ [key in Weekday]: boolean }>({
    월: false,
    화: false,
    수: false,
    목: false,
    금: false,
    토: false,
    일: false,
  });

  type Weekday = '월' | '화' | '수' | '목' | '금' | '토' | '일';

  const WEEKDAY_VALUES: Record<Weekday, number> = {
    월: 64,
    화: 32,
    수: 16,
    목: 8,
    금: 4,
    토: 2,
    일: 1,
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, files } = event.target as HTMLInputElement;
    if (type === 'file') {
      const file = files ? files[0] : null;
      setFormData({
        ...formData,
        [name]: file,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleEditorChange = (data: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      information: data,
    }));
    console.log(data);
  };

  const handleCheckboxChange = (day: Weekday) => {
    setActiveDays((prevActiveDays) => {
      const newActiveDays = {
        ...prevActiveDays,
        [day]: !prevActiveDays[day],
      };
      const newBitmask = Object.keys(newActiveDays).reduce((bitmask, key) => {
        const weekday = key as Weekday;
        if (newActiveDays[weekday]) {
          return bitmask + WEEKDAY_VALUES[weekday];
        }
        return bitmask;
      }, 0);
      setFormData((prevFormData) => ({
        ...prevFormData,
        weekdays_bitmask: newBitmask,
      }));
      return newActiveDays;
    });
  };

  const formatBitmask = (bitmask: number): string => {
    return bitmask.toString(2).padStart(7, '0');
  };

  const stripHtmlTags = (htmlContent: string): string => {
    const doc = new DOMParser().parseFromString(htmlContent, 'text/html');
    const textContent = Array.from(doc.body.childNodes).map(node => {
      if (node.nodeName === 'BR') {
        return '\n';
      } else if (node.nodeName === 'P') {
        return node.textContent + '\n';
      } else {
        return node.textContent;
      }
    }).join('');
    return textContent.trim();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = {
      ...formData,
      intro: stripHtmlTags(formData?.intro || ''),
      information: stripHtmlTags(formData?.information || ''),
      weekdays_bitmask: formatBitmask(formData?.weekdays_bitmask || 0),
    };
    dispatch(petchCurriculumDetails({ newLectureData: formDataToSend, id }))
    setTimeout(() => {
      navigate(-1)
    }, 1000)
  };

  return (
    <div className='grid grid-cols-12'>
      <div className='col-span-2'></div>
      <div className=' col-span-8 p-4'>
        <img src={banner} className='mx-auto w-2/3 rounded-2xl' />
        <p className="self-start text-5xl pt-20 pl-5 pb-3">강의 수정</p>
        <hr></hr>
        <form onSubmit={handleSubmit}>
          <FormControl>
            <div className='flex items-center mb-5'>
              <FormLabel htmlFor="title" className="mt-3 ml-3 mr-8 text-2xl ">강의 제목</FormLabel>
              <Input
                type='text'
                id='title'
                name='title'
                value={formData?.title}
                onChange={handleChange}
                className="border-2 rounded-lg w-1/3 p-2 mt-3"
                required
              />
              <FormLabel htmlFor="sub_title" className="mt-3 mx-3 text-2xl ">강의 부제목</FormLabel>
              <Input
                type='text'
                id='sub_title'
                name='sub_title'
                value={formData?.sub_title}
                onChange={handleChange}
                className="border-2 rounded-lg w-1/3 p-2 mt-3"
                required
              />
            </div>
            <hr></hr>
            <div className='flex items-center mb-5'>
              <FormLabel htmlFor="category" className="mt-3 mx-3 text-2xl">강의 대분류</FormLabel>
              <select
                id='category'
                name='category'
                value={formData?.category}
                onChange={handleChange}
                className="border-2 rounded-lg w-1/3 p-2 mt-3"
              >
                <option value="KOREAN">KOREAN</option>
                <option value="MATH">MATH</option>
                <option value="FOREIGN_LANGUAGE">FOREIGN_LANGUAGE</option>
                <option value="SCIENCE">SCIENCE</option>
                <option value="ENGINEERING">ENGINEERING</option>
                <option value="ARTS_AND_PHYSICAL">ARTS_AND_PHYSICAL</option>
                <option value="EDUCATION">EDUCATION</option>
                <option value="ETC">ETC</option>
              </select>
              <FormLabel htmlFor="sub_category" className="mt-3 mx-3 text-2xl">강의 중분류</FormLabel>
              <Input
                type='text'
                id='sub_category'
                name='sub_category'
                value={formData?.sub_category}
                onChange={handleChange}
                className="border-2 rounded-lg w-1/3 p-2 mt-3"
                required
              />
            </div>
            <hr></hr>
            <FormLabel htmlFor="banner_img_url" className="mt-3 mx-3 text-2xl">강의 배너 이미지</FormLabel>
            <Input
              type='file'
              id='banner_img_url'
              name='banner_img_url'
              onChange={handleChange}
              className="border-2 rounded-lg w-4/5 p-2 mb-3"
            />
            <hr></hr>
            <FormLabel htmlFor="intro" className="my-3 mx-3 text-2xl">강의 소개</FormLabel>
            <Input
              type='text'
              id='intro'
              name='intro'
              value={formData?.intro}
              onChange={handleChange}
              className="border-2 rounded-lg w-full p-2 mt-3"
              required
            />
            <hr className='my-3'></hr>
            <FormLabel htmlFor="datetime" className="mt-3 mx-3 text-2xl">강의 커리큘럼</FormLabel>
            <div className='flex items-center mb-5'>
              <div className='w-1/2'>
                <FormLabel htmlFor="date" className="mt-3 mx-3 text-1xl">강의 시작일 - 강의 종료일</FormLabel>
              </div>
              <div className='w-1/2'>
                <FormLabel htmlFor="lecture_time" className="mt-3 mx-3 text-1xl">시작 시간 - 종료 시간</FormLabel>
              </div>
            </div>
            <div className='flex items-center mb-5'>
              <div className='w-1/2'>
                <Input
                  type='date'
                  id='start_date'
                  name='start_date'
                  value={formData?.start_date}
                  onChange={handleChange}
                  className="border-2 rounded-lg w-40 p-2 mb-5"
                  required
                />
                <span className='inline-block align-middle p-3'><TbArrowsRight /></span>
                <Input
                  type='date'
                  id='end_date'
                  name='end_date'
                  value={formData?.end_date}
                  onChange={handleChange}
                  className="border-2 rounded-lg w-40 p-2 mb-5"
                  required
                />
              </div>
              <div className='w-1/2'>
                <Input
                  type='time'
                  id='lecture_start_time'
                  name='lecture_start_time'
                  value={formData?.lecture_start_time}
                  onChange={handleChange}
                  className="border-2 rounded-lg w-40 p-2 mb-5"
                  required
                />
                <span className='inline-block align-middle p-3'><TbArrowsRight /></span>
                <Input
                  type='time'
                  id='lecture_end_time'
                  name='lecture_end_time'
                  value={formData?.lecture_end_time}
                  onChange={handleChange}
                  className="border-2 rounded-lg w-40 p-2 mb-5"
                  required
                />
              </div>
            </div>
            <hr className='my-3'></hr>
            <FormLabel htmlFor="datetime" className="mt-3 mx-3 text-2xl">수업 요일</FormLabel>
            <div className='flex justify-center'>
              {
                Object.keys(activeDays).map((day, i) => (
                  <label key={i}>
                    <img
                      src={activeDays[day as Weekday] ? checkimg : uncheckimg}
                      onClick={() => handleCheckboxChange(day as Weekday)}
                      style={{ cursor: 'pointer', width: '80px', height: '80px', marginRight: '8px' }}
                      alt={day}
                    />
                    {day}
                  </label>
                ))
              }
            </div>

            <FormLabel htmlFor="datetime" className="text-2xl">최대 수강 정원</FormLabel>
            <select
              id='max_attendees'
              name='max_attendees'
              value={formData?.max_attendees}
              onChange={handleChange}
              className="border-2 rounded-lg p-2 mb-5"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>

            <FormLabel htmlFor="datetime" className="text-2xl">강의 상세 설명</FormLabel>
            <Froala
              data={formData?.information || ""}
              onChange={handleEditorChange}
            />
            <div className='p-5 border my-5'>
              <h1 className='text-6xl'>강의 등록시 주의사항</h1>
              <ul>
                <li>- 이해하기 쉬운 언어 사용: 학생들의 연령대에 맞는 쉬운 언어와 예시를 사용해 강의를 준비하세요.</li>
                <li>- 적절한 강의 시간 설정: 집중력이 떨어지지 않도록 강의 시간을 적절하게 조절하고, 쉬는 시간을 포함하세요.</li>
                <li>- 참여 유도: 학생들이 적극적으로 참여할 수 있도록 질문을 유도하고, 활동적인 학습 방법을 도입하세요.</li>
                <li>- 안전과 윤리 준수: 강의 내용과 활동은 안전하고 윤리적이어야 하며, 학생들의 개인정보 보호에 유의하세요.</li>
              </ul>
            </div>
            <button type='submit'>버튼임</button>
          </FormControl>
        </form>
      </div>
      <div className='col-span-2'></div>
    </div>
  );
};

export default LectureUpdate;
