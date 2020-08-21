import React from "react";

const TextInput = (props) => {
  const { onChangeText, value, isDisabled } = props;
  return (
    <input
      placeholder="Youtube URL"
      onChange={(event) => onChangeText(event.target.value)}
      value={value}
      disabled={isDisabled}
    />
  );
};

export default TextInput;
