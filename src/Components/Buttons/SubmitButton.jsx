const SubmitButton = ({
       width = "w-full",
       text,
       disabledBgColor = "bg-gray-400",
       bgColor = "bg-mainColor",
       Color = "text-white",
       Size = "text-2xl",
       px = "px-7",
       rounded = "rounded-xl",
       disabled = false,
}) => {
       return (
              <button
                     type="submit"
                     disabled={disabled}
                     className={`${disabled ? `${disabledBgColor} cursor-not-allowed` : bgColor} ${width} ${Color} ${Size} font-TextFontRegular ${rounded} pt-2 py-3 ${px}`}
              >
                     {text}
              </button>
       );
};

export default SubmitButton;
