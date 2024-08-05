import { useEffect, useRef } from 'react';
import styled from 'styled-components';

const Container = styled.div`
	position: relative;
	display: inline-block;
	width: 240px;
	height: 300px;
	margin: 5px;
`;

const VideoContainer = styled.video`
	width: 240px;
	height: 240px;
	background-color: black;
`;

const UserLabel = styled.p`
	//position: absolute;
	top: 240px;
	left: 0;
	width: 100%;
	text-align: left;
	margin: 0;
	padding: 2px;
`;

const UserRoleLabel = styled.p`
	//position: absolute;
	top: 255px;
	left: 0;
	width: 100%;
	text-align: left;
	margin: 0;
	padding: 2px;
`;

const Indicator = styled.p`
	//position: absolute;
	top: 270px;
	left: 0;
	width: 100%;
	text-align: left;
	margin: 0;
	padding: 2px;
`;

interface Props {
	email: string;
	userRole: string;
	stream: MediaStream;
	videoEnabled: boolean;
	audioEnabled: boolean;
	audioDisabledByTeacher?: boolean;
	muted?: boolean;
}

const WebRTCVideo = ({ email, userRole, stream, videoEnabled, audioEnabled, audioDisabledByTeacher, muted }: Props) => {
	const ref = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		if (ref.current) ref.current.srcObject = stream;
	}, [stream]);

	return (
		<Container>
			<VideoContainer ref={ref} muted={muted} autoPlay />
			<UserLabel>{email}</UserLabel>
			<UserRoleLabel>{userRole}</UserRoleLabel>
			<Indicator>Video: {videoEnabled ? 'On' : 'Off'}</Indicator>
			<Indicator>Audio: {audioEnabled && !audioDisabledByTeacher ? 'On' : 'Off'}</Indicator>
			<Indicator>Teacher Allowed: {audioDisabledByTeacher ? 'No' : 'Yes'}</Indicator>
		</Container>
	);
};

export default WebRTCVideo;
