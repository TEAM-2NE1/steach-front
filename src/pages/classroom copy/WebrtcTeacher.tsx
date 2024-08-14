import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  KeyboardEvent,
} from "react";
import io from "socket.io-client";
import WebRTCVideo from "../../components/video";
import { WebRTCUser } from "../../types";
import WebrtcTeacherScreenShare from "./WebrtcTeacherScreenShare.tsx";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { fetchLectureQuiz } from "../../store/QuizSlice";
// import { QuizResponseDTO } from '../../components/quiz/QuizListComponent.tsx';
import {
  QuizDetailForm,
  QuizFetchListForm,
  QuizState,
} from "../../interface/quiz/QuizInterface.ts";
import { AsyncThunkAction, Dispatch, AnyAction } from "@reduxjs/toolkit";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./WebrtcStudent.module.css";
import DetailQuiz from "../../components/quiz/QuizBlock.tsx";
import { reportLectureSlice } from '../../store/LectureSlice.tsx';
import { LectureReport } from '../../interface/Curriculainterface.tsx';
import { report } from 'process';
// import DetailQuiz from "./QuizBlock";
// import { QuizResponseDTO } from "./QuizListComponent";

const pc_config = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
const SOCKET_SERVER_URL = `${protocol}//${window.location.hostname}:${
  window.location.port ? window.location.port : "5000"
}`;

interface WebrtcProps {
  roomId: string;
  userEmail: string;
  userRole: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

interface ModalProps2 {
  isOpen: boolean;
	report: LectureReport | null
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm }) => {
	if (!isOpen) return null;
	
  return (
		<div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">강의 종료</h2>
        <p className="mb-6">정말 강의를 종료하시겠습니까?</p>
        <div className="flex justify-end">
          <button 
            onClick={onConfirm} 
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
						>
            예
          </button>
          <button 
            onClick={onClose} 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
						>
            아니요
          </button>
        </div>
      </div>
    </div>
  );
};

const Modal2: React.FC<ModalProps2> = ({ isOpen, report }) => {
	const navigate = useNavigate();
	if (!isOpen) return null;
	
  return (
		<div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
				<div className="grid grid-cols-2 grid-rows-2 gap-2">
				{report?.student_info_by_lecture_dto_list.map((user, index) => (
					<div key={index}>
              <div className="mx-3 my-4 p-4 bg-white border-2 border-hardBeige rounded-md shadow-md">
                <p>이름: {user.student_name}</p>
								<p>참여도: {user.focus_ratio} %</p>
                <p>점수: {user.total_quiz_score}점</p>
                <p>정답: 총 {user.correct_number}개</p>
              </div>
                </div>
              ))}
        </div>
				<div className="mx-3 p-4 my-4 bg-white border-2 border-hardBeige rounded-md shadow-md">
				<p>평균 집중 시간 : {report?.average_focus_minute}분</p>
              <p>수업 참여도 : {report?.average_focus_ratio}%</p>
              <p>퀴즈 점수 평균 : {report?.average_total_quiz_score}점</p>
              <p>퀴즈 정답 평균 : {report?.average_correct_number}개</p>
				</div>
        <button 
          onClick={() => navigate('/home')} 
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          수업 종료
        </button>
      </div>
    </div>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

interface ModalProps2 {
  isOpen: boolean;
	report: LectureReport | null
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm }) => {
	if (!isOpen) return null;
	
  return (
		<div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">강의 종료</h2>
        <p className="mb-6">정말 강의를 종료하시겠습니까?</p>
        <div className="flex justify-end">
          <button 
            onClick={onConfirm} 
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
						>
            예
          </button>
          <button 
            onClick={onClose} 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
						>
            아니요
          </button>
        </div>
      </div>
    </div>
  );
};

const Modal2: React.FC<ModalProps2> = ({ isOpen, report }) => {
	const navigate = useNavigate();
	if (!isOpen) return null;
	
  return (
		<div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
				<div className="grid grid-cols-2 grid-rows-2 gap-2">
				{report?.student_info_by_lecture_dto_list.map((user, index) => (
					<div key={index}>
              <div className="mx-3 my-4 p-4 bg-white border-2 border-hardBeige rounded-md shadow-md">
                <p>이름: {user.student_name}</p>
								<p>참여도: {user.focus_ratio} %</p>
                <p>점수: {user.total_quiz_score}점</p>
                <p>정답: 총 {user.correct_number}개</p>
              </div>
                </div>
              ))}
        </div>
				<div className="mx-3 p-4 my-4 bg-white border-2 border-hardBeige rounded-md shadow-md">
				<p>평균 집중 시간 : {report?.average_focus_minute}분</p>
              <p>수업 참여도 : {report?.average_focus_ratio}%</p>
              <p>퀴즈 점수 평균 : {report?.average_total_quiz_score}점</p>
              <p>퀴즈 정답 평균 : {report?.average_correct_number}개</p>
				</div>
        <button 
          onClick={() => navigate('/home')} 
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          수업 종료
        </button>
      </div>
    </div>
  );
};

const WebrtcTeacher: React.FC<WebrtcProps> = ({
  roomId,
  userEmail,
  userRole,
}) => {
  const socketRef = useRef<SocketIOClient.Socket>();
  const pcsRef = useRef<{ [socketId: string]: RTCPeerConnection }>({});
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream>();
  const [users, setUsers] = useState<WebRTCUser[]>([]);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isAudioDisabledByTeacher, setIsAudioDisabledByTeacher] =
    useState(false);
  const [isScreenShareEnabled, setIsScreenShareEnabled] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [goScreenShare, setGoScreenShare] = useState(false);
  const [screenShareStopSignal, setScreenShareStopSignal] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false); // 전체화면 상태 관리
	const [showControls, setShowControls] = useState(false); // 컨트롤 표시 상태
	const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);
	const [isChatOpen, setIsChatOpen] = useState(false);
	const [isItemsOpen, setIsItemsOpen] = useState(false);
	const [isQuizOpen, setIsQuizOpen] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [isModal2Open, setIsModal2Open] = useState<boolean>(false);
	
