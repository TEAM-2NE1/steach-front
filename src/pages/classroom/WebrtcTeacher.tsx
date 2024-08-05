import React, { useState, useRef, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import WebRTCVideo from '../../components/video';
import { WebRTCUser } from '../../types';

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
	const [messages, setMessages] = useState<string[]>([]);
	const [newMessage, setNewMessage] = useState('');

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

	const createPeerConnection = useCallback((socketID: string, email: string, role: string, videoEnabled: boolean, audioEnabled: boolean, audioDisabledByTeacher: boolean) => {
		try {
			const pc = new RTCPeerConnection(pc_config);

			pc.onicecandidate = (e) => {
				if (socketRef.current && e.candidate) {
					console.log('onicecandidate');
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
				console.log('ontrack success');
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
							audioDisabledByTeacher: audioDisabledByTeacher
						}),
				);
			};

			if (localStreamRef.current) {
				console.log('localstream add');
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
			setIsVideoEnabled(videoTrack.enabled);
			if (socketRef.current) {
				socketRef.current.emit('toggle_media', {
					userId: socketRef.current.id,
					videoEnabled: videoTrack.enabled,
					audioEnabled: isAudioEnabled,
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
					videoEnabled: isVideoEnabled,
					audioEnabled: audioTrack.enabled,
				});
			}
		}
	};

	const toggleStudentMic = (studentId: string, currentState: boolean | undefined) => {
		console.log(`Toggling mic for student ${studentId}, current state: ${currentState}`);
		if (socketRef.current) {
			socketRef.current.emit('toggle_student_mic', { studentId, state: !currentState });
		}
	};

	const handleSendMessage = () => {
		if (newMessage.trim() !== '') {
			if (socketRef.current) {
				console.log(`[SEND CHAT] ${userRole} / ${userEmail} / ${newMessage}`);
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

		socketRef.current.on('all_users', (allUsers: Array<{ id: string; email: string; userRole: string; videoEnabled: boolean; audioEnabled: boolean; audioDisabledByTeacher: boolean }>) => {
			allUsers.forEach(async (user) => {
				if (!localStreamRef.current) return;
				const pc = createPeerConnection(user.id, user.email, user.userRole, user.videoEnabled, user.audioEnabled, user.audioDisabledByTeacher);
				if (pc && socketRef.current) {
					pcsRef.current = { ...pcsRef.current, [user.id]: pc };
					try {
						const localSdp = await pc.createOffer({
							offerToReceiveAudio: true,
							offerToReceiveVideo: true,
						});
						console.log('create offer success');
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
			}) => {
				const { sdp, offerSendID, offerSendEmail, offerSendRole, offerSendVideoEnabled, offerSendAudioEnabled, offerSendAudioDisabledByTeacher } = data;
				console.log('get offer');
				if (!localStreamRef.current) return;
				const pc = createPeerConnection(offerSendID, offerSendEmail, offerSendRole, offerSendVideoEnabled, offerSendAudioEnabled, offerSendAudioDisabledByTeacher);
				if (pc && socketRef.current) {
					pcsRef.current = { ...pcsRef.current, [offerSendID]: pc };
					try {
						await pc.setRemoteDescription(new RTCSessionDescription(sdp));
						console.log('answer set remote description success');
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

		socketRef.current.on('update_media', (data: { userId: string; videoEnabled: boolean; audioEnabled: boolean; audioDisabledByTeacher: boolean }) => {
			console.log(`Updating media for user ${data.userId}: videoEnabled=${data.videoEnabled}, audioEnabled=${data.audioEnabled}, audioDisabledByTeacher=${data.audioDisabledByTeacher}`);
			setUsers((oldUsers) =>
				oldUsers.map((user) =>
					user.id === data.userId
						? { ...user, videoEnabled: data.videoEnabled, audioEnabled: data.audioEnabled, audioDisabledByTeacher: data.audioDisabledByTeacher }
						: user,
				),
			);

			// if (data.userId === socketRef.current?.id) {
			// 	// setIsAudioDisabledByTeacher(!!data.audioDisabledByTeacher);
			// 	if(data.audioDisabledByTeacher != null){
			// 		setIsAudioDisabledByTeacher(data.audioDisabledByTeacher);
			// 	}
			// 	if (data.audioDisabledByTeacher) {
			// 		setIsAudioEnabled(false);
			// 	}
			// }
		});

		socketRef.current.on('update_allow_mic', (data: { userId: string; audioEnabled: boolean; audioDisabledByTeacher: boolean }) => {
			console.log(`Updating media for user ${data.userId}: audioEnabled=${data.audioEnabled}, audioDisabledByTeacher=${data.audioDisabledByTeacher}`);
			setUsers((oldUsers) =>
				oldUsers.map((user) =>
					user.id === data.userId
						? { ...user, audioEnabled: data.audioEnabled, audioDisabledByTeacher: data.audioDisabledByTeacher }
						: user,
				),
			);
		});

		socketRef.current.on('toggle_student_mic', (data: { userId: string; audioDisabledByTeacher: boolean }) => {
			console.log(`Teacher toggled student's mic ${data.userId}: audioDisabledByTeacher=${data.audioDisabledByTeacher}`);

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

			// if (socketRef.current) {
			// 	socketRef.current.emit('toggle_student_mic', {
			// 		userId: socketRef.current.id,
			// 		audioDisabledByTeacher: data.audioDisabledByTeacher
			// 	});
			// }
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [createPeerConnection, getLocalStream]);

	return (
		<div>
			<p>선생님 화면!!!</p>
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

			<button onClick={toggleVideo}>
				{isVideoEnabled ? 'Turn Off Video' : 'Turn On Video'}
			</button>
			<button onClick={toggleAudio} disabled={isAudioDisabledByTeacher}>
				{isAudioEnabled ? 'Turn Off Audio' : 'Turn On Audio'}
			</button>
			<p>Teacher Allowed: {isAudioDisabledByTeacher ? 'No' : 'Yes'}</p>
			{users.map((user, index) => (
				<div key={index}>
					<WebRTCVideo
						email={user.email}
						userRole={user.userRole}
						stream={user.stream}
						videoEnabled={user.videoEnabled}
						audioEnabled={user.audioEnabled}
						audioDisabledByTeacher={user.audioDisabledByTeacher}
						muted={userRole !== 'teacher' && user.userRole !== 'teacher'} // Students can only see the teacher's video
					/>
					{userRole === 'teacher' && user.userRole === 'student' && (
						<button onClick={() => toggleStudentMic(user.id, user.audioDisabledByTeacher)}>
							{user.audioDisabledByTeacher ? 'Enable Mic' : 'Disable Mic'}
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
