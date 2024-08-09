import React, { useState, useRef, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import WebRTCVideo from '../../components/video';
import { WebRTCUser } from '../../types';
import WebrtcTeacherScreenShare from "./WebrtcTeacherScreenShare.tsx";

import { Drawer, FloatButton } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { fetchLectureQuiz } from "../../store/QuizSlice";
import {
  AudioMutedOutlined,
  AudioOutlined,
  EllipsisOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { QuizResponseDTO } from '../../components/quiz/QuizListComponent.tsx';
import { QuizFetchListForm, QuizState } from '../../interface/quiz/QuizInterface.ts';
import { AsyncThunkAction, Dispatch, AnyAction } from '@reduxjs/toolkit';
import { useParams } from 'react-router-dom';
// import DetailQuiz from "./QuizBlock";
// import { QuizResponseDTO } from "./QuizListComponent";

const pc_config = {
	iceServers: [
		{
			urls: 'stun:stun.l.google.com:19302',
		},
	],
};

const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const SOCKET_SERVER_URL = `${protocol}//${window.location.hostname}:${window.location.port ? window.location.port : '5000'}`;

interface WebrtcProps {
	roomId: string;
	userEmail: string;
	userRole: string;
}

const WebrtcTeacher: React.FC<WebrtcProps> = ({ roomId, userEmail, userRole }) => {
	const socketRef = useRef<SocketIOClient.Socket>();
	const pcsRef = useRef<{ [socketId: string]: RTCPeerConnection }>({});
	const localVideoRef = useRef<HTMLVideoElement>(null);
	const localStreamRef = useRef<MediaStream>();
	const [users, setUsers] = useState<WebRTCUser[]>([]);
	const [isVideoEnabled, setIsVideoEnabled] = useState(false);
	const [isAudioEnabled, setIsAudioEnabled] = useState(false);
	const [isAudioDisabledByTeacher, setIsAudioDisabledByTeacher] = useState(false);
	const [isScreenShareEnabled, setIsScreenShareEnabled] = useState(false);
	const [messages, setMessages] = useState<string[]>([]);
	const [newMessage, setNewMessage] = useState('');
	const [goScreenShare, setGoScreenShare] = useState(false);
	const [screenShareStopSignal, setScreenShareStopSignal] = useState(false);

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizResponseDTO | null>(
    null
	);
	const { status } = useSelector((state: RootState) => (state.quiz as QuizState));
  const quzzies = useSelector((state: RootState) => (state.quiz as QuizState).quizzes);

  // Drawer 여는 함수
  const showDrawer = () => {
    if (open) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  // Drawer 닫는 함수
  const onClose = () => {
    setOpen(false);
  };

  // 마이크 음소거 여부 핸들러 함수
  const handleIsMicroPhoneMute = () => {
    if (isMicroPhoneMute) {
      setIsMicroPhoneMute(false);
    } else {
      setIsMicroPhoneMute(true);
    }
  };

  // 소리 음소거 여부 핸들러 함수
  const handleIsAudioMute = () => {
    if (isAudioMute) {
      setIsAudioMute(false);
    } else {
      setIsAudioMute(true);
    }
  };

  // 자신의 화면 출력 여부 핸들러 함수
  const handleIsOnVideo = () => {
    if (isOnVideo) {
      setIsOnVideo(false);
    } else {
      setIsOnVideo(true);
    }
  };

  // 퀴즈 모달 핸들러 함수

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedQuiz(null);
  };

  //모달켜지기
  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  // 이 drawer을 켰을 때 퀴즈 리스트를 불러오기
	useEffect(() => {
		if (lecture_id) {
			dispatch(fetchLectureQuiz(lecture_id));
		}
  }, []);


// ----------------------------------------------------------------

	const toggleScreenShare = () => {
		if(!goScreenShare){
			setScreenShareStopSignal(false);
			toggleScreenShareFunc();
		}else{
			setScreenShareStopSignal(true);
		}
	}

	const toggleScreenShareFunc = () => {
		if(goScreenShare){
			setGoScreenShare(false);
			setIsScreenShareEnabled(false);
			if (socketRef.current) {
				socketRef.current.emit('toggle_media', {
					userId: socketRef.current.id,
					email: userEmail,
					videoEnabled: isVideoEnabled,
					audioEnabled: isAudioEnabled,
					audioDisabledByTeacher: isAudioDisabledByTeacher,
					screenShareEnabled: false,
					screenShareDisabledByTeacher: false
				});
			}
		}else{
			setGoScreenShare(true);
			setIsScreenShareEnabled(true);
			if (socketRef.current) {
				socketRef.current.emit('toggle_media', {
					userId: socketRef.current.id,
					email: userEmail,
					videoEnabled: isVideoEnabled,
					audioEnabled: isAudioEnabled,
					audioDisabledByTeacher: isAudioDisabledByTeacher,
					screenShareEnabled: true,
					screenShareDisabledByTeacher: false
				});
			}
		}
	}


	const getLocalStream = useCallback(async () => {
		try {
			const localStream = await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: {
					width: 240,
					height: 240,
				},
			});
			localStreamRef.current = localStream;
			if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
			if (!socketRef.current) return;

			const videoTrack = localStreamRef.current?.getVideoTracks()[0];
			const audioTrack = localStreamRef.current?.getAudioTracks()[0];
			videoTrack.enabled = false;
			audioTrack.enabled = false;

			socketRef.current.emit('join_room', {
				room: roomId,
				email: userEmail,
				userRole: userRole,
				videoEnabled: false,
				audioEnabled: false,
				audioDisabledByTeacher: false,
				screenShareEnabled: false,
				screenShareDisabledByTeacher: false
			});
		} catch (e) {
			console.log(`getUserMedia error: ${e}`);
		}
	}, [roomId, userEmail, userRole]);

	const createPeerConnection = useCallback((socketID: string, email: string, role: string, videoEnabled: boolean, audioEnabled: boolean, audioDisabledByTeacher: boolean, screenShareEnabled: boolean, screenShareDisabledByTeacher: boolean) => {
		try {
			const pc = new RTCPeerConnection(pc_config);
			if(email === userEmail + '_screen') return;

			pc.onicecandidate = (e) => {
				if (socketRef.current && e.candidate) {
					socketRef.current.emit('candidate', {
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
							screenShareDisabledByTeacher: screenShareDisabledByTeacher
						}),
				);
			};

			if (localStreamRef.current) {
				localStreamRef.current.getTracks().forEach((track) => {
					if (localStreamRef.current) {
						pc.addTrack(track, localStreamRef.current);
					}
				});
			} else {
				console.log('no local stream');
			}

			return pc;
		} catch (e) {
			console.error(e);
			return undefined;
		}
	}, []);

	const toggleVideo = () => {
		const videoTrack = localStreamRef.current?.getVideoTracks()[0];
		if (videoTrack) {
			videoTrack.enabled = !videoTrack.enabled;
			setIsOnVideo(videoTrack.enabled)
			setIsVideoEnabled(videoTrack.enabled);
			if (socketRef.current) {
				socketRef.current.emit('toggle_media', {
					userId: socketRef.current.id,
					email: userEmail,
					videoEnabled: videoTrack.enabled,
					audioEnabled: isAudioEnabled,
					screenShareEnabled: isScreenShareEnabled
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
				socketRef.current.emit('toggle_media', {
					userId: socketRef.current.id,
					email: userEmail,
					videoEnabled: isVideoEnabled,
					audioEnabled: audioTrack.enabled,
					screenShareEnabled: isScreenShareEnabled
				});
			}
		}
	};

	const toggleStudentMic = (studentId: string, currentState: boolean | undefined) => {
		if (socketRef.current) {
			socketRef.current.emit('toggle_student_mic', { studentId, state: !currentState });
		}
	};

	const toggleStudentScreenShare = (studentId: string, userEmail: string, currentState: boolean | undefined) => {
		if (socketRef.current) {
			socketRef.current.emit('toggle_student_screen_share', { studentId, userEmail: userEmail, state : !currentState });
		}
	};

	const handleSendMessage = () => {
		if (newMessage.trim() !== '') {
			if (socketRef.current) {
				socketRef.current.emit('send_chat', {
					senderRole: userRole,
					senderEmail: userEmail,
					message: newMessage
				});
				setNewMessage('');
			}
		}
	};

	useEffect(() => {
		socketRef.current = io.connect(SOCKET_SERVER_URL);
		getLocalStream();

		socketRef.current.on('all_users', (allUsers: Array<{ id: string; email: string; userRole: string; videoEnabled: boolean; audioEnabled: boolean; audioDisabledByTeacher: boolean; offerSendScreenShareEnabled: boolean; offerSendScreenShareDisabledByTeacher: boolean; }>) => {
			allUsers.forEach(async (user) => {
				if (!localStreamRef.current) return;
				const pc = createPeerConnection(user.id, user.email, user.userRole, user.videoEnabled, user.audioEnabled, user.audioDisabledByTeacher, user.offerSendScreenShareEnabled, user.offerSendScreenShareDisabledByTeacher);
				if (pc && socketRef.current) {
					pcsRef.current = { ...pcsRef.current, [user.id]: pc };
					try {
						const localSdp = await pc.createOffer({
							offerToReceiveAudio: true,
							offerToReceiveVideo: true,
						});
						await pc.setLocalDescription(new RTCSessionDescription(localSdp));
						socketRef.current.emit('offer', {
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
		});

		socketRef.current.on(
			'getOffer',
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
				const { sdp, offerSendID, offerSendEmail, offerSendRole, offerSendVideoEnabled, offerSendAudioEnabled, offerSendAudioDisabledByTeacher, offerSendScreenShareEnabled, offerSendScreenShareDisabledByTeacher} = data;
				if (!localStreamRef.current) return;
				const pc = createPeerConnection(offerSendID, offerSendEmail, offerSendRole, offerSendVideoEnabled, offerSendAudioEnabled, offerSendAudioDisabledByTeacher, offerSendScreenShareEnabled, offerSendScreenShareDisabledByTeacher);
				if (pc && socketRef.current) {
					pcsRef.current = { ...pcsRef.current, [offerSendID]: pc };
					try {
						await pc.setRemoteDescription(new RTCSessionDescription(sdp));
						const localSdp = await pc.createAnswer({
							offerToReceiveVideo: true,
							offerToReceiveAudio: true,
						});
						await pc.setLocalDescription(new RTCSessionDescription(localSdp));
						socketRef.current.emit('answer', {
							sdp: localSdp,
							answerSendID: socketRef.current.id,
							answerReceiveID: offerSendID,
						});
					} catch (e) {
						console.error(e);
					}
				}
			},
		);

		socketRef.current.on(
			'getAnswer',
			(data: { sdp: RTCSessionDescription; answerSendID: string }) => {
				const { sdp, answerSendID } = data;
				const pc: RTCPeerConnection = pcsRef.current[answerSendID];
				if (pc) {
					pc.setRemoteDescription(new RTCSessionDescription(sdp));
				}
			},
		);

		socketRef.current.on(
			'getCandidate',
			async (data: { candidate: RTCIceCandidateInit; candidateSendID: string }) => {
				const pc: RTCPeerConnection = pcsRef.current[data.candidateSendID];
				if (pc) {
					await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
				}
			},
		);

		socketRef.current.on('user_exit', (data: { id: string }) => {
			if (pcsRef.current[data.id]) {
				pcsRef.current[data.id].close();
				delete pcsRef.current[data.id];
				setUsers((oldUsers) => oldUsers.filter((user) => user.id !== data.id));
			}
		});

		socketRef.current.on('update_media', (data: { userId: string; videoEnabled: boolean; audioEnabled: boolean; audioDisabledByTeacher: boolean, screenShareEnabled: boolean, screenShareDisabledByTeacher: boolean }) => {
			setUsers((oldUsers) =>
				oldUsers.map((user) =>
					user.id === data.userId
						? { ...user, videoEnabled: data.videoEnabled, audioEnabled: data.audioEnabled, audioDisabledByTeacher: data.audioDisabledByTeacher, screenShareEnabled: data.screenShareEnabled, screenShareDisabledByTeacher: data.screenShareDisabledByTeacher}
						: user,
				),
			);
		});

		socketRef.current.on('update_allow_mic', (data: { userId: string; audioEnabled: boolean; audioDisabledByTeacher: boolean }) => {
			setUsers((oldUsers) =>
				oldUsers.map((user) =>
					user.id === data.userId
						? { ...user, audioEnabled: data.audioEnabled, audioDisabledByTeacher: data.audioDisabledByTeacher }
						: user,
				),
			);
		});

		socketRef.current.on('toggle_student_mic', (data: { userId: string; audioDisabledByTeacher: boolean }) => {

			setUsers((oldUsers) =>
				oldUsers.map((user) =>
					user.id === data.userId
						? { ...user, audioDisabledByTeacher: data.audioDisabledByTeacher }
						: user,
				),
			);

			if (data.userId === socketRef.current?.id) {
				setIsAudioDisabledByTeacher(data.audioDisabledByTeacher);
				if (data.audioDisabledByTeacher) {
					setIsAudioEnabled(false);
				}
			}
		});


		socketRef.current.on('toggle_student_screen_share', (data: { userId: string; screenShareDisabledByTeacher: boolean }) => {

			setUsers((oldUsers) =>
				oldUsers.map((user) =>
					user.id === data.userId
						? {...user, screenShareDisabledByTeacher: data.screenShareDisabledByTeacher}
						: user,
				),
			);

		});


		socketRef.current.on('toggle_student_screen_share_complete', (data: { userId: string; screenShareDisabledByTeacher: boolean }) => {

			setUsers((oldUsers) =>
				oldUsers.map((user) =>
					user.id === data.userId
						? {...user, screenShareDisabledByTeacher: data.screenShareDisabledByTeacher}
						: user,
				),
			);

		});

		socketRef.current.on('receive_chat', (data: { senderRole: string; senderEmail: string; receivedChat: string }) => {
			setMessages((oldMessages) => [...oldMessages, `[${data.senderEmail}] ${data.receivedChat}`]);
		});

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
		<div>
			<p>선생님 화면!!!</p>
			<div>
				<div style={{display: 'inline-block'}}>
					<video
						style={{
							width: 240,
							height: 240,
							margin: 5,
							backgroundColor: 'lightyellow',
						}}
						muted
						ref={localVideoRef}
						autoPlay
					/>
					<p>당신은 {userRole} 입니다.</p>
					<p>카메라 상태: {isVideoEnabled ? 'ON' : 'OFF'} </p>
					<p>마이크 상태: {isAudioEnabled ? 'ON' : 'OFF'} </p>
					<p>화면공유 상태: {isScreenShareEnabled ? 'ON' : 'OFF'} </p>

					{/* 비디오 */}
				{isOnVideo && (
						<button
						onClick={toggleVideo}
            className="fixed top-90 left-14 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-200"
						>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
							>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
								/>
            </svg>
					</button>
				)}
				{!isOnVideo && (
          <button
            onClick={toggleVideo}
            className="fixed top-90 left-14 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M12 18.75H4.5a2.25 2.25 0 0 1-2.25-2.25V9m12.841 9.091L16.5 19.5m-1.409-1.409c.407-.407.659-.97.659-1.591v-9a2.25 2.25 0 0 0-2.25-2.25h-9c-.621 0-1.184.252-1.591.659m12.182 12.182L2.909 5.909M1.5 4.5l1.409 1.409"
              />
            </svg>
          </button>
					)}
					
					{/* 오디오 */}
					{isAudioEnabled && (
          <FloatButton
							onClick={toggleAudio}
            icon={<AudioOutlined />}
            type="default"
            style={{ top: 160, left: 16 }}
						/>
					)}
					{!isAudioEnabled && (
						<FloatButton
							onClick={toggleAudio}
							icon={<AudioMutedOutlined />}
							type="default"
							style={{ top: 160, left: 16 }}
						/>
					)}
					{/* 화면공유 */}
						<div style={{display: 'inline-block'}}>
					<button
						id="btn_start_screen_share"
							onClick={toggleScreenShare}
							className="fixed top-60 left-14 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-200"
					>
					<svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
        />
        </svg>
						
					</button>
					{goScreenShare && (
						<WebrtcTeacherScreenShare roomId={roomId} userEmail={userEmail + '_screen'} userRole={userRole + '_screen'} toggleScreenShareFunc={toggleScreenShareFunc} screenShareStopSignal={screenShareStopSignal}/>
					)}
				</div>
				</div>
				{/* <div style={{display: 'inline-block'}}>
					<button id="btn_start_screen_share" onClick={toggleScreenShare}>{isScreenShareEnabled ? '화면공유 중지하기' : '화면공유 시작하기'}</button>
					{goScreenShare && (
						<WebrtcTeacherScreenShare roomId={roomId} userEmail={userEmail + '_screen'} userRole={userRole + '_screen'} toggleScreenShareFunc={toggleScreenShareFunc} screenShareStopSignal={screenShareStopSignal}/>
					)}
				</div> */}
				<button
					onClick={showDrawer}
            className="fixed  w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
              />
          </svg>
          
          </button>
          <button
            className="fixed top-30 left-14 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-200"
          
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
              />
            </svg>
          </button>
			</div>
			{users.map((user, index) => (
				<div key={index}>
					<WebRTCVideo
						email={user.email}
						userRole={user.userRole}
						stream={user.stream}
						videoEnabled={user.videoEnabled}
						audioEnabled={user.audioEnabled}
						audioDisabledByTeacher={user.audioDisabledByTeacher}
						screenShareEnabled={user.screenShareEnabled}
						screenShareDisabledByTeacher={user.screenShareDisabledByTeacher}
						muted={userRole !== 'teacher' && user.userRole !== 'teacher'} // Students can only see the teacher's video
					/>
					{userRole === 'teacher' && user.userRole === 'student' && (
						<button onClick={() => toggleStudentMic(user.id, user.audioDisabledByTeacher)}>
							{user.audioDisabledByTeacher ? 'Enable Mic' : 'Disable Mic'}
						</button>
					)}
					{userRole === 'teacher' && user.userRole === 'student' && (
						<button onClick={() => toggleStudentScreenShare(user.id, user.email, user.screenShareDisabledByTeacher)}>
							{user.screenShareDisabledByTeacher ? '화면공유 허용시키기' : '화면공유 금지시키기'}
						</button>
					)}
				</div>
			))}
			<div>
				<h3>Chat</h3>
				<div>
					{messages.map((msg, idx) => (
						<p key={idx}>{msg}</p>
					))}
				</div>
				<input
					type="text"
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					placeholder="Type a message"
				/>
				<button onClick={handleSendMessage}>Send</button>
			</div>
		</div>
	);
};

export default WebrtcTeacher;
// function dispatch(arg0: AsyncThunkAction<QuizFetchListForm, string, { state?: unknown; dispatch?: Dispatch<AnyAction> | undefined; extra?: unknown; rejectValue?: unknown; serializedErrorType?: unknown; pendingMeta?: unknown; fulfilledMeta?: unknown; rejectedMeta?: unknown; }>) {
// 	throw new Error('Function not implemented.');
// }

