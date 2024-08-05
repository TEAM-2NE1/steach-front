import { configureStore } from "@reduxjs/toolkit";
import curriculaReducer from "./store/curriculaSlice.tsx";
import studentReducer from "./store/userInfo/AuthSlice.tsx";
import lecturesListReducer from "./store/lectureSlice.tsx";
import studentProfileReducer from "./store/userInfo/StudentProfileSlice.tsx";
import teacherProfileReducer from "./store/userInfo/TeacherProfileSlice.tsx";

// 중앙 스토어 설정
const store = configureStore({
  reducer: {
    curriculum: curriculaReducer,
    auth: studentReducer,
    lectures: lecturesListReducer,
    studentProfile: studentProfileReducer,
    teacherProfile: teacherProfileReducer,
  },
});

// RootState 타입 정의
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
