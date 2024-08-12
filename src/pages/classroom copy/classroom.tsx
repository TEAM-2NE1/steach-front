import { useEffect, useState } from 'react';
import WebrtcTeacher from "./WebrtcTeacher";
import WebrtcStudent from "./WebrtcStudent";
import { useParams } from 'react-router-dom';

const Classroom = () => {
	const [page, setPage] = useState("gate");
	const [roomId, setRoomId] = useState("");
	const [userEmail, setUserEmail] = useState("");
	const [role, setRole] = useState("");
	const [hidden, setHidden] = useState(0);
	const { lecture_id } = useParams<string>();

	useEffect(() => {
		const localStorageUserData = localStorage.getItem('auth')
		const userData = localStorageUserData ? JSON.parse(localStorageUserData) : null;
		console.log(userData)
		if (userData.email && lecture_id) {
			setRole(userData.role)
			setRoomId(lecture_id)
			setUserEmail(userData.email)
		}
	}, [])
	const handleEnterClick = () => {
		if (role === "") {
			alert("Please choose a role.");
			return;
		}else if (role === "TEACHER"){
			setPage("WebrtcTeacher");
			setHidden(1)
		}else if (role === "STUDENT"){
			setPage("WebrtcStudent");
			setHidden(1)
		}
	};

	return (
		<>
		<div>
			<div id="gate">
				<div className="hidden">
			<select
				id="role_select"
				value={role}
				onChange={(e) => setRole(e.target.value)}
				>
				<option value="" disabled>Choose...</option>
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
				<div className='flex items-center justify-center'>
				<button id="btn_enter" onClick={handleEnterClick} className={hidden === 1 ? 'hidden' : 'm-96 p-5 w-48 bg-red-200 rounded-md text-white font-bold hover:bg-red-300 whitespace-nowrap'}>강의실 입장하기</button>
				</div>
				<div className='flex'>
			{page === "WebrtcTeacher" && (
				<WebrtcTeacher roomId={roomId} userEmail={userEmail} userRole={role}/>
			)}
			{page === "WebrtcStudent" && (
				<WebrtcStudent roomId={roomId} userEmail={userEmail} userRole={role}/>
			)}
			</div>
			</div>
		</div>
			</>
	);
};

export default Classroom;