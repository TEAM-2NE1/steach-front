import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { StudentInfoUpdateForm } from "../../components/student/studentMyInfo/StudentMyInfoUpdateForm";
import { studentInfoGet } from "../../api/user/userAPI";
import {
  studentInfoUpdate,
  fetchStudentRadarChartApi,
} from "../../api/user/userAPI";
import { returnStudentCurriculaList } from "../../interface/Curriculainterface";
import { getStudentCurriculaList } from "../../api/lecture/curriculumAPI";
import {
  StudentInfo,
  StudentUserInfo,
} from "../../interface/profile/StudentProfileInterface";
import axios from "axios";

// 초기 상태
const initialState: StudentUserInfo = {
  status: "",
  error: null,
  info: null,
  curricula: [],
  radarChart: null,
};

// 학생 정보 조회
export const fetchStudentInfo = createAsyncThunk<StudentInfo>(
  "student/get",
  async (_, thunkAPI) => {
    try {
      const response = await studentInfoGet();
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// 학생 정보 수정
export const updateStudentInfo = createAsyncThunk<
  StudentInfo,
  StudentInfoUpdateForm
>("student/patch", async (updateFormData, thunkAPI) => {
  try {
    const response = await studentInfoUpdate(updateFormData);

    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
    return thunkAPI.rejectWithValue(error);
  }
});

// 학생이 수강신청한 강의 목록 가져오기
export const getStudentCurriculas =
  createAsyncThunk<returnStudentCurriculaList>(
    "student/curricula/get",
    async (_, thunkAPI) => {
      try {
        const response = await getStudentCurriculaList();

        return response;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          return thunkAPI.rejectWithValue(error.response.data);
        }
        return thunkAPI.rejectWithValue(error);
      }
    }
  );

// 학생 레이다 차트 결과 조회
export const fetchStudentRadarChart = createAsyncThunk(
  "student/radar-chart",
  async (_, thunkAPI) => {
    try {
      const response = await fetchStudentRadarChartApi();

      return response.data.scores;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// 학생 프로필 슬라이스
const studentProfileSlice = createSlice({
  name: "studentProfile",
  initialState,
  reducers: {
    studentReset: (state) => {
      state.status = "";
      state.error = null;
      state.info = null;
      state.curricula = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // 학생 프로필 정보 get
      .addCase(fetchStudentInfo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStudentInfo.fulfilled, (state, action) => {
        state.status = "succeeded";
        const studentData: StudentInfo = {
          username: action.payload.username,
          nickname: action.payload.nickname,
          email: action.payload.email,
        };
        state.info = studentData;
      })
      .addCase(fetchStudentInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      // 학생 수강신청 커리큘럼 addCase
      .addCase(getStudentCurriculas.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getStudentCurriculas.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.curricula = action.payload.curricula;
      })
      .addCase(getStudentCurriculas.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      // 학생 Radar Chart 조회 - 항목 확인후 interface 수정후 action 항목들을 추가해야함
      .addCase(fetchStudentRadarChart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStudentRadarChart.fulfilled, (state, action) => {
        state.status = "succeeded";

        if (state.radarChart) {
          state.radarChart.Korean = action.payload.Korean;
          state.radarChart.Math = action.payload.Math;
          state.radarChart.Social = action.payload.Social;
          state.radarChart.Science = action.payload.Science;
          state.radarChart.Arts_And_Physical = action.payload.Arts_And_Physical;
          state.radarChart.Engineering = action.payload.Engineering;
          state.radarChart.Foreign_language = action.payload.Foreign_language;
        }
      })
      .addCase(fetchStudentRadarChart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      });
  },
});

export const { studentReset } = studentProfileSlice.actions;

export default studentProfileSlice.reducer;
