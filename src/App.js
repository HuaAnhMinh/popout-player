import React, { useState } from "react";
import "./App.css";

import SubmitText from "./components/SubmitText";
import VideoPlayer from "./components/VideoPlayer";

const App = () => {
  const [url, setUrl] = useState("https://www.youtube.com/watch?v=hMx3ijaf7f0");
  const [isOpenModal, setIsOpenModal] = useState(false);

  return (
    <div className="App">
      <SubmitText
        text={url}
        isDisabled={isOpenModal}
        placeholderTxt="Youtube Url"
        btnLabel="Play"
        updateText={setUrl}
        setOpenModalOver={setIsOpenModal}
      />
      {isOpenModal && <VideoPlayer url={url} setIsOpenModal={setIsOpenModal} />}
    </div>
  );
};

export default App;