// --------------------------------------------------------------
	const dispatch = useDispatch<AppDispatch>();
	const { lecture_id } = useParams();
	
  // drawer 여닫기
  const [open, setOpen] = useState(false);

  // 마이크 음소거 여부
  const [isMicroPhoneMute, setIsMicroPhoneMute] = useState(false);

  // 소리 음소거 여부
  const [isAudioMute, setIsAudioMute] = useState(false);

  // 화면 출력 여부
  const [isOnVideo, setIsOnVideo] = useState(false);

  // 화면 출력 여부
  const [chating, setChating] = useState(false);

  // 퀴즈 모달
  //퀴즈모달 출력 여부
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  //퀴즈모달 닫기
  const handleCloseQuizModal = () => {
    setIsQuizModalOpen(false);
    setSelectedQuiz(null);
  };

  //클릭한 퀴즈
  const [selectedQuiz, setSelectedQuiz] = useState<QuizDetailForm | null>(null);

  //퀴즈
  let quizzes = useSelector((state: RootState) => state.quiz.quizzes);

  // 이 drawer을 켰을 때 퀴즈 리스트를 불러오기
	useEffect(() => {
		if (lecture_id) {
			dispatch(fetchLectureQuiz(lecture_id));
			dispatch(reportLectureSlice(lecture_id))
		}
  }, [dispatch]);
	const report = useSelector((state: RootState) => (state.lectures.lectureReport));
	console.log(report)

	// ----------------------------------------------------------------
	const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
	};
	
	const openModal2 = () => {
    setIsModal2Open(true);
  };

  const closeModal2 = () => {
    setIsModal2Open(false);
  };

	const confirmAction = () => {
		// if (socketRef.current) {
		// 	socketRef.current.emit('lecture_end');
		// }
		openModal2();
    closeModal();
  };
	

