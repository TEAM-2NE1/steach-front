import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Text,
} from "@chakra-ui/react";

const ProfileLectureHistory: React.FC = () => {
  return (
    <div className="mx-8 my-10 min-h-screen">
      <h1 className="my-4 text-4xl text-lightNavy font-bold">
        지난 강의 내역이에요!
      </h1>
      <Accordion className="shadow-lg" defaultIndex={[0]} allowMultiple>
        <AccordionItem className="rounded-lg">
          <h2>
            <AccordionButton className="bg-hardBeige hover:bg-darkerBeige">
              <Box as="span" flex="1" textAlign="left" className="p-2">
                <Text className="text-2xl">
                  [김호경의 Unity 정복하자 개발자의꿈] 1. 개발환경 세팅
                </Text>
                <Text className="text-base text-gray-600">
                  2024.07.17 17:00 ~ 2024.07.14 19:00
                </Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} className="p-3 bg-white">
            <div className="grid grid-cols-2">
              <div>
                <h2 className=" text-2xl">강의 참여도</h2>
                <text>dfdfdfffdf</text>
              </div>
              <div>
                <h2 className="text-2xl">퀴즈 통계</h2>
                <text>dfdfdfffdf</text>
              </div>
            </div>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton className="bg-hardBeige hover:bg-darkerBeige">
              <Box as="span" flex="1" textAlign="left" className="p-2">
                <Text className="text-2xl">
                  [김호경의 Unity 정복하자 개발자의꿈] 2. 유니티 핵심 개념
                </Text>
                <Text className="text-base text-gray-600">
                  2024.07.17 17:00 ~ 2024.07.14 19:00
                </Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} className="p-3 bg-white">
            <div className="grid grid-cols-2">
              <div>
                <h2 className=" text-2xl">강의 참여도</h2>
                <text>dfdfdfffdf</text>
              </div>
              <div>
                <h2 className="text-2xl">퀴즈 통계</h2>
                <text>dfdfdfffdf</text>
              </div>
            </div>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <h2>
            <AccordionButton className="bg-hardBeige hover:bg-darkerBeige">
              <Box as="span" flex="1" textAlign="left" className="p-2">
                <Text className="text-2xl">
                  [김호경의 Unity 정복하자 개발자의꿈] 3. 유니티 심화 개념
                </Text>
                <Text className="text-base text-gray-600">
                  2024.07.17 17:00 ~ 2024.07.14 19:00
                </Text>
              </Box>

              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} className="p-3 bg-white">
            <div className="grid grid-cols-2">
              <div>
                <h2 className=" text-2xl">강의 참여도</h2>
                <text>dfdfdfffdf</text>
              </div>
              <div>
                <h2 className="text-2xl">퀴즈 통계</h2>
                <text>dfdfdfffdf</text>
              </div>
            </div>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ProfileLectureHistory;
