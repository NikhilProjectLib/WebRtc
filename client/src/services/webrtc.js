import { useEffect, useRef, useCallback, useContext } from "react";
import { useState } from "react";
import { SocketContext } from "../context/socketConnection";
import { PC_CONFIG } from "../enum/config";
import { LISTNERS, EMITTER } from "../enum/socket";

var constraints = {
  video:true,
  //  {
  //   frameRate: { max: 30 },
  // },
  audio: true,
};

let socketID;
let name = "";
let roomId;
var splitURL = window.location.pathname.toString().split("/");
let SOCKETID;

export function UseUserMedia() {
  const socket = useContext(SocketContext);
  const localStreamRef = useRef();
  const sendPCRef = useRef();
  const receivePCsRef = useRef({});
  const [users, setUsers] = useState([]);

  const localVideoRef = useRef(null);

  const closeReceivePC = (id) => {
    if (!receivePCsRef.current[id]) return;
    receivePCsRef.current[id].close();
    delete receivePCsRef.current[id];
  };

  const createReceiverOffer = async (pc, senderSocketID) => {
    try {
      const sdp = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await pc.setLocalDescription(new RTCSessionDescription(sdp));

      var splitURL = window.location.pathname.toString().split("/");

      if (!socket) return;
      socket.emit(EMITTER.RECEIVER_OFFER, {
        sdp,
        receiverSocketID: socket.id,
        senderSocketID,
        roomID: splitURL[2],
        name: name,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const createReceiverPeerConnection = (socketID) => {
    try {
      
      const pc = new RTCPeerConnection(PC_CONFIG);

      receivePCsRef.current = { ...receivePCsRef.current, [socketID]: pc };

      pc.onicecandidate = (e) => {
        if (!(e.candidate && socket)) return;

       
        socket.emit(EMITTER.RECEIVER_CANDIDATE, {
          candidate: e.candidate,
          receiverSocketID: SOCKETID,
          senderSocketID: socketID,
        });
      };

      pc.oniceconnectionstatechange = (e) => {};

      pc.ontrack = (e) => {
        setUsers((oldUsers) =>
          oldUsers
            .filter((user) => user.id !== socketID)
            .concat({
              id: socketID,
              stream: e.streams[0],
            })
        );
      };

      return pc;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  };

  const createReceivePC = (id) => {

    try {
    
      const pc = createReceiverPeerConnection(id);
      if (!(socket && pc)) return;
      createReceiverOffer(pc, id);
    } catch (error) {
      console.log(error);
    }
  };


  const createSenderOffer = async () => {
    try {
     
      if (!sendPCRef.current) return;
      const sdp = await sendPCRef.current.createOffer({
        offerToReceiveAudio: false,
        offerToReceiveVideo: false,
      });
      await sendPCRef.current.setLocalDescription(
        new RTCSessionDescription(sdp)
      );

      var splitURL = window.location.pathname.toString().split("/");

      if (!socket) return;

 

      socket.emit(EMITTER.SENDER_OFFER, {
        sdp,
        senderSocketID: SOCKETID,
        roomID: splitURL[2],
        name: name,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const createSenderPeerConnection =  async() => {
    // console.log("c1");
    const pc =  new  RTCPeerConnection(PC_CONFIG);
  
    pc.onicecandidate = (e) => {
      console.log("hello");
      if (!(e.candidate && socket)) return;

      socket.emit(EMITTER.SENDER_CANDIDATE, {
        
        candidate: e.candidate,
        senderSocketID: SOCKETID,
      });
    };

    pc.oniceconnectionstatechange = (e) => {};

    if (localStreamRef.current) {
      console.log("local");
      localStreamRef.current.getTracks().forEach((track) => {
        if (!localStreamRef.current) return;
        pc.addTrack(track, localStreamRef.current);
      });
    } else {
      console.log("no local stream");
    }
    
    sendPCRef.current = pc;
  };

  const getLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      // console.log(stream);
      
      localStreamRef.current = stream;
      // console.log(localStreamRef.current);
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      if (!socket) return;

      createSenderPeerConnection();

      await createSenderOffer();

      socketID = SOCKETID;
    } catch (e) {
      console.log(`getUserMedia error: ${e}`);
    }
  };

  useEffect(() => {
 
    socket.emit("join_room", splitURL[2]);

    socket.on("socket_id", (data) => {
      SOCKETID = data;
      getLocalStream();
    });
  }, [socket]);

  useEffect(() => {
    socket.on(LISTNERS.USER_ENTER, (data) => {
  
      createReceivePC(data.id);
    });

    socket.on(LISTNERS.ALL_USERS, (data) => {
   
      data.users.forEach((user) => createReceivePC(user.id));
    });

    socket.on(LISTNERS.EXIT_USER, (data) => {
    
      closeReceivePC(data.id);
      console.log(
        users.filter((user) => user.id !== data.id),
        "service"
      );

      setUsers((users) => users.filter((user) => user.id !== data.id));
    });

    socket.on(LISTNERS.GET_SENDER_ANSWER, async (data) => {
      try {
       if (!sendPCRef.current) return;
        await sendPCRef.current.setRemoteDescription(
          new RTCSessionDescription(data.sdp)
        );
      } catch (error) {
        console.log(error);
      }
    });

    socket.on(LISTNERS.GET_SENDER_CANDIDATE, async (data) => {
      try {
        
        if (!(data.candidate && sendPCRef.current)) return;
        await sendPCRef.current.addIceCandidate(
          new RTCIceCandidate(data.candidate)
        );
      } catch (error) {
        console.log(error);
      }
    });

    socket.on(LISTNERS.GET_RECEVIER_ANSWER, async (data) => {
      try {
       const pc = receivePCsRef.current[data.id];
        if (!pc) return;
        await pc.setRemoteDescription(data.sdp);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on(LISTNERS.GET_RECEVIER_CANDIDATE, async (data) => {
      try {
     
        const pc = receivePCsRef.current[data.id];
        if (!(pc && data.candidate)) return;
        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      } catch (error) {
        console.log(error);
      }
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
      if (sendPCRef.current) {
        sendPCRef.current.close();
      }
      users.forEach((user) => closeReceivePC(user.id));
    };
  }, [socket]);

  const localMediaRef = useCallback((node) => {
    localVideoRef.current = node;
  }, []);

  return { localMediaRef, socketID, users };
}
