import React, { useState, useEffect } from "react";
import { Modal, TimePicker } from "antd";
import { Button } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { getLectureDetail } from "../../../store/lectureSlice";
import { AppDispatch } from "../../../store";
import { RootState } from "../../../store";
import { PatchLecture } from "../../../interface/Curriculainterface";
import dayjs from "dayjs";

// props 인터페이스
interface TeacherMyLectureListModalProps {
  lectureId: number | undefined;
}

// 여기서 useEffect를 잘 이용하여 상태를 업데이트 하는 방식을 알아두면 좋다.
const TeacherMyLectureListModal: React.FC<TeacherMyLectureListModalProps> = ({
  lectureId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const format = "HH:mm";

  // 모달을 열자마자 강의 정보 호출
  useEffect(() => {
    if (lectureId) {
      dispatch(getLectureDetail(lectureId));
    }
  }, [lectureId, dispatch]);

  // 강의 상태 정보를 가져오기
  const lecture = useSelector((state: RootState) => state.lectures.lecture);

  // 모달 여닫는 상태
  const [isModalOpen, setIsModalOpen] = useState(false);

  // timePicker 및 lectureTitle 상태 초기화
  const [timePicker, setTimePicker] = useState<string | undefined>(undefined);
  const [lectureTitle, setLectureTitle] = useState<string | undefined>(
    undefined
  );

  // lecture가 업데이트될 때마다 timePicker와 lectureTitle 상태를 업데이트
  useEffect(() => {
    if (lecture) {
      setTimePicker(lecture.lecture_start_time.substring(11, 17));
      setLectureTitle(lecture.lecture_title);
    }
  }, [lecture]);

  const handleInputLectureTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLectureTitle(e.target.value);
  };

  // 모달을 열지 말지에 대한 함수
  const showModal = () => {
    setIsModalOpen(true);
  };

  // 수정하기 핸들러 함수
  const handleOk = () => {
    // const lectureData: PatchLecture = {
    //   lecture_title = lectureTitle,
    //   lecture_start_time = timePicker,
    // };

    setIsModalOpen(false);
  };

  // 취소하기 핸들러 함수
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button onClick={showModal}>강의 관리</Button>
      <Modal
        title={<h2 style={{ fontSize: "24px" }}>강의 정보 관리</h2>}
        okText={"수정하기"}
        cancelText={"취소"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div>
          <div>
            <h2 className="mt-4 text-xl">강의 제목</h2>
            <input
              type="text"
              className="my-2 p-2 border-2 rounded-md w-2/3"
              value={lectureTitle || ""}
              onChange={handleInputLectureTitle}
            />
          </div>
          <div>
            <h2 className="mt-4 text-xl">강의 시간</h2>
            <TimePicker
              value={timePicker ? dayjs(timePicker, format) : undefined}
              format={format}
              onChange={(time, timeString) => setTimePicker(timeString)}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TeacherMyLectureListModal;
