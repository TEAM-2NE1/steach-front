import React from "react";
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

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const data = {
  labels: ["국어", "수학", "사회", "과학", "예체능", "공학", "외국어"],
  datasets: [
    {
      label: "My First Dataset",
      data: [65, 59, 90, 81, 56, 55, 40],
      fill: true,
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgb(255, 99, 132)",
      pointBackgroundColor: "rgb(255, 99, 132)",
      pointBorderColor: "#fff",
      pointRadius: 2,
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgb(255, 99, 132)",
    },
    {
      label: "My Second Dataset",
      data: [28, 48, 40, 19, 96, 27, 100],
      fill: true,
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: "rgb(54, 162, 235)",
      pointBackgroundColor: "rgb(54, 162, 235)",
      pointBorderColor: "#fff",
      pointRadius: 2,
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgb(54, 162, 235)",
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

const MyLecturePreference: React.FC = () => {
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
