import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Stack,
  Text,
  Box,
  StackDivider,
} from "@chakra-ui/react";

const CareerRecommendation: React.FC = () => {
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
              <Text className="text-xl">
                김싸피 학생의 수업 선호도를 기반으로, AI가 화학공학과, 컴퓨터
                공학과, 전자 공학과 등을 추천했어요!
              </Text>
            </Box>
          </Stack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default CareerRecommendation;
