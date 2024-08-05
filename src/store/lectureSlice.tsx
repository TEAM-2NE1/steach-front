import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  LectureSeries,
  Lecture,
  PatchLecture,
} from "../interface/Curriculainterface";
import { fetchCurriculumLectures } from "../api/lecture/curriculumAPI";
import {
  getLectureDetailApi,
  patchLectureDetailApi,
} from "../api/lecture/lectureAPI";
import axios from "axios";

// 이진송
// 강의 상태 인터페이스
export interface LecturesState {
  lectureslist: LectureSeries | null;
  lecture: Lecture | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// 초기 상태
const initialState: LecturesState = {
  lectureslist: null,
  lecture: null,
  status: "idle",
  error: null,
};

// 강의 리스트 가져오기
export const getLecturelist = createAsyncThunk<LectureSeries, string>(
  "lectures/list",
  async (id) => {
    const data = await fetchCurriculumLectures(id);
    return data;
  }
);

// 강의 단일 정보 가져오기
export const getLectureDetail = createAsyncThunk<Lecture, number>(
  "lectures/getDetail",
  async (lectureId: number, thunkAPI) => {
    try {
      const data = await getLectureDetailApi(lectureId);

      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// 강의 단일 정보 수정하기
export const patchLectureDetail = createAsyncThunk<Lecture, PatchLecture>(
  "lectures/patchDetail",
  async (lectureData: PatchLecture, thunkAPI) => {
    try {
      // 데이터 수정 함수 호출
      const data = await patchLectureDetailApi(lectureData);

      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// 강의 슬라이스
const lecturesSlice = createSlice({
  name: "lecture",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 커리큘럼에 해당하는 강의
      .addCase(getLecturelist.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        getLecturelist.fulfilled,
        (state, action: PayloadAction<LectureSeries>) => {
          state.status = "succeeded";
          state.lectureslist = action.payload;
        }
      )
      .addCase(getLecturelist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch lectures";
      })
      // 강의 단일 조회 addCase
      .addCase(getLectureDetail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        getLectureDetail.fulfilled,
        (state, action: PayloadAction<Lecture>) => {
          state.status = "succeeded";
          state.lecture = action.payload;
        }
      )
      .addCase(getLectureDetail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch lectures";
      });
  },
});

export default lecturesSlice.reducer;
