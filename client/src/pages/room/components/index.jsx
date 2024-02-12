import React, { useState, useContext, useEffect } from "react";

import RemoteVideo from "./RemoteVideo";
import { UseUserMedia } from "../../../services/webrtc";
import { SocketContext } from "../../../context/socketConnection";
import {
  IoIosInformationCircleOutline,
  IoIosPaperPlane,
  IoIosMic,
  IoIosMicOff,
} from "react-icons/io";

import {
  BsFillCameraVideoOffFill,
  BsFillCameraVideoFill,
} from "react-icons/bs";

import { AiOutlineExpand } from "react-icons/ai";
import ChatBox from "./ChatBox";
import { LISTNERS, EMITTER } from "../../../enum/socket";
import { STATUS } from "../../../enum/userMsgStatus";

import { v4 as uuidv4 } from "uuid";
import Modals from "../../../components/mainModel/modals";
import {
  ZoomButton,
  IconButton,
} from "../../../components/buttons/iconButtons/button";

function VideoComponent() {
  const socket = useContext(SocketContext);
  const [path, setPath] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(`0`);
  let BASE = process.env.REACT_APP_BASE_URL_FRONTEND + "/room/";
  const [base, setBase] = useState(
    process.env.REACT_APP_BASE_URL_FRONTEND + "/room/"
  );

  const [msg, setMsg] = useState("");


  const [msgArr, setMsgArr] = useState([]);
  let { localMediaRef, socketID, users } = UseUserMedia();
 console.log(localMediaRef);
  // console.log(users,socketID, "index");
  const [isOpen, setIsOpen] = useState(false);
  
  const [mic, setMic] = useState(false);
  const [video,setVideo]=useState(false)
  const openMike = () => {
    if (mic) {
      setMic(false);
    } else {
      setMic(true);
    }
  };

  const openModal = () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };
  const openVideo=()=>{
    if(video){
      setVideo(false)
      return
    }
    setVideo(true)
  }

  const sendMessage = () => {
    let msgId = uuidv4();
    //  console.log(socketID);
    setMsgArr([
      ...msgArr,
      { message: msg, id: socketID, status: STATUS.SENDER, msgId: msgId },
    ]);

    socket.emit(EMITTER.SENDER_MSG, {
      message: msg,
      id: socketID,
      msgId: msgId,
    });

    setMsg("");
  };

  socket.on(LISTNERS.INCOMMING_MSG, (data) => {
    setMsgArr([
      ...msgArr,
      {
        message: data.message,
        id: data.id,
        msgId: data.msgId,
        status: STATUS.RECIEVER,
      },
    ]);
  });

  const [join, setJoin] = useState("");

  useEffect(() => {
    // console.log("useEffect");
    if (!!join) {
      // console.log("true");
      setMsgArr([...msgArr, { id: join, status: STATUS.JOIN }]);
    }
  }, [join]);

  socket.on(LISTNERS.NEW_USER, (data) => {
    // console.log(data, "new user");
    if (!!data) {
      setJoin(data);
    }

    // setMsgArr([...msgArr, { id: data, status: STATUS.JOIN }]);
  });
  socket.on(LISTNERS.EXIT_USER, (data) => {
    console.log("exit -user");
    setMsgArr([...msgArr, { id: data.id, status: STATUS.LEFT }]);
  });

  socket.on(LISTNERS.ROOM, (data) => {
    setPath(data);
    setBase(base + data);

    // BASE=BASE+data
  });

  const handleSelectVideo = (event) => {
    setSelectedVideo(event.target.id);
  };

  const selectedVideoString = selectedVideo.toString();
  const videoContainerClassName =
    selectedVideoString !== "0" ? "small" : "main_screen_video";

  return (
    <>
      <div className="video-page">
        <div className="chat_box">
          <div id="myList">
            {msgArr.map((user, index) => (
              <ChatBox data={user} key={index} />
            ))}
          </div>

          <div className="main_message_container">
            <input
              id="chat_message"
              type="text"
              autoComplete="off"
              value={msg}
              onChange={(event) => setMsg(event.target.value)}
              placeholder="Type message here..."
            />
            <IconButton onClick={sendMessage}>
              <IoIosPaperPlane className="plane_button" />
            </IconButton>
          </div>
        </div>
        
        
        <div id="video-bar">
          <div className={videoContainerClassName}>
            <video
              className={
                selectedVideoString !== "0" ? "remote-video-tag" : "video-tag"
              }
              id="0"
              ref={(instance) => localMediaRef(instance)}
              autoPlay
              onClick={handleSelectVideo}
            />
            {selectedVideoString !== "0" && (
              <>
                <ZoomButton id="0" handleSelectVideo={handleSelectVideo} />
                {/* 
                <IconButton  id="0" customClass={"zoom_button_class"} onClick={handleSelectVideo}>
                  <AiOutlineExpand className="zoom_button" />
                </IconButton> */}

                <p id="user_id">Local</p>
              </>
            )}
          </div>
          <div
            id="remote-video-container"
            className={selectedVideoString === "0" ? "local-selected" : ""}
          >
            {users.map((user, index) => (
              <RemoteVideo
                stream={user.stream}
                key={index}
                userId={user.id}
                videoId={index + 1}
                selectedVideo={selectedVideo}
                handleSelectVideo={handleSelectVideo}
              />
            ))}
          </div>
        </div>

        <IconButton customClass={"i_button_class"} onClick={openModal}>
          <IoIosInformationCircleOutline className="iconStyle" />
        </IconButton>
        {isOpen && (
          <>
            <Modals
              content={path}
              heading={"Metting Id"}
              right={"right"}
              closeCall={openModal}
            />
          </>
        )}
        <div className="buttons-bar">
          <IconButton customClass={"miceon_button_div"} onClick={openMike}>
            {mic === true ? (
              <IoIosMicOff className="mice_on" />
            ) : (
              <IoIosMic className="mice_on" />
            )}
          </IconButton>
          <IconButton customClass={"miceon_button_div"} onClick={openVideo}>
            {video === true ? (
              <BsFillCameraVideoOffFill className="mice_on" />
              ) : (
              <BsFillCameraVideoFill className="mice_on" />
            )}
          </IconButton>
       
          <button className="button">Share Screen</button>
        </div>
      </div>
    </>
  );
}
export default VideoComponent;
