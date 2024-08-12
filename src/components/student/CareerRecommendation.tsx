import React, { useEffect, useState } from "react";
import { fetchStudentAICareerRecommendApi } from "../../api/user/userAPI";
import {
  Card,
  CardHeader,
  CardBody,
  Stack,
  Box,
  StackDivider,
} from "@chakra-ui/react";

const CareerRecommendation: React.FC = () => {
  // AI 진로추천 결과
  const [recommendResult, setRecommendResult] = useState<string | null>("");

  // 진로 추천 결과를 가져오는 함수
  const getRecommendResult = async () => {
    const result = await fetchStudentAICareerRecommendApi();

    setRecommendResult(result);
  };

  useEffect(() => {
    getRecommendResult();
  }, []);

  return (
    <Box className="h-full">
      <Card className="p-6 h-full">
        <CardHeader>
          <h2 className="text-4xl font-semibold text-center text-lightNavy">
            AI 진로추천
          </h2>
        </CardHeader>

        <CardBody className="flex justify-center items-center mt-4 h-full">
          <Stack divider={<StackDivider />} spacing="4">
            <Box>
              {recommendResult ? (
                <p className="text-xl">{recommendResult}</p>
              ) : (
                <p className="text-xl text-red-500">
                  강의를 수강하여야 결과를 볼 수 있습니다.
                </p>
              )}
            </Box>
          </Stack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default CareerRecommendation;
