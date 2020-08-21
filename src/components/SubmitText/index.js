import React, { useState } from "react";
import { validateUrl } from "../../utils/utils";

import TextInput from "./components/input";
import Button from "./components/button";

import "./style.css";

const SubmitText = (props) => {
  const { text, isDisabled, updateText, setOpenModalOver } = props;
  const [errorMsg, setErrorMsg] = useState("");

  const onChangeText = (url) => {
    const isValid = validateUrl(url);

    updateText(url);
    if (!isValid) {
      setErrorMsg("Invalid Url");
      return;
    }
    setErrorMsg("");
  };
  const onOpenModal = () => {
    setOpenModalOver(true);
  };

  return (
    <div className="input__wrap">
      <div>
        <TextInput
          onChangeText={onChangeText}
          value={text}
          isDisabled={isDisabled}
        />
        <Button
          isDisabled={text.length === 0 || errorMsg || isDisabled}
          onClickBtn={onOpenModal}
        />
      </div>
      <p>{errorMsg}</p>
    </div>
  );
};

export default SubmitText;
