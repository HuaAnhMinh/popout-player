import React, { useState } from "react";
import { validateUrl } from "../../utils/utils";
import "./style.css";

const Input = (props) => {
  const { url, setUrl, setIsOpenModal } = props;
  const [errorMsg, setErrorMsg] = useState("");

  const onChangeText = (url) => {
    const isValid = validateUrl(url);

    setUrl(url);
    if (!isValid) setErrorMsg("Invalid Url");
  };

  return (
    <div className="input__wrap">
      <div>
        <input
          placeholder="Youtube URL"
          onChange={(event) => onChangeText(event.target.value)}
          value={url}
        />
        <button disabled={errorMsg} onClick={() => setIsOpenModal(true)}>
          Play
        </button>
      </div>
      <p>{errorMsg}</p>
    </div>
  );
};

export default Input;
