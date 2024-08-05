export type WebRTCUser = {
	id: string;
	email: string;
	userRole: string;
	stream: MediaStream;
	videoEnabled: boolean;
	audioEnabled: boolean;
	audioDisabledByTeacher: boolean;
};
