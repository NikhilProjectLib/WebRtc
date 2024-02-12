import { AiOutlineExpand } from "react-icons/ai";

import React from "react";




export const ZoomButton=({id,handleSelectVideo})=>{
  return (
    <>
    <AiOutlineExpand id={id} className="zoom_button"  onClick={handleSelectVideo}/>
    </>
  )
}





export const IconButton = ({ videoId,onClick, customClass, children }) => {

  return (
    <button  videoid={videoId} className={customClass} onClick={onClick}>
      {children}
    </button>
  );
};

