import React, { useState, useRef, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
// import WebRTCVideo from '../../components/video/index.tsx';
// import SharedScreen from '../../components/video/shardScreen.tsx';
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
	toggleScreenShareFunc : () =>  void;
	screenShareStopSignal: boolean;
}

const WebrtcStudentScreenShare: React.FC<WebrtcProps> = ({ roomId, userEmail, userRole, toggleScreenShareFunc, screenShareStopSignal }) => {
	const socketRef = useRef<SocketIOClient.Socket>();
	const pcsRef = useRef<{ [socketId: string]: RTCPeerConnection }>({});
	const localScreenShareRef = useRef<HTMLVideoElement>(null);
	const localScreenShareStreamRef = useRef<MediaStream>();
	const [users, setUsers] = useState<WebRTCUser[]>([]);
	// const [screenShareStream, setScreenShareStream] = useState<MediaStream | null>(null);
	// let gotFirstMediaStream = false;
	useEffect(() => {
		console.log(`[화면공유 컴포넌트] goScreenShare 변경됨. ${screenShareStopSignal}가 됨`);
		if(screenShareStopSignal){ // 지금 끈거면
			console.log('[화면공유 컴포넌트] Signal ON 감지 -> videoTrack 종료');
			const videoTrack = localScreenShareStreamRef.current?.getVideoTracks()[0];
			if(videoTrack){
				videoTrack.stop();
				videoTrack.enabled = false;
			}
			toggleScreenShareFunc();
		}
	}, [screenShareStopSignal]);

	const getLocalStream = useCallback(async () => {
		try {
			console.log('[화면공유 컴포넌트] 학생 화면공유 시도함');
			const localScreenShareStream = await navigator.mediaDevices.getDisplayMedia({
				video: {
					width: 240,
					height: 135,
					cursor: 'always'
				} as MediaTrackConstraints,
				audio: false
			});

			localScreenShareStreamRef.current = localScreenShareStream;

			if (localScreenShareRef.current) localScreenShareRef.current.srcObject = localScreenShareStream;
			if (!socketRef.current) return;

			const videoTrack = localScreenShareStreamRef.current?.getVideoTracks()[0];

			videoTrack.addEventListener('ended', () => {
				console.log('[화면공유 컴포넌트] 학생 화면공유 종료 감지됨!!');
				toggleScreenShareFunc();
			});

			localScreenShareStreamRef.current?.addTrack(videoTrack);

			socketRef.current.emit('join_room', {
				room: roomId,
				email: userEmail,
				userRole: userRole,
				videoEnabled: true,
				audioEnabled: true,
				audioDisabledByTeacher: false,
				screenShareEnabled: true,
				screenShareDisabledByTeacher: false
			});

		} catch (err) {
			console.error('[화면공유 컴포넌트] Error sharing screen:', err);
			toggleScreenShareFunc();
		}
	}, [roomId, userEmail, userRole]);

	const createPeerConnection = useCallback((socketID: string, email: string, role: string, videoEnabled: boolean, audioEnabled: boolean, audioDisabledByTeacher: boolean, screenShareEnabled: boolean, screenShareDisabledByTeacher: boolean) => {
		try {
			const pc = new RTCPeerConnection(pc_config);

			pc.onicecandidate = (e) => {
				if (socketRef.current && e.candidate) {
					console.log('[화면공유 컴포넌트] onicecandidate');
					socketRef.current.emit('candidate', {
						candidate: e.candidate,
						candidateSendID: socketRef.current.id,
						candidateReceiveID: socketID,
					});
				}
			};

			pc.oniceconnectionstatechange = (e) => {
				console.log("[화면공유 컴포넌트] iceConnectionStateChanged");
				console.log('[화면공유 컴포넌트] ' + e);
			};

			pc.ontrack = (e) => {
				setUsers((oldUsers) =>
					oldUsers
						// .filter((user) => user.id !== socketID)
						.filter((user) => user.email !== email)
						.concat({
							id: socketID,
							email: email,
							userRole: role,
							stream: e.streams[0],
							screenShareStream: e.streams[0],
							videoEnabled: videoEnabled,
							audioEnabled: audioEnabled,
							audioDisabledByTeacher: audioDisabledByTeacher,
							screenShareEnabled: screenShareEnabled,
							screenShareDisabledByTeacher: screenShareDisabledByTeacher
						}),
				);

			};

			if (localScreenShareStreamRef.current) {
				console.log('[화면공유 컴포넌트] localstream add');
				localScreenShareStreamRef.current.getTracks().forEach((track) => {
					if (localScreenShareStreamRef.current) {
						pc.addTrack(track, localScreenShareStreamRef.current);
					}
				});
			} else {
				console.log('[화면공유 컴포넌트] no local stream');
			}
			return pc;
		} catch (e) {
			console.error(e);
			return undefined;
		}
	}, []);

	useEffect(() => {
		socketRef.current = io.connect(SOCKET_SERVER_URL);
		getLocalStream();

		socketRef.current.on('all_users', (allUsers: Array<{ id: string; email: string; userRole: string; videoEnabled: boolean; audioEnabled: boolean; audioDisabledByTeacher: boolean; offerSendScreenShareEnabled: boolean; offerSendScreenShareDisabledByTeacher: boolean; }>) => {
			allUsers.forEach(async (user) => {
				if (!localScreenShareStreamRef.current) return;
				const pc = createPeerConnection(user.id, user.email, user.userRole, user.videoEnabled, user.audioEnabled, user.audioDisabledByTeacher, user.offerSendScreenShareEnabled, user.offerSendScreenShareDisabledByTeacher);
				if (pc && socketRef.current) {
					pcsRef.current = { ...pcsRef.current, [user.id]: pc };
					try {
						const localSdp = await pc.createOffer({
							offerToReceiveAudio: true,
							offerToReceiveVideo: true,
						});
						console.log('[화면공유 컴포넌트] create offer success');
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
				console.log('[화면공유 컴포넌트] get offer');
				if (!localScreenShareStreamRef.current) return;
				const pc = createPeerConnection(offerSendID, offerSendEmail, offerSendRole, offerSendVideoEnabled, offerSendAudioEnabled, offerSendAudioDisabledByTeacher, offerSendScreenShareEnabled, offerSendScreenShareDisabledByTeacher);
				if (pc && socketRef.current) {
					pcsRef.current = { ...pcsRef.current, [offerSendID]: pc };
					try {
						await pc.setRemoteDescription(new RTCSessionDescription(sdp));
						console.log('[화면공유 컴포넌트] answer set remote description success');
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
				console.log('[화면공유 컴포넌트] get answer');
				const pc: RTCPeerConnection = pcsRef.current[answerSendID];
				if (pc) {
					pc.setRemoteDescription(new RTCSessionDescription(sdp));
				}
			},
		);

		socketRef.current.on(
			'getCandidate',
			async (data: { candidate: RTCIceCandidateInit; candidateSendID: string }) => {
				console.log('[화면공유 컴포넌트] get candidate');
				const pc: RTCPeerConnection = pcsRef.current[data.candidateSendID];
				if (pc) {
					await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
					console.log('[화면공유 컴포넌트] candidate add success');
				}
			},
		);

		socketRef.current.on('user_exit', (data: { id: string }) => {
			console.log('[화면공유 컴포넌트] EXIT EXIT EXIT EXIT ');
			if (pcsRef.current[data.id]) {
				pcsRef.current[data.id].close();
				delete pcsRef.current[data.id];
				setUsers((oldUsers) => oldUsers.filter((user) => user.id !== data.id));
			}
		});

		socketRef.current.on('update_media', (data: { userId: string; videoEnabled: boolean; audioEnabled: boolean; audioDisabledByTeacher: boolean, screenShareEnabled: boolean, screenShareDisabledByTeacher: boolean }) => {
			console.log(`[화면공유 컴포넌트] Updating media for user ${data.userId}: videoEnabled=${data.videoEnabled}, audioEnabled=${data.audioEnabled}, audioDisabledByTeacher=${data.audioDisabledByTeacher}, 화면공유: ${data.screenShareEnabled}, 화면공유banned: ${data.screenShareDisabledByTeacher}`);
			setUsers((oldUsers) =>
				oldUsers.map((user) =>
					user.id === data.userId
						? { ...user, videoEnabled: data.videoEnabled, audioEnabled: data.audioEnabled, audioDisabledByTeacher: data.audioDisabledByTeacher, screenShareEnabled: data.screenShareEnabled, screenShareDisabledByTeacher: data.screenShareDisabledByTeacher}
						: user,
				),
			);
		});

		socketRef.current.on('update_allow_mic', (data: { userId: string; audioEnabled: boolean; audioDisabledByTeacher: boolean }) => {
			console.log(`[화면공유 컴포넌트] Updating media for user ${data.userId}: audioEnabled=${data.audioEnabled}, audioDisabledByTeacher=${data.audioDisabledByTeacher}`);
			setUsers((oldUsers) =>
				oldUsers.map((user) =>
					user.id === data.userId
						? { ...user, audioEnabled: data.audioEnabled, audioDisabledByTeacher: data.audioDisabledByTeacher }
						: user,
				),
			);
		});

		socketRef.current.on('toggle_student_screen_share', (data: { userId: string; userEmail: string; }) => {
			console.log(`[화면공유 컴포넌트] 선생님이 학생의 화면공유를 금지함. ${data.userId} (email: ${userEmail}) / 대조군: ${data.userEmail + '_screen'} `);
			if(userEmail === (data.userEmail + '_screen')){
				console.log('[화면공유 컴포넌트] Screen Share 중지당함');
				const videoTrack = localScreenShareStreamRef.current?.getVideoTracks()[0];

				if(videoTrack){
					videoTrack.stop();
					videoTrack.enabled = false;
				}
				toggleScreenShareFunc();

			}
			// const tmpUser = users.find((user1) => user1.email === data.userEmail + '_screen');

			// console.log(`tmpUser 유무: ${tmpUser ? '유' :'무'}`);
			// if()
			//
			// setUsers((oldUsers) =>
			// 	oldUsers.map((user) =>
			// 		user.email === data.userEmail + '_screen'
			// 			? { ...user, audioDisabledByTeacher: data.audioDisabledByTeacher }
			// 			: user,
			// 	),
			// );
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
			<p>학생 화면공유 화면</p>
			<video
				style={{
					width: 240,
					height: 135,
					margin: 5,
					backgroundColor: 'lightskyblue',
				}}
				muted
				ref={localScreenShareRef}
				autoPlay
			/>
		</div>
	);
};

export default WebrtcStudentScreenShare;
