import { v4 as uuid } from "uuid";
import React, { useState, useEffect } from "react";
import { TextButton } from "../../components/buttons/textButtons/textButton";

function Home() {
  const [inputValue, setInputValue] = useState("");

  const openInNewTab = () => {
    const url = uuid();
    window.open(`room/${url}`, "_blank");
  };
  
  const openRoom = () => {
    if (inputValue === "" || inputValue.length < 36) {
      alert("enter metting id");
      return;
    }
    if (inputValue.length > 36) {
      window.open(inputValue, "_blank", "noreferrer");
    } else {
      window.open(`room/${inputValue}`, "_blank", "noreferrer");
    }
    setInputValue(" ");
  };
 
  return (
    <>
      <div className="join__meeing">
        <div className="room_button_section">
          <TextButton
            customClass={"create-room"}
            text={"Create Room"}
            onClick={openInNewTab}
          />
        </div>
      </div>

      <div className="container">
        <form>
          <div className="form-group">
            <input
              type="text"
              className="input_pass"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="Enter meeting Id"
            />
          </div>
          <TextButton
            customClass={"join-meet"}
            text={"Join"}
            onClick={openRoom}
          />
        </form>
      </div>
    </>
  );
}
export default Home;
