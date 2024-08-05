export interface Curricula {
  curriculum_id: string;
  title: string;
  sub_title: string;
  intro: string;
  information: string;
  category: string;
  sub_category: string;
  banner_img_url: string;
  start_date: string;
  end_date: string;
  lecture_start_time: string;
  lecture_end_time: string;
  weekdays_bitmask: any;
  max_attendees: number;
  teacher_name: string;
  current_attendees: string;
}

export interface CurriculaFormData {
  title: string;
  sub_title: string;
  intro: string;
  information: string;
  category: string;
  sub_category: string;
  banner_img_url: string | File;
  start_date: string;
  end_date: string;
  lecture_start_time: string;
  lecture_end_time: string;
  weekdays_bitmask: any;
  max_attendees: number;
}

// 강의 리스트 인터페이스
export interface LectureSeries {
  lecture_count: number;
  week_count: number;
  lectures: Lectures[];
}

// 강의 배열 인터페이스
export type Lectures = Array<{
  lecture_id: number;
  lecture_title: string;
  lecture_order: number;
  lecture_start_time: string;
}>;

// 단일 강의 인터페이스
export interface Lecture {
  lecture_id: number;
  lecture_title: string;
  lecture_order: number;
  lecture_start_time: string;
}

// 강의 상세 수정 인터페이스
export interface PatchLecture {
  lecture_title: string;
  lecture_start_time: string;
}

// 학생 커리큘럼 신청 리스트 조회 폼
export interface returnStudentCurriculaList {
  current_page_number: number;
  total_page: number;
  page_size: number;
  curricula: Curricula[];
}

// 선생님이 강의하는 커리큘럼 조회 폼
export interface returnTeacherCurriculaList {
  current_page_number: number;
  total_page: number;
  page_size: number;
  curricula: Curricula[];
}
