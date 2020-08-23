import React from "react";

const TextInput = (props) => {
  const { value, isDisabled, placeholderTxt, onChangeText } = props;
  return (
    <input
      placeholder={placeholderTxt}
      onChange={(event) => onChangeText(event.target.value)}
      value={value}
      disabled={isDisabled}
    />
  );
};

export default TextInput;
