import React from "react";
import { Select, Space } from "antd";

interface SearchCategoryMenuProps {
  handleOptionChange: (e: { target: { name: string; value: string } }) => void;
}

const SearchCategoryMenu: React.FC<SearchCategoryMenuProps> = ({
  handleOptionChange,
}) => {
  const handleChange = (value: string) => {
    handleOptionChange({
      target: {
        name: "curriculum_category",
        value,
      },
    });
  };
  return (
    <div>
      <Space wrap>
        <Select
          defaultValue=""
          style={{ width: 120 }}
          onChange={handleChange}
          options={[
            { value: "KOREAN", label: "국어" },
            { value: "MATH", label: "수학" },
            { value: "SOCIAL", label: "사회" },
            { value: "SCIENCE", label: "과학" },
            { value: "FOREIGN_LANGUAGE", label: "외국어" },
            { value: "ENGINEERING", label: "공학" },
            { value: "ARTS_AND_PHYSICAL", label: "예체능" },
            { value: "ETC", label: "기타" },
          ]}
        />
      </Space>
    </div>
  );
};

export default SearchCategoryMenu;
