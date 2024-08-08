const auth = localStorage.getItem("auth");

export const token = auth ? JSON.parse(auth).token : null;
export const BASE_URL = "http://steach.ssafy.io:8083";
