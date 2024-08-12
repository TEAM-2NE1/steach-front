import React, { useState, useRef, useEffect, useCallback, KeyboardEvent } from 'react';
import io from 'socket.io-client';
import WebRTCVideo from '../../components/video/index.tsx';
import { WebRTCUser } from '../../types/index.ts';
import WebrtcStudentScreenShare from "./WebrtcStudentScreenShare.tsx";
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store.tsx';
import { useParams } from 'react-router-dom';
import styles from './WebrtcStudent.module.css';

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

const WebrtcStudent: React.FC<WebrtcProps> = ({ roomId, userEmail, userRole }) => {
	const socketRef = useRef<SocketIOClient.Socket>();
	const pcsRef = useRef<{ [socketId: string]: RTCPeerConnection }>({});
	const localVideoRef = useRef<HTMLVideoElement>(null);
	const localStreamRef = useRef<MediaStream>();
	const [users, setUsers] = useState<WebRTCUser[]>([]);
	const [isVideoEnabled, setIsVideoEnabled] = useState(false);
	const [isAudioEnabled, setIsAudioEnabled] = useState(false);
	const [isAudioDisabledByTeacher, setIsAudioDisabledByTeacher] = useState(false);
	const [isScreenShareEnabled, setIsScreenShareEnabled] = useState(false);
	const [isScreenShareDisabledByTeacher, setIsScreenShareDisabledByTeacher] = useState(false);
	const [messages, setMessages] = useState<string[]>([]);
	const [newMessage, setNewMessage] = useState('');
	const [goScreenShare, setGoScreenShare] = useState(false);
	const [screenShareStopSignal, setScreenShareStopSignal] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false); // 전체화면 상태 관리
	const [showControls, setShowControls] = useState(false); // 컨트롤 표시 상태
	const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);
	const [isChatOpen, setIsChatOpen] = useState(false);
	const dispatch = useDispatch<AppDispatch>();
	const { lecture_id } = useParams();



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
					screenShareDisabledByTeacher: isScreenShareDisabledByTeacher
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
					screenShareDisabledByTeacher: isScreenShareDisabledByTeacher
				});
			}
		}
	}

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

			socketRef.current.emit('join_room', {
				room: roomId,
				email: userEmail,
				userRole: userRole,
				videoEnabled: false,
				audioEnabled: false,
				audioDisabledByTeacher: false
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
			setIsVideoEnabled(videoTrack.enabled);
			if (socketRef.current) {
				socketRef.current.emit('toggle_media', {
					userId: socketRef.current.id,
					email: userEmail,
					videoEnabled: videoTrack.enabled,
					audioEnabled: isAudioEnabled,
					audioDisabledByTeacher: isAudioDisabledByTeacher,
					screenShareEnabled: isScreenShareEnabled,
					screenShareDisabledByTeacher: isScreenShareDisabledByTeacher
				});
			}
		}
	};

	const toggleAudio = () => {
		const audioTrack = localStreamRef.current?.getAudioTracks()[0];
		if (audioTrack && !isAudioDisabledByTeacher) {
			audioTrack.enabled = !audioTrack.enabled;
			setIsAudioEnabled(audioTrack.enabled);
			if (socketRef.current) {
				socketRef.current.emit('toggle_media', {
					userId: socketRef.current.id,
					email: userEmail,
					videoEnabled: isVideoEnabled,
					audioEnabled: audioTrack.enabled,
					audioDisabledByTeacher: isAudioDisabledByTeacher,
					screenShareEnabled: isScreenShareEnabled,
					screenShareDisabledByTeacher: isScreenShareDisabledByTeacher
				});
			}
		}
	};

	const offAudio = () => {
		const audioTrack = localStreamRef.current?.getAudioTracks()[0];
		if (audioTrack && !isAudioDisabledByTeacher) {
			audioTrack.enabled = false;
			setIsAudioEnabled(false);
			setIsAudioDisabledByTeacher(true);
			if (socketRef.current) {
				socketRef.current.emit('toggle_student_mic_complete', {
					userId: socketRef.current.id,
					email: userEmail,
					// videoEnabled: true,
					audioEnabled: audioTrack.enabled,
					audioDisabledByTeacher: true
				});
			}
		}
	};

	const allowAudio = () => {
		const audioTrack = localStreamRef.current?.getAudioTracks()[0];
		if (audioTrack && isAudioDisabledByTeacher) {
			audioTrack.enabled = false;
			setIsAudioEnabled(false);
			setIsAudioDisabledByTeacher(false);
			if (socketRef.current) {
				socketRef.current.emit('toggle_student_mic_complete', {
					userId: socketRef.current.id,
					email: userEmail,
					// videoEnabled: true,
					audioEnabled: audioTrack.enabled,
					audioDisabledByTeacher: false
				});
			}
		}
	};


	const allowScreenShare = () => {
		setIsScreenShareEnabled(false);
		setIsScreenShareDisabledByTeacher(false);
		if (socketRef.current) {
			socketRef.current.emit('toggle_student_screen_share_complete', {
				userId: socketRef.current.id,
				// videoEnabled: true,
				userEmail: userEmail,
				screenShareEnabled: false,
				screenShareDisabledByTeacher: false
			});
		}
	};

	const banScreenShare = () => {
		console.log('화면공유 금지됩니다');
		setIsScreenShareEnabled(false);
		setIsScreenShareDisabledByTeacher(true);
		if (socketRef.current) {
			socketRef.current.emit('toggle_student_screen_share_complete', {
				userId: socketRef.current.id,
				// videoEnabled: true,
				userEmail: userEmail,
				screenShareEnabled: false,
				screenShareDisabledByTeacher: true
			});
		}
		setGoScreenShare(false);
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

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			handleSendMessage
		}
	}

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
				console.log('get answer');
				const pc: RTCPeerConnection = pcsRef.current[answerSendID];
				if (pc) {
					pc.setRemoteDescription(new RTCSessionDescription(sdp));
				}
			},
		);

		socketRef.current.on(
			'getCandidate',
			async (data: { candidate: RTCIceCandidateInit; candidateSendID: string }) => {
				console.log('get candidate');
				const pc: RTCPeerConnection = pcsRef.current[data.candidateSendID];
				if (pc) {
					await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
					console.log('candidate add success');
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

		socketRef.current.on('toggle_student_mic', (data: { userId: string; audioDisabledByTeacher: boolean }) => {

			if(data.audioDisabledByTeacher){
				if (data.userId === socketRef.current?.id) {
					setIsAudioDisabledByTeacher(data.audioDisabledByTeacher);
					setIsAudioEnabled(false);
				}
				offAudio();
			}else{
				if (data.userId === socketRef.current?.id) {
					setIsAudioDisabledByTeacher(data.audioDisabledByTeacher);
					setIsAudioEnabled(false);
				}
				allowAudio();
			}

			setUsers((oldUsers) =>
				oldUsers.map((user) =>
					user.id === data.userId
						? { ...user, audioDisabledByTeacher: data.audioDisabledByTeacher }
						: user,
				),
			);
		});

		socketRef.current.on('receive_chat', (data: { senderRole: string; senderEmail: string; receivedChat: string }) => {
			setMessages((oldMessages) => [...oldMessages, `[${data.senderEmail}] ${data.receivedChat}`]);
		});

		socketRef.current.on('toggle_student_screen_share', (data: { userId: string; userEmail: string; screenShareDisabledByTeacher: boolean }) => {
			console.log(`Teacher toggled student's screen share ${data.userId}: screenShareDisabledByTeacher=${data.screenShareDisabledByTeacher}`);
			if(userEmail === data.userEmail){
				if(data.screenShareDisabledByTeacher){
					if (data.userId === socketRef.current?.id) {
						setIsScreenShareDisabledByTeacher(true);
						setIsScreenShareEnabled(false);
					}
					banScreenShare();
				}else{
					if (data.userId === socketRef.current?.id) {
						setIsScreenShareDisabledByTeacher(false);
						setIsScreenShareEnabled(false);
					}
					allowScreenShare();
				}

				setUsers((oldUsers) =>
					oldUsers.map((user) =>
						user.id === data.userId
							? { ...user, screenShareDisabledByTeacher: data.screenShareDisabledByTeacher }
							: user,
					),
				);
			}
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

	// ---------------

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


  const toggleMute = () => {
    if (localVideoRef.current) {
      localVideoRef.current.muted = !localVideoRef.current.muted;
      setIsMuted(localVideoRef.current.muted);
    }
  };

  const handleTimeUpdate = () => {
    if (localVideoRef.current) {
      setCurrentTime(localVideoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (localVideoRef.current) {
      setDuration(localVideoRef.current.duration);
    }
  };

  const handleFullscreenChange = () => {
		setShowControls(true); // 전체화면에 진입하거나 나올 때 컨트롤을 보여줍니다.
		showControlsTemporarily(); // 전체화면 진입 후 2초 동안 유지
    if (!document.fullscreenElement) {
      setShowControls(false); // 전체화면이 아닐 때는 바로 컨트롤을 숨깁니다.
    }
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

  useEffect(() => {
    if (localVideoRef.current) {
      localVideoRef.current.addEventListener('timeupdate', handleTimeUpdate);
      localVideoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      return () => {
        localVideoRef.current?.removeEventListener('timeupdate', handleTimeUpdate);
        localVideoRef.current?.removeEventListener('loadedmetadata', handleLoadedMetadata);
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
      };
    }
  }, []);


	return (
		<div className={`${styles.videoContainer} ${isFullscreen ? 'flex flex-wrap items-center justify-center w-full h-screen bg-discordChatBg top-0 left-0 z-50 gap-4' : 'flex flex-wrap items-center justify-center w-full h-screen bg-discordChatBg gap-4'}`}
			onMouseEnter={handleMouseEnter}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
		>
			<div className={`${isFullscreen ? 'fixed top-0 left-0 w-full h-full z-50 bg-black grid grid-cols-12 gap-4' : 'grid grid-cols-12 gap-4 w-full'} ${isChatOpen ? 'mr-[300px] transition-margin-right duration-500 ease-in-out' : 'transition-margin-right duration-500 ease-in-out'} flex flex-wrap items-center justify-center bg-discordChatBg`}>
				<div className="col-span-6 flex items-center justify-center">
					<div style={{ display: 'inline-block' }}>
						<div style={{ position: 'relative', width: 600, height: 338 }} className={`${styles.videoContainer}`}>
							<video
								className="w-full h-full bg-black"
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
							<WebrtcStudentScreenShare
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
			
			<div className={`grid grid-cols-12 gap-4 w-full mt-4 ${isChatOpen ? 'mr-[320px]' : 'mr-0'} transition-margin duration-500 ease-in-out`}>
  {users.map((user, index) => (
    <div key={index} className="col-span-6 flex items-center justify-center">
      <WebRTCVideo
        email={user.email}
        userRole={user.userRole}
        stream={user.stream}
        videoEnabled={user.videoEnabled}
        audioEnabled={user.audioEnabled}
        audioDisabledByTeacher={user.audioDisabledByTeacher}
        screenShareEnabled={user.screenShareEnabled}
        screenShareDisabledByTeacher={user.screenShareDisabledByTeacher}
        muted={
          userRole.toUpperCase() !== 'teacher'.toUpperCase() &&
          user.userRole.toUpperCase() !== 'teacher'.toUpperCase()
        }
      />
    </div>
  ))}
</div>
<div className={`absolute border-l-2 border-discordChatBg2 top-0 right-0 h-full w-80 p-4 bg-discordChatBg2 text-discordText ${isChatOpen ? 'translate-x-0 transition-transform duration-500 ease-in-out' : 'hidden translate-x-full transition-transform duration-500 ease-in-out'}`}>
				<h3>Chat</h3>
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
		</div>
	);
};

export default WebrtcStudent;
