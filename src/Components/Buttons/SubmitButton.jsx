
const SubmitButton = ({ width = 'w-full', text, disabledBgColor = "bg-gray-400", bgColor = "bg-mainColor", Color = "text-white", Size = "text-2xl", px = "px-7", rounded = "rounded-xl", handleClick , disabled = false  }) => {
       return (
              <button
                     type='submit'
                     className={`${disabled ? `${disabledBgColor} cursor-not-allowed` : bgColor} ${bgColor} ${width} ${Color} ${Size} font-TextFontRegular ${rounded} pt-2 py-3 ${px}`}
                     onClick={handleClick} disabled={disabled}>
                     {text}
                     
              </button>
       );
};
export default SubmitButton;