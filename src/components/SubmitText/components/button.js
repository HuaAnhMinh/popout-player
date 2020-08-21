import React from "react";

const Button = (props) => {
  const { isDisabled, onClickBtn } = props;
  return (
    <button disabled={isDisabled} onClick={onClickBtn}>
      Play
    </button>
  );
};

export default Button;
