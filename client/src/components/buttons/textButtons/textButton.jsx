export const TextButton = ({text,divClass,customClass,onClick}) => {
  return (
    <div className={divClass}>
        
      <button className={customClass} role="link" onClick={onClick}>
        {text}
      </button>
    </div>
    
  );
};