const handleMouseEnter = () => {
	setShowControls(true);
	if (hideControlsTimeout.current) {
		clearTimeout(hideControlsTimeout.current);
	}
};

  const handleMouseMove = () => {
    showControlsTemporarily();
  };

  const handleMouseLeave = () => {
    setShowControls(false);
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current);
    }
  };

  const showControlsTemporarily = () => {
    setShowControls(true);
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current);
    }
    hideControlsTimeout.current = setTimeout(() => {
      setShowControls(false);
    }, 2000);
  };

  const toggleFullscreen = () => {
    if (localVideoRef.current) {
      if (!document.fullscreenElement) {
        localVideoRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  const toggleFullscreen2 = () => {
    setIsFullscreen((prev) => !prev);
  };

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  const toggleItems = () => {
    setIsItemsOpen((prev) => !prev);
  };

  const toggleQuiz = () => {
    setIsQuizOpen((prev) => !prev);
  };

  const toggleScreenShare = () => {
    if (!goScreenShare) {
      setScreenShareStopSignal(false);
      toggleScreenShareFunc();
    } else {
      setScreenShareStopSignal(true);
    }
  };

  const toggleScreenShareFunc = () => {
    if (goScreenShare) {
      setGoScreenShare(false);
      setIsScreenShareEnabled(false);
      if (socketRef.current) {
        socketRef.current.emit("toggle_media", {
          userId: socketRef.current.id,
          email: userEmail,
          videoEnabled: isVideoEnabled,
          audioEnabled: isAudioEnabled,
          audioDisabledByTeacher: isAudioDisabledByTeacher,
          screenShareEnabled: false,
          screenShareDisabledByTeacher: false,
        });
      }
    } else {
      setGoScreenShare(true);
      setIsScreenShareEnabled(true);
      if (socketRef.current) {
        socketRef.current.emit("toggle_media", {
          userId: socketRef.current.id,
          email: userEmail,
          videoEnabled: isVideoEnabled,
          audioEnabled: isAudioEnabled,
          audioDisabledByTeacher: isAudioDisabledByTeacher,
          screenShareEnabled: true,
          screenShareDisabledByTeacher: false,
        });
      }
    }
  };

  const getLocalStream = useCallback(async () => {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: 1920,
          height: 1080,
        },
      });
      localStreamRef.current = localStream;
      if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
      if (!socketRef.current) return;

      const videoTrack = localStreamRef.current?.getVideoTracks()[0];
      const audioTrack = localStreamRef.current?.getAudioTracks()[0];
      videoTrack.enabled = false;
      audioTrack.enabled = false;
      console.log("getLocalStream", roomId);
      socketRef.current.emit("join_room", {
        room: roomId,
        email: userEmail,
        userRole: userRole,
        videoEnabled: false,
        audioEnabled: false,
        audioDisabledByTeacher: false,
        screenShareEnabled: false,
        screenShareDisabledByTeacher: false,
      });
    } catch (e) {
      console.log(`getUserMedia error: ${e}`);
    }
  }, [roomId, userEmail, userRole]);

  const createPeerConnection = useCallback(
    (
      socketID: string,
      email: string,
      role: string,
      videoEnabled: boolean,
      audioEnabled: boolean,
      audioDisabledByTeacher: boolean,
      screenShareEnabled: boolean,
      screenShareDisabledByTeacher: boolean
    ) => {
      try {
        const pc = new RTCPeerConnection(pc_config);
        if (email === userEmail + "_screen") return;

        pc.onicecandidate = (e) => {
          if (socketRef.current && e.candidate) {
            socketRef.current.emit("candidate", {
              candidate: e.candidate,
              candidateSendID: socketRef.current.id,
              candidateReceiveID: socketID,
            });
          }
        };

        pc.oniceconnectionstatechange = (e) => {
          console.log(e);
        };

        pc.ontrack = (e) => {
          setUsers((oldUsers) =>
            oldUsers
              .filter((user) => user.id !== socketID)
              .concat({
                id: socketID,
                email,
                userRole: role,
                stream: e.streams[0],
                videoEnabled: videoEnabled,
                audioEnabled: audioEnabled,
                audioDisabledByTeacher: audioDisabledByTeacher,
                screenShareEnabled: screenShareEnabled,
                screenShareDisabledByTeacher: screenShareDisabledByTeacher,
              })
          );
        };

        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach((track) => {
            if (localStreamRef.current) {
              pc.addTrack(track, localStreamRef.current);
            }
          });
        } else {
          console.log("no local stream");
        }

        return pc;
      } catch (e) {
        console.error(e);
        return undefined;
      }
    },
    []
  );

  const toggleVideo = () => {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsOnVideo(videoTrack.enabled);
      setIsVideoEnabled(videoTrack.enabled);
      if (socketRef.current) {
        socketRef.current.emit("toggle_media", {
          userId: socketRef.current.id,
          email: userEmail,
          videoEnabled: videoTrack.enabled,
          audioEnabled: isAudioEnabled,
          screenShareEnabled: isScreenShareEnabled,
        });
      }
    }
  };

  const toggleAudio = () => {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudioEnabled(audioTrack.enabled);
      if (socketRef.current) {
        socketRef.current.emit("toggle_media", {
          userId: socketRef.current.id,
          email: userEmail,
          videoEnabled: isVideoEnabled,
          audioEnabled: audioTrack.enabled,
          screenShareEnabled: isScreenShareEnabled,
        });
      }
    }
  };

  const toggleStudentMic = (
    studentId: string,
    currentState: boolean | undefined
  ) => {
    if (socketRef.current) {
      socketRef.current.emit("toggle_student_mic", {
        studentId,
        state: !currentState,
      });
    }
  };

  const toggleStudentScreenShare = (
    studentId: string,
    userEmail: string,
    currentState: boolean | undefined
  ) => {
    if (socketRef.current) {
      socketRef.current.emit("toggle_student_screen_share", {
        studentId,
        userEmail: userEmail,
        state: !currentState,
      });
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() !== "") {
      if (socketRef.current) {
        socketRef.current.emit("send_chat", {
          senderRole: userRole,
          senderEmail: userEmail,
          message: newMessage,
        });
        setNewMessage("");
      }
    }
  };

  useEffect(() => {
    socketRef.current = io.connect(SOCKET_SERVER_URL);
    console.log("useEffect", roomId);
    getLocalStream();

    socketRef.current.on(
      "all_users",
      (
        allUsers: Array<{
          id: string;
          email: string;
          userRole: string;
          videoEnabled: boolean;
          audioEnabled: boolean;
          audioDisabledByTeacher: boolean;
          offerSendScreenShareEnabled: boolean;
          offerSendScreenShareDisabledByTeacher: boolean;
        }>
      ) => {
        allUsers.forEach(async (user) => {
          if (!localStreamRef.current) return;
          const pc = createPeerConnection(
            user.id,
            user.email,
            user.userRole,
            user.videoEnabled,
            user.audioEnabled,
            user.audioDisabledByTeacher,
            user.offerSendScreenShareEnabled,
            user.offerSendScreenShareDisabledByTeacher
          );
          if (pc && socketRef.current) {
            pcsRef.current = { ...pcsRef.current, [user.id]: pc };
            try {
              const localSdp = await pc.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true,
              });
              await pc.setLocalDescription(new RTCSessionDescription(localSdp));
              socketRef.current.emit("offer", {
                sdp: localSdp,
                offerSendID: socketRef.current.id,
                offerSendEmail: userEmail,
                offerSendRole: userRole,
                offerReceiveID: user.id,
              });
            } catch (e) {
              console.error(e);
            }
          }
        });
      }
    );

    socketRef.current.on(
      "getOffer",
      async (data: {
        sdp: RTCSessionDescription;
        offerSendID: string;
        offerSendEmail: string;
        offerSendRole: string;
        offerSendVideoEnabled: boolean;
        offerSendAudioEnabled: boolean;
        offerSendAudioDisabledByTeacher: boolean;
        offerSendScreenShareEnabled: boolean;
        offerSendScreenShareDisabledByTeacher: boolean;
      }) => {
        const {
          sdp,
          offerSendID,
          offerSendEmail,
          offerSendRole,
          offerSendVideoEnabled,
          offerSendAudioEnabled,
          offerSendAudioDisabledByTeacher,
          offerSendScreenShareEnabled,
          offerSendScreenShareDisabledByTeacher,
        } = data;
        if (!localStreamRef.current) return;
        const pc = createPeerConnection(
          offerSendID,
          offerSendEmail,
          offerSendRole,
          offerSendVideoEnabled,
          offerSendAudioEnabled,
          offerSendAudioDisabledByTeacher,
          offerSendScreenShareEnabled,
          offerSendScreenShareDisabledByTeacher
        );
        if (pc && socketRef.current) {
          pcsRef.current = { ...pcsRef.current, [offerSendID]: pc };
          try {
            await pc.setRemoteDescription(new RTCSessionDescription(sdp));
            const localSdp = await pc.createAnswer({
              offerToReceiveVideo: true,
              offerToReceiveAudio: true,
            });
            await pc.setLocalDescription(new RTCSessionDescription(localSdp));
            socketRef.current.emit("answer", {
              sdp: localSdp,
              answerSendID: socketRef.current.id,
              answerReceiveID: offerSendID,
            });
          } catch (e) {
            console.error(e);
          }
        }
      }
    );

    socketRef.current.on(
      "getAnswer",
      (data: { sdp: RTCSessionDescription; answerSendID: string }) => {
        const { sdp, answerSendID } = data;
        const pc: RTCPeerConnection = pcsRef.current[answerSendID];
        if (pc) {
          pc.setRemoteDescription(new RTCSessionDescription(sdp));
        }
      }
    );

    socketRef.current.on(
      "getCandidate",
      async (data: {
        candidate: RTCIceCandidateInit;
        candidateSendID: string;
      }) => {
        const pc: RTCPeerConnection = pcsRef.current[data.candidateSendID];
        if (pc) {
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
      }
    );

    socketRef.current.on("user_exit", (data: { id: string }) => {
      if (pcsRef.current[data.id]) {
        pcsRef.current[data.id].close();
        delete pcsRef.current[data.id];
        setUsers((oldUsers) => oldUsers.filter((user) => user.id !== data.id));
      }
    });

    socketRef.current.on(
      "update_media",
      (data: {
        userId: string;
        videoEnabled: boolean;
        audioEnabled: boolean;
        audioDisabledByTeacher: boolean;
        screenShareEnabled: boolean;
        screenShareDisabledByTeacher: boolean;
      }) => {
        setUsers((oldUsers) =>
          oldUsers.map((user) =>
            user.id === data.userId
              ? {
                  ...user,
                  videoEnabled: data.videoEnabled,
                  audioEnabled: data.audioEnabled,
                  audioDisabledByTeacher: data.audioDisabledByTeacher,
                  screenShareEnabled: data.screenShareEnabled,
                  screenShareDisabledByTeacher:
                    data.screenShareDisabledByTeacher,
                }
              : user
          )
        );
      }
    );

    socketRef.current.on(
      "update_allow_mic",
      (data: {
        userId: string;
        audioEnabled: boolean;
        audioDisabledByTeacher: boolean;
      }) => {
        setUsers((oldUsers) =>
          oldUsers.map((user) =>
            user.id === data.userId
              ? {
                  ...user,
                  audioEnabled: data.audioEnabled,
                  audioDisabledByTeacher: data.audioDisabledByTeacher,
                }
              : user
          )
        );
      }
    );

    socketRef.current.on(
      "toggle_student_mic",
      (data: { userId: string; audioDisabledByTeacher: boolean }) => {
        setUsers((oldUsers) =>
          oldUsers.map((user) =>
            user.id === data.userId
              ? { ...user, audioDisabledByTeacher: data.audioDisabledByTeacher }
              : user
          )
        );

        if (data.userId === socketRef.current?.id) {
          setIsAudioDisabledByTeacher(data.audioDisabledByTeacher);
          if (data.audioDisabledByTeacher) {
            setIsAudioEnabled(false);
          }
        }
      }
    );

    socketRef.current.on(
      "toggle_student_screen_share",
      (data: { userId: string; screenShareDisabledByTeacher: boolean }) => {
        setUsers((oldUsers) =>
          oldUsers.map((user) =>
            user.id === data.userId
              ? {
                  ...user,
                  screenShareDisabledByTeacher:
                    data.screenShareDisabledByTeacher,
                }
              : user
          )
        );
      }
    );

    socketRef.current.on(
      "toggle_student_screen_share_complete",
      (data: { userId: string; screenShareDisabledByTeacher: boolean }) => {
        setUsers((oldUsers) =>
          oldUsers.map((user) =>
            user.id === data.userId
              ? {
                  ...user,
                  screenShareDisabledByTeacher:
                    data.screenShareDisabledByTeacher,
                }
              : user
          )
        );
      }
    );

    socketRef.current.on(
      "receive_chat",
      (data: {
        senderRole: string;
        senderEmail: string;
        receivedChat: string;
      }) => {
        setMessages((oldMessages) => [
          ...oldMessages,
          `[${data.senderEmail}] ${data.receivedChat}`,
        ]);
      }
    );

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      users.forEach((user) => {
        if (pcsRef.current[user.id]) {
          pcsRef.current[user.id].close();
          delete pcsRef.current[user.id];
        }
      });
    };
  }, [createPeerConnection, getLocalStream]);

	return (
		<>
			    <div className="relative">
      <button 
        onClick={openModal} 
        className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-2xl hover:bg-red-600"
      >
        강의 종료
      </button>
      <Modal isOpen={isModalOpen} onClose={closeModal} onConfirm={confirmAction} />
				<Modal2 isOpen={isModal2Open} onClose={closeModal2} report={report} />
			</div>
		<div className={`${styles.videoContainer} ${isFullscreen ? 'flex flex-wrap items-center justify-center w-full h-screen bg-discordChatBg top-0 left-0 z-50 gap-4' : 'flex flex-wrap items-center justify-center w-full h-full bg-discordChatBg gap-4'}`}
			onMouseEnter={handleMouseEnter}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
		>
			<div className={`${isFullscreen ? 'fixed top-0 left-0 w-full h-full z-50 bg-black grid grid-cols-12 gap-4' : 'grid grid-cols-12 gap-4 w-full h-screen'} ${isChatOpen || isItemsOpen || isQuizOpen ? 'mr-[300px] transition-margin-right duration-500 ease-in-out' : 'transition-margin-right duration-500 ease-in-out'} flex flex-wrap items-center justify-center bg-discordChatBg`}>
				<div className="col-span-6 flex items-center justify-center">
					<div style={{ display: 'inline-block' }}>
						<div style={{ position: 'relative', width: 600, height: 338 }} className={`${styles.videoContainer}`}>
							<video
								className="w-full h-full bg-black rounded-2xl"
								onClick={toggleFullscreen}
								muted={isMuted}
								ref={localVideoRef}
								autoPlay
								controls={false}
							/>
						</div>
						{showControls && (
							<div className={`absolute bottom-0 left-0 right-0 flex justify-around items-center p-3 rounded-lg ${showControls ? 'translate-y-0 opacity-100 transition-transform transition-opacity duration-500 ease-in-out' : 'translate-y-full opacity-0 transition-transform transition-opacity duration-500 ease-in-out'} bg-opacity-80 bg-gradient-to-t from-black to-transparent z-10`}>
								<div className='grid grid-cols-12 '>
								<div className='col-span-2'></div>
									<div className='col-span-8'>
										
								<button onClick={toggleVideo} className="text-white rounded-full border-2 border-black w-12 h-12 bg-black mx-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
									{isVideoEnabled ? '📸 ' : '📷 '}
								</button>
								<button onClick={toggleAudio} className="text-white rounded-full border-2 border-black w-12 h-12 bg-black mx-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
									{isAudioEnabled ? '🔊' : '🔇'}
								</button>
								<button onClick={toggleScreenShare} className="text-white rounded-full border-2 border-black w-12 h-12 bg-black mx-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
									{isScreenShareEnabled ? '🖥️' : '🖥️'}
								</button>
								<button onClick={toggleFullscreen2} className="text-white rounded-full border-2 border-black w-12 h-12 bg-black mx-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
									⛶ {isFullscreen ? '' : ''}
								</button>
								<button
									onClick={toggleChat}
									className="text-white rounded-full border-2 border-black w-12 h-12 bg-black mx-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
									>
									{isChatOpen ? '💬' : '💬'}
								</button>
								<button
									onClick={toggleItems}
									className="text-white rounded-full border-2 border-black w-12 h-12 bg-black mx-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
									>
									{isItemsOpen ? '👜' : '👜'}
								</button>
								<button
									onClick={toggleQuiz}
									className="text-white rounded-full border-2 border-black w-12 h-12 bg-black mx-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
									>
									{isItemsOpen ? '🎓' : '🎓'}
										</button>

					</div>
								<div className='col-span-2'></div>
				</div>
							</div>
						)}
					</div>
				</div>
				<div className="col-span-6 flex items-center justify-center">
					<div style={{ display: 'inline-block' }}>
						{goScreenShare && (
							<WebrtcTeacherScreenShare
								roomId={roomId}
								userEmail={userEmail + '_screen'}
								userRole={userRole + '_screen'}
								toggleScreenShareFunc={toggleScreenShareFunc}
								screenShareStopSignal={screenShareStopSignal}
							/>
						)}
					</div>
				</div>
			</div>
			<div className={`grid grid-cols-12 gap-4 w-full mt-4 ${isChatOpen || isItemsOpen ? 'mr-[320px]' : 'mr-0'} transition-margin duration-500 ease-in-out`}>
			{users.map((user, index) => (
				<div key={index} className="col-span-6 flex items-center justify-center">

					{user.userRole.endsWith('_screen') ? null : (
						<div className="flex flex-col">
							<div className="flex-grow">
							<div className="flex h-4">
								<div className="w-1/2 flex items-center justify-center text-white">
									{userRole === 'TEACHER' && user?.userRole === 'STUDENT' && (
										<button onClick={() => toggleStudentMic(user.id, user.audioDisabledByTeacher)} className="mt-2">
											{user.audioDisabledByTeacher ? '마이크 허용' : '마이크 금지'}
										</button>
									)}
								</div>
								<div className="w-1/2 flex items-center justify-center text-white">
									{userRole === 'TEACHER' && user?.userRole === 'STUDENT' && (
										<button onClick={() => toggleStudentScreenShare(user.id, user.email, user.screenShareDisabledByTeacher)} className="mt-2">
											{user.screenShareDisabledByTeacher ? '화면공유 허용' : '화면공유 금지'}
										</button>
									)}
								</div>
							</div>
								<div className="w-full h-full flex items-center justify-center">
									<WebRTCVideo
										email={user.email}
										userRole={user.userRole}
										stream={user.stream}
										videoEnabled={user.videoEnabled}
										audioEnabled={user.audioEnabled}
										audioDisabledByTeacher={user.audioDisabledByTeacher}
										screenShareEnabled={user.screenShareEnabled}
										screenShareDisabledByTeacher={user.screenShareDisabledByTeacher}
										muted={userRole !== 'TEACHER' && user.userRole !== 'TEACHER'}
										isScreenShare={false}
									/>
								</div>
							</div>

						</div>
)}
  </div>
))}

			</div>
			<div className={`absolute border-l-2 border-discordChatBg2 top-0 right-0 h-full w-80 p-4 bg-discordChatBg2 text-discordText ${isChatOpen ? 'translate-x-0 transition-transform duration-500 ease-in-out' : 'hidden translate-x-full transition-transform duration-500 ease-in-out'}`}>
			<h3 className="mt-2 mb-5 text-2xl font-semibold">채팅</h3>
				<div className="border border-discordChatBg2 p-2 h-3/4 overflow-y-auto bg-discordChatBg text-discordText">
					{messages.map((msg, idx) => (
						<p key={idx}>{msg}</p>
					))}
				</div>
				<input
					type="text"
					value={newMessage}
					onKeyDown={handleKeyDown}
					onChange={(e) => setNewMessage(e.target.value)}
					placeholder="메세지 전송"
					className="border-2 mt-2 border-discordChatBg2 p-2 w-full bg-discordChatBg text-discordText"
				/>
				<button onClick={handleSendMessage} className="mt-2 p-2 bg-discordChatBg text-discordText rounded w-full border-2 border-discordChatBg2">
					전송
				</button>
			</div>
			<div className={`absolute border-l-2 border-discordChatBg2 top-0 right-0 h-full w-80 p-4 bg-discordChatBg2 text-discordText ${isItemsOpen ? 'translate-x-0 transition-transform duration-500 ease-in-out' : 'hidden translate-x-full transition-transform duration-500 ease-in-out'}`}>
				<h3>Items</h3>
				<div className="border border-discordChatBg2 p-2 h-3/4 overflow-y-auto bg-discordChatBg text-discordText">
				{users.filter(user => user.userRole.endsWith('_screen')).map((user, index) => (
            <WebRTCVideo
              key={index}
              email={user.email}
              userRole={user.userRole}
              stream={user.stream}
              videoEnabled={user.videoEnabled}
              audioEnabled={user.audioEnabled}
              audioDisabledByTeacher={user.audioDisabledByTeacher}
              screenShareEnabled={user.screenShareEnabled}
              screenShareDisabledByTeacher={user.screenShareDisabledByTeacher}
              muted={true}
              isScreenShare={true} // 화면 공유용 비디오임을 명시
            />
          ))}
				</div>

			</div>
			<div className={`absolute border-l-2 border-discordChatBg2 top-0 right-0 h-full w-80 p-4 bg-discordChatBg2 text-discordText ${isQuizOpen ? 'translate-x-0 transition-transform duration-500 ease-in-out' : 'hidden translate-x-full transition-transform duration-500 ease-in-out'}`}>
				<h3>Quiz</h3>
				<div className="border border-discordChatBg2 p-2 h-3/4 overflow-y-auto bg-discordChatBg text-discordText">
					{/* 퀴즈에 넣을 내용 */}
					<p>해당 내용 지우고 작성하면 됨</p>
					{/* 퀴즈에 넣을 내용 */}
				</div>

				<button onClick={handleSendMessage} className="mt-2 p-2 bg-discordChatBg text-discordText rounded w-full border-2 border-discordChatBg2">
					전송
				</button>
			</div>
			</div>
		</>
	);
};

export default WebrtcTeacher;
