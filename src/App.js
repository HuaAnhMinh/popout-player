import React, { useState } from "react";
import "./App.css";

import InputUrl from "./components/InputUrl";
import VideoPlayer from "./components/VideoPlayer";

const App = () => {
  const [url, setUrl] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);

  return (
    <div className="App">
      <InputUrl
        url={url}
        isOpenModal={isOpenModal}
        setUrl={setUrl}
        setIsOpenModal={setIsOpenModal}
      />
      {isOpenModal && <VideoPlayer url={url} setIsOpenModal={setIsOpenModal} />}
    </div>
  );
};

export default App;
