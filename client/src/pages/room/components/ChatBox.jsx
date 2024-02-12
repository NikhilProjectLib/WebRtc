import { useEffect } from "react";
import { STATUS } from "../../../enum/userMsgStatus";

const ChatBox = ({ data }) => {
  useEffect(() => {
    document.getElementById(data.msgId)?.scrollIntoView(true);
  });

  const isJoinOrLeft = ["JOIN", "LEFT"].includes(data.status);
  return (
    <>
      <div className={`${STATUS[data.status]}`} id={data.msgId}>
        {!isJoinOrLeft && (
          <>
            <div className="user_by_id">{data.id}</div>
            <div className="user_message">
              <p className="text_message">{data.message}</p>
            </div>
          </>
        )}

        {isJoinOrLeft && (
          <p className="status_message" >
            {" "}
            {data.id} {data.status}{" "}
          </p>
        )}
      </div>
    </>
  );
};

export default ChatBox;
