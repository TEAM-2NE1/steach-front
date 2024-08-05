import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  QuizState,
  QuizCreateSendForm,
  QuizCreateReturnForm,
} from "../interface/quiz/QuizInterface";
import { createQuizApi } from "../api/lecture/quizAPI";
import axios from "axios";

// 퀴즈 초기 상태
const initialState: QuizState = {
  quizzes: null,
  status: "idle",
  error: null,
};

// 퀴즈 생성 함수
export const createQuiz = createAsyncThunk<
  QuizCreateReturnForm,
  QuizCreateSendForm
>("quiz/create", async (quizCreateData, thunkAPI) => {
  try {
    // 퀴즈 생성 api 호출
    const response = await createQuizApi(quizCreateData);

    console.log(response);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
    return thunkAPI.rejectWithValue(error);
  }
});

// 퀴즈 슬라이스
const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 퀴즈 생성 addCase
      .addCase(createQuiz.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createQuiz.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.quizzes = action.payload.quiz_list;
      })
      .addCase(createQuiz.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch lectures";
      });
  },
});

export default quizSlice.reducer;
