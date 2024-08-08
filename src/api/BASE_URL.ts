export const BASE_URL = "http://steach.ssafy.io:8083";

// 토큰을 가져오는 함수
export const getAuthToken = () => {
  const userData = localStorage.getItem("auth");
  const token = userData ? JSON.parse(userData).token : "";

  return token;
};
