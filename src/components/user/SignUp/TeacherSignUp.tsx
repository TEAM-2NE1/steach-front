import React, { useState } from 'react';
import teacher from '../../../assets/teacher.png';
import axios from 'axios';
import { FormControl, FormLabel, Input } from "@chakra-ui/react";

// 이진송
const TeacherSignUp: React.FC = () => {

  interface FormData {
      userId : string;
      password : string;
      confirmPassword : string;
      email : string;
      uploadfile : File | null;
  }

  // 확인이 필요한데, uploadfile에 대해서 null값으로 지정
  const [formData, setFormData] = useState<FormData>({
      userId: '',
      password: '',
      confirmPassword: '',
      email: '',
      uploadfile: null,
  });

  // 학생 회원가입 페이지와 같지만, file 추가로 조금 다름
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === 'uploadfile' && files) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        uploadfile: files[0],
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  // 회원가입 버튼 눌렀을때 onChange로 실시간으로 폼에 들어감
  const handleSubmit = (e: React.FormEvent) => {
    axiosSignUp();
    e.preventDefault();
  };
  
  const axiosSignUp = () => {

    const formDataToSend = new FormData();
    formDataToSend.append('userId', formData.userId);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('confirmPassword', formData.confirmPassword);
    formDataToSend.append('email', formData.email);
    if (formData.uploadfile) {
      formDataToSend.append('uploadfile', formData.uploadfile);
    }


    axios.post(`API`, formDataToSend , {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((response) => {
      console.log(response.data)
    })
    .catch((err) => {
      console.log(err)
    })
  } 
    
  return (
    <>
        <div>
          <img src={teacher} />
        </div>
        <form className="max-w-md mx-auto border-2 rounded-xl p-6 mb-28" onSubmit={handleSubmit}>
        <FormControl>
          <FormLabel htmlFor="userId" className="text-2xl">아이디</FormLabel>
          <Input 
            type='text'
            id='userId'
            name='userId'
            value={formData.userId}
            onChange={handleChange}
            className="border-2 rounded-lg w-full p-2 mb-5"
            required
          />
          <FormLabel htmlFor="password" className="text-2xl">비밀번호</FormLabel>
          <Input
            type='password'
            id='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            className="border-2 rounded-lg w-full p-2 mb-5"
            required
          />
          <FormLabel htmlFor="confirmPassword" className="text-2xl">비밀번호확인</FormLabel>
          <Input
            type='password'
            id='confirmPassword'
            name='confirmPassword'
            value={formData.confirmPassword}
            onChange={handleChange}
            className="border-2 rounded-lg w-full p-2 mb-5"
            required
          />
          <FormLabel htmlFor="email" className="text-2xl">이메일</FormLabel>
          <Input
            type='email'
            id='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            className="border-2 rounded-lg w-full p-2 mb-5"
            required
          />
          <FormLabel htmlFor="uploadfile" className="text-2xl">증명서</FormLabel>
          <Input
            type='file'
            id='uploadfile'
            name='uploadfile'
            onChange={handleChange}
            className="border-2 rounded-lg w-full p-2 mb-5"
            required
          />
          <button type='submit' className="w-full text-center bg-orange-300 p-2 rounded-lg hover:bg-orange-400 hover:text-white"
          onSubmit={()=>{}}>회원가입</button>
          </FormControl>
        </form>
    </>
  );
}

export default TeacherSignUp;