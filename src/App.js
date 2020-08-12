import React, { useEffect, useState } from "react";
import "./App.css";

import InputUrl from "./components/InputUrl";
import VideoPlayer from "./components/VideoPlayer";

const App = () => {
  const [url, setUrl] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);

  return (
    <div className="App">
      <InputUrl url={url} setUrl={setUrl} setIsOpenModal={setIsOpenModal} />
      {isOpenModal && <VideoPlayer />}
    </div>
  );
};

export default App;
