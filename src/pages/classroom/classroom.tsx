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
		}else if (role === "teacher"){
			setPage("WebrtcTeacher");
		}else if (role === "student"){
			setPage("WebrtcStudent");
		}
	};

	return (
		<div id="gate">
			<select
				id="role_select"
				value={role}
				onChange={(e) => setRole(e.target.value)}
			>
				<option value="" disabled>Choose...</option>
				<option value="teacher">Teacher</option>
				<option value="student">Student</option>
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
	);
};

export default Classroom;
