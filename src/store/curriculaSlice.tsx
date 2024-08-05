import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Curricula, LectureSeries } from "../interface/Curriculainterface";
import {
  fetchCurriculumDetails,
  petchCurriculumDetails,
  fetchCurriculumLectures,
  SignUpLecture,
  deleteCurricula,
  applyToCurriculum,
  getCurriculimApply,
  postCurriculimCancel,
} from "../api/lecture/curriculumAPI";
import axios from "axios";

// 이진송
// axios 구성 기본틀인데 서버통신 가능할때 시험해보고 적용할 것 같음
export interface CurriculasState {
  curricula: Curricula[];
  lectureslist: LectureSeries | null;
  selectlectures: Curricula | null;
  isApply: boolean
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// 커리큘럼 및 강의 초기 상태
const initialState: CurriculasState = {
  curricula: [],
  lectureslist: null,
  selectlectures: null,
  isApply: false,
  status: "idle",
  error: null,
};

// 커리큘럼 단일 상세 조회
export const getCurriculaDetail = createAsyncThunk<Curricula, string>(
  "curricula/detail",
  async (id, thunkAPI) => {
    try {
      const data = await fetchCurriculumDetails(id);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);



// 단일 커리큘럼 삭제
export const deleteCurriculaDetail = createAsyncThunk<string, string>(
  "curricula/delete",
  async (id, thunkAPI) => {
    try {
      const data = await deleteCurricula(id);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// 단일 커리큘럼에 대한 강의들을 조회
export const getCurriculaLectureList = createAsyncThunk<LectureSeries, string>(
  "curricula/lectures",
  async (id, thunkAPI) => {
    try {
      const data = await fetchCurriculumLectures(id);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// 수강신청하기
export const applyCurricula = createAsyncThunk<string, string>(
  "curricula/apply",
  async (id, thunkAPI) => {
    try {
      const data = await applyToCurriculum(id);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
    return thunkAPI.rejectWithValue(error);
  }
}
);


// 수강 신청 유무 확인
export const applyCurriculaCheck = createAsyncThunk<boolean, string>(
  "curricula/applyCheck",
  async (id, thunkAPI) => {
    try {
      const data = await getCurriculimApply(id);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
    return thunkAPI.rejectWithValue(error);
  }
}
);

// 신청한 수강 다시 취소하기
export const CurriculaCancel = createAsyncThunk<boolean, string>(
  "curricula/cancel",
  async (id, thunkAPI) => {
    try {
      const data = await postCurriculimCancel(id);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
    return thunkAPI.rejectWithValue(error);
  }
}
);

// 커리큘럼 슬라이스
const curriculaSlice = createSlice({
  name: "curricula",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 커리큘럼 등록
      .addCase(SignUpLecture.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        SignUpLecture.fulfilled,
        (state, action: PayloadAction<Curricula>) => {
          state.status = "succeeded";
          state.curricula.push(action.payload);
        }
      )
      .addCase(SignUpLecture.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch lectures";
      })
      // 커리큘럼 상세 수정
      .addCase(petchCurriculumDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        petchCurriculumDetails.fulfilled,
        (state, action: PayloadAction<Curricula>) => {
          state.status = "succeeded";
          state.curricula.push(action.payload);
        }
      )
      .addCase(petchCurriculumDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch lectures";
      })
      // 디테일 강의 가져오기
      .addCase(getCurriculaDetail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCurriculaDetail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectlectures = action.payload;
      })
      .addCase(getCurriculaDetail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch lectures";
      })
      // 단일 커리큘럼 삭제
      .addCase(deleteCurriculaDetail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCurriculaDetail.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(deleteCurriculaDetail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to delete curricula";
      })
      // 커리큘럼에 해당하는 강의
      .addCase(getCurriculaLectureList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        getCurriculaLectureList.fulfilled,
        (state, action: PayloadAction<LectureSeries>) => {
          state.status = "succeeded";
          state.lectureslist = action.payload;
        }
      )
      .addCase(getCurriculaLectureList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch lectures";
      })
      // 커리큘럼에 해당하는 강의
      .addCase(applyCurricula.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        applyCurricula.fulfilled,
        (state) => {
          state.status = "succeeded";
        }
      )
      .addCase(applyCurricula.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch lectures";
      })
      // 커리큘럼에 해당하는 강의
      .addCase(applyCurriculaCheck.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        applyCurriculaCheck.fulfilled,
        (state, action) => {
          state.status = "succeeded";
          state.isApply = action.payload;
        }
      )
      .addCase(applyCurriculaCheck.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch lectures";
      })
      // [학생] 커리큘럼 수강 신청 취소하기
      .addCase(CurriculaCancel.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        CurriculaCancel.fulfilled,
        (state) => {
          state.status = "succeeded";
          console.log(state.status)
        }
      )
      .addCase(CurriculaCancel.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch lectures";
      })
  },
});

export default curriculaSlice.reducer;
