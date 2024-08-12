import { useState } from 'react';
import WebrtcTeacher from "./WebrtcTeacher";
import WebrtcStudent from "./WebrtcStudent";

const Classroom = () => {
	const [page, setPage] = useState("gate");
	const [roomId, setRoomId] = useState("");
	const [userEmail, setUserEmail] = useState("");
	const [role, setRole] = useState("");

	const handleEnterClick = () => {
		if (role === "") {
			alert("Please choose a role.");
			return;
		}else if (role === "TEACHER"){
			setPage("WebrtcTeacher");
		}else if (role === "STUDENT"){
			setPage("WebrtcStudent");
		}
		console.log(roomId)
	};

	return (
		<div className='grid grid-cols-12'>
			<div className='col-span-1'></div>
		<div id="gate" className='col-span-10'>
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
				value={roomId}
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
			<button id="btn_enter" onClick={handleEnterClick}>Enter</button>
			{page === "WebrtcTeacher" && (
				<WebrtcTeacher roomId={roomId} userEmail={userEmail} userRole={role}/>
			)}
			{page === "WebrtcStudent" && (
				<WebrtcStudent roomId={roomId} userEmail={userEmail} userRole={role}/>
			)}
		</div>
<div className='col-span-1'></div>
		</div>
	);
};

export default Classroom;