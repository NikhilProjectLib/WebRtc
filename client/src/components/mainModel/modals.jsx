import React from "react";
import { IconButton } from "../buttons/iconButtons/button";
import { FaCopy } from "react-icons/fa";
import {RxCross1} from "react-icons/rx"

const Modals = ({ content, heading, left ,right,closeCall}) => {

  const handleCopyLink = () => {
    var divText = document.getElementById("modal_text").innerText;
     navigator.clipboard.writeText(divText);
    
   };
  return (
    <>
      <div className="modal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">{heading}

            <div className="close-button">
              <IconButton customClass={"custom-cross-class"} onClick={closeCall}>
                <RxCross1 className="cross_icon_style" />
               </IconButton>
              
            </div>
            </div>
            <div className="modal-body" id="modal_text">
              {content}
            </div>
            <div className="modal-footer">
              {!!right &&
                <IconButton customClass={"custom-copy-class"} onClick={handleCopyLink}>
                <FaCopy className="copy_button" />
               </IconButton>
              }
              {
                !!left && 
                <IconButton customClass={"custom-submit-class"} onClick={handleCopyLink}>
                <FaCopy className="copy_button" />
               </IconButton>
              }
              
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modals;
