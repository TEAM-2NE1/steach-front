import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { startLectureSlice } from "../../store/LectureSlice";
import WebrtcTeacher from "./WebrtcTeacher";
import WebrtcStudent from "./WebrtcStudent";

const Classroom = () => {
  const [page, setPage] = useState("gate");
  const [roomId, setRoomId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [role, setRole] = useState("");
  const [hidden, setHidden] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const { lecture_id } = useParams<string>();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream>();

  useEffect(() => {
    const setupLocalStream = async () => {
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: {
            width: 1920,
            height: 1080,
          },
        });
        localStreamRef.current = localStream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }
      } catch (error) {
        console.error("Error accessing media devices.", error);
      }
    };

    setupLocalStream();
  }, []);

  useEffect(() => {
    const localStorageUserData = localStorage.getItem("auth");
    const userData = localStorageUserData
      ? JSON.parse(localStorageUserData)
      : null;
    if (userData?.email && lecture_id) {
      setRole(userData.role);
      setRoomId(lecture_id);
      setUserEmail(userData.email);
    }
  }, [lecture_id]);

  const handleEnterClick = () => {
    if (role === "") {
      alert("Please choose a role.");
      return;
    } else if (role === "TEACHER") {
      if (lecture_id) {
        setPage("WebrtcTeacher");
        startLectureSlice(lecture_id);
        setHidden(1);
        setIsVisible(false);
      }
    } else if (role === "STUDENT") {
      setPage("WebrtcStudent");
      setHidden(1);
      setIsVisible(false);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setVideoEnabled(videoTrack.enabled);
    }
  };

  return (
    <div className="flex flex-col bg-discordChatBg min-h-screen">
      {isVisible && (
        <>
          <header className=" text-white text-center font-bold sm:my-8 sm:text-3xl md:my-10 md:text-4xl lg:my-auto lg:text-4xl">
            강의실에 입장하기 전 자신의 용모를 확인하세요!
          </header>
          <section className="flex justify-center items-center sm:mx-10">
            <video
              className="bg-black rounded-2xl lg:size-1/3"
              ref={localVideoRef}
              autoPlay
              controls={false}
            />
          </section>
          <div className="flex justify-center">
            <button
              onClick={toggleVideo}
              className="p-2 w-18 h-16 bg-gray-200 rounded-full sm:my-10 lg:my-2"
              title="Toggle Video"
            >
              {videoEnabled ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="mx-auto size-12"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-4.553A1 1 0 0121 5.94v12.12a1 1 0 01-1.447.894L15 14m-6 6h6a2 2 0 002-2V6a2 2 0 00-2-2H9a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="mx-auto size-12"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-4.553A1 1 0 0121 5.94v12.12a1 1 0 01-1.447.894L15 14m-6 6h6a2 2 0 002-2V6a2 2 0 00-2-2H9a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3l18 18"
                  />
                </svg>
              )}
            </button>
          </div>
        </>
      )}

      <div id="gate">
        <div className="hidden">
          <select
            id="role_select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="" disabled>
              Choose...
            </option>
            <option value="TEACHER">Teacher</option>
            <option value="STUDENT">Student</option>
          </select>
          <input
            type="text"
            id="tb_roomid"
            value={lecture_id}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter Room ID"
          />
          <input
            type="text"
            id="tb_email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="Enter Email"
          />
        </div>
        <div className="my-16 text-center">
          <button
            id="btn_enter"
            onClick={handleEnterClick}
            className={
              hidden === 1
                ? "hidden"
                : "p-5 w-48 bg-red-200 rounded-md text-white font-bold hover:bg-red-300 whitespace-nowrap"
            }
          >
            강의실 입장하기
          </button>
        </div>
        <div className="flex-grow flex items-center justify-center">
          {page === "WebrtcTeacher" && (
            <WebrtcTeacher
              roomId={roomId}
              userEmail={userEmail}
              userRole={role}
            />
          )}
          {page === "WebrtcStudent" && (
            <WebrtcStudent
              roomId={roomId}
              userEmail={userEmail}
              userRole={role}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Classroom;
