import React from "react";

const Button = (props) => {
  const { isDisabled, btnLabel, onClickBtn } = props;
  return (
    <button disabled={isDisabled} onClick={onClickBtn}>
      {btnLabel}
    </button>
  );
};

export default Button;
