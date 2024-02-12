import React, { useEffect, useRef } from "react";

import { ZoomButton } from "../../../components/buttons/iconButtons/button";
import { IconButton } from "../../../components/buttons/iconButtons/button";
import { AiOutlineExpand } from "react-icons/ai";

const RemoteVideo = ({
  stream,
  handleSelectVideo,
  videoId,
  selectedVideo,
  userId,
}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.srcObject = stream;
    }
  }, [stream]);

  const isVideoSelected =
    selectedVideo.toString() === videoId.toString() && selectedVideo !== 0;

  return isVideoSelected ? (
    <div className="main_screen_video">
      <video className="video-tag" ref={ref} autoPlay />
    </div>
  ) : (
    <div className="remote-video">
      <video className="remote-video-tag" ref={ref} autoPlay />

      <ZoomButton id={videoId} handleSelectVideo={handleSelectVideo} />

      {/* <IconButton  id={videoId} customClass={"zoom_class"} onClick={handleSelectVideo}>
        <AiOutlineExpand className="zoom_button" />
      </IconButton> */}

      <p id="user_id">{userId}</p>
    </div>
  );
};

export default RemoteVideo;
