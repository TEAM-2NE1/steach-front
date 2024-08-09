import React, { useState, useRef, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import WebRTCVideo from '../../components/video';
import { WebRTCUser } from '../../types';
import WebrtcStudentScreenShare from "./WebrtcStudentScreenShare.tsx";

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

			// if (data.userId === socketRef.current?.id) {
			// 	setIsAudioDisabledByTeacher(data.audioDisabledByTeacher);
			// 	if (data.audioDisabledByTeacher) {
			// 		setIsAudioEnabled(false);
			// 	}
			// }
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

	return (
		<div>
			<p>학생 화면!!!</p>
			<div style={{display: 'inline-block'}}>
				<video
					style={{
						width: 240,
						height: 240,
						margin: 5,
						backgroundColor: 'black',
					}}
					muted
					ref={localVideoRef}
					autoPlay
				/>
				<p>당신은 {userRole} 입니다.</p>
				<p>카메라 상태: {isVideoEnabled ? 'ON' : 'OFF'} </p>
				<p>마이크 상태: {isAudioEnabled ? 'ON' : 'OFF'} </p>
				<p>화면공유 상태: {isScreenShareEnabled ? 'ON' : 'OFF'} </p>
				<p>마이크 권한(발언권): {isAudioDisabledByTeacher ? 'X' : 'O'}</p>
				<p>화면공유 권한: {isScreenShareDisabledByTeacher ? 'X' : 'O'}</p>
				<button onClick={toggleVideo}>
					{isVideoEnabled ? 'Turn Off Video' : 'Turn On Video'}
				</button>
				<button onClick={toggleAudio} disabled={isAudioDisabledByTeacher}>
					{isAudioEnabled ? 'Turn Off Audio' : 'Turn On Audio'}
				</button>
				<button id="btn_start_screen_share" onClick={toggleScreenShare} disabled={isScreenShareDisabledByTeacher}>
					{isScreenShareEnabled ? '화면공유 중지하기' : '화면공유 시작하기'}
				</button>
			</div>
			<div style={{display: 'inline-block'}}>
				{goScreenShare && (
					<WebrtcStudentScreenShare roomId={roomId} userEmail={userEmail + '_screen'} userRole={userRole + '_screen'} toggleScreenShareFunc={toggleScreenShareFunc} screenShareStopSignal={screenShareStopSignal}/>
				)}
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
						//아랫줄 주석 치면 어케 되나?
						muted={userRole !== 'teacher' && user.userRole !== 'teacher'} // Students can only see the teacher's video
					/>
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

export default WebrtcStudent;
