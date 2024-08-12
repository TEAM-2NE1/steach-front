import React, { useEffect } from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, CardHeader, CardBody, Box } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchStudentRadarChartApi } from "../../api/user/userAPI";
import { StudentRadarChart } from "../../interface/profile/StudentProfileInterface";

const MyLecturePreference: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
  );

  const radarChartdata = useSelector(
    (state: RootState) => state.studentProfile.radarChart
  );

  const secondData: StudentRadarChart = {
    Korean: 0,
    Math: 0,
    Social: 0,
    Science: 0,
    Arts_And_Physical: 0,
    Engineering: 0,
    Foreign_language: 0,
  };

  const fetchSecondData = async () => {
    const response = await fetchStudentRadarChartApi();

    secondData.Korean = response.Korean;
    secondData.Math = response.Math;
    secondData.Social = response.Social;
    secondData.Science = response.Science;
    secondData.Arts_And_Physical = response.Arts_And_Physical;
    secondData.Engineering = response.Engineering;
    secondData.Foreign_language = response.Foreign_language;

    console.log(secondData);
  };

  useEffect(() => {
    fetchSecondData();
  }, []);

  const data = {
    labels: ["국어", "수학", "사회", "과학", "예체능", "공학", "외국어"],
    datasets: [
      {
        label: "수업 선호도",
        data: [
          secondData.Korean,
          secondData.Math,
          secondData.Social,
          secondData.Science,
          secondData.Arts_And_Physical,
          secondData.Engineering,
          secondData.Foreign_language,
        ],
        fill: true,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgb(255, 99, 132)",
        pointBackgroundColor: "rgb(255, 99, 132)",
        pointBorderColor: "#fff",
        pointRadius: 2,
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(255, 99, 132)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: {
        borderWidth: 1,
      },
    },
  };

  return (
    <Box className="h-full">
      <Card className="h-full">
        <CardHeader className="text-center">
          <h2 className="text-4xl font-semibold text-lightNavy">
            나의 수업 선호도
          </h2>
        </CardHeader>
        <CardBody className="flex justify-center items-center h-full">
          <Radar data={data} options={options} />
        </CardBody>
      </Card>
    </Box>
  );
};

export default MyLecturePreference;
