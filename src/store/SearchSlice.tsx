import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { searchCurriculaApi } from "../api/lecture/curriculumAPI";
import {
  SearchSendCurricula,
  SearchReturnCurricula,
  SearchCurriculaState,
} from "../interface/search/SearchInterface";
import axios from "axios";

// 커리큘럼 검색 초기 상태
const initialState: SearchCurriculaState = {
  curriculum_category: "",
  order: "",
  only_available: false,
  search: "",
  current_page_number: 0,
  total_page: 0,
  page_size: 0,
  curricula: [],
  status: "idle",
  error: null,
};

// 상태 업데이트 함수
export const updateSearchState = createAsyncThunk<
  SearchSendCurricula,
  SearchSendCurricula
>("curricula/search//update_state", async (searchData) => {
  const data = searchData;
  return data;
});

// 커리큘럼 검색
export const searchCurricula = createAsyncThunk<
  SearchReturnCurricula,
  SearchSendCurricula
>("curricula/search", async (searchData, thunkAPI) => {
  try {
    const data = await searchCurriculaApi(searchData);

    console.log("검색 성공!");
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
    return thunkAPI.rejectWithValue(error);
  }
});

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 커리큘럼 상태 업데이트
      .addCase(updateSearchState.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateSearchState.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.curriculum_category = action.payload.curriculum_category;
        state.order = action.payload.order;
        state.search = action.payload.search;
        state.current_page_number = action.payload.currentPageNumber;
        state.page_size = action.payload.pageSize;
      })
      .addCase(updateSearchState.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch lectures";
      })
      // 커리큘럼 검색 조회
      .addCase(searchCurricula.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchCurricula.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.curricula = action.payload.curricula;
        state.current_page_number = action.payload.current_page_number;
        state.page_size = action.payload.page_size;
        state.total_page = action.payload.total_page;
      })
      .addCase(searchCurricula.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch lectures";
      });
  },
});

export default searchSlice.reducer;
