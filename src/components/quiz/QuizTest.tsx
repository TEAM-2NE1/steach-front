// import React, { useState } from "react";
// import FloatingEmoji from "./FloatingEmoji.tsx";
// // import QuizListComponent from "./QuizListComponent.tsx";

// const QuizTest: React.FC = () => {
//   const [timer, setTimer] = useState<number>(3); // Initialize timer with a default value of 3

//   const handleTimerChange = (time: number) => {
//     setTimer(time);
//   };

//   const times = [3, 4, 5, 6, 7]; // Array of times for the buttons

//   return (
//     <div className="grid grid-cols-12 bg-white">
//       <div className="col-span-1"></div>
//       <h1>진짜판</h1>
//       <div className="col-span-10">
//         <QuizListComponent/>
//       </div>
//       <div className="col-span-1"></div>
//       <h1>체험판 - 타이머: {timer}초</h1> {/* Display the current timer */}
//       <div className="flex justify-around p-4 space-x-4"> {/* Added space-x-4 for spacing */}
//         {times.map((time) => (
//           <button
//             key={time}
//             className="px-7 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
//             onClick={() => handleTimerChange(time)}
//           >
//             {time}초
//           </button>
//         ))}
//       </div>
//       <div className="col-span-10">
//         {/* <QuizListComponent
//           trialVersion={true}
//           {...(true ? { trialTimer: timer } : {})} // trialTimer is included only when trialVersion is true
//         /> */}
//       </div>
//       <FloatingEmoji />
//     </div>
//   );
// };

// export default QuizTest;
