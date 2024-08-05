import React from "react";
import { Switch } from "antd";

interface SearchSwitchProps {
  handleOptionChange: (e: { target: { name: string; value: boolean } }) => void;
}

const SearchSwitch: React.FC<SearchSwitchProps> = ({ handleOptionChange }) => {
  const onChange = (checked: boolean) => {
    handleOptionChange({
      target: {
        name: "curriculum_category",
        value: checked,
      },
    });
    // 만약 체크가 true라면 그 즉시 수강 가능한 목록만 불러오기
  };
  return (
    <div className="flex items-center">
      <label htmlFor="Switch" className="mx-2">
        수강 가능 여부
      </label>
      <Switch onChange={onChange} />
    </div>
  );
};

export default SearchSwitch;
