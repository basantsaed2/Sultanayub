import React from 'react'

const CategoryIcon = ({ isActive }) => {
       return (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <g clipPath="url(#clip0_287_269)">
                            <path d="M8.18308 10.3234H2.38605C1.7991 10.3229 1.23633 10.0895 0.821234 9.67454C0.406134 9.25957 0.172601 8.69688 0.171875 8.10993V2.3849C0.172601 1.79795 0.406134 1.23526 0.821234 0.820292C1.23633 0.40532 1.7991 0.171962 2.38605 0.171417H8.18308C8.76991 0.172143 9.33249 0.405582 9.74745 0.820534C10.1624 1.23549 10.3958 1.79807 10.3966 2.3849V8.10993C10.3958 8.69676 10.1624 9.25935 9.74745 9.6743C9.33249 10.0893 8.76991 10.3227 8.18308 10.3234ZM2.38605 1.8857C2.25364 1.88588 2.1267 1.93851 2.03302 2.03207C1.93933 2.12563 1.88652 2.2525 1.88616 2.3849V8.10993C1.88652 8.24233 1.93933 8.3692 2.03302 8.46276C2.1267 8.55632 2.25364 8.60895 2.38605 8.60913H8.18308C8.31542 8.60895 8.44228 8.5563 8.53586 8.46272C8.62944 8.36914 8.68209 8.24227 8.68228 8.10993V2.3849C8.68209 2.25256 8.62944 2.12569 8.53586 2.03212C8.44228 1.93854 8.31542 1.88588 8.18308 1.8857H2.38605Z" fill={isActive ? "#9E090F" : "white"} />
                            <path d="M8.21042 23.8286H2.41339C1.82638 23.8278 1.26362 23.5943 0.848536 23.1793C0.433456 22.7642 0.199945 22.2014 0.199219 21.6144V15.8901C0.199945 15.3031 0.433478 14.7404 0.848578 14.3254C1.26368 13.9105 1.82644 13.6771 2.41339 13.6766H8.21042C8.79701 13.6777 9.35925 13.9113 9.7739 14.3262C10.1886 14.7411 10.4218 15.3035 10.4225 15.8901V21.6144C10.422 22.2011 10.1888 22.7637 9.77414 23.1787C9.35947 23.5938 8.79713 23.8275 8.21042 23.8286ZM2.41339 15.3909C2.28099 15.391 2.15405 15.4437 2.06036 15.5372C1.96667 15.6308 1.91387 15.7577 1.9135 15.8901V21.6144C1.91369 21.7469 1.96641 21.874 2.06012 21.9677C2.15383 22.0614 2.28087 22.1141 2.41339 22.1143H8.21042C8.34282 22.1139 8.46969 22.0611 8.56325 21.9674C8.65681 21.8737 8.70944 21.7468 8.70962 21.6144V15.8901C8.70944 15.7577 8.65679 15.6309 8.56321 15.5373C8.46963 15.4437 8.34276 15.391 8.21042 15.3909H2.41339Z" fill={isActive ? "#9E090F" : "white"} />
                            <path d="M21.6147 23.8286H15.8177C15.2307 23.8278 14.6679 23.5943 14.2528 23.1793C13.8378 22.7642 13.6042 22.2014 13.6035 21.6144V15.8901C13.6042 15.3031 13.8378 14.7404 14.2529 14.3254C14.668 13.9105 15.2307 13.6771 15.8177 13.6766H21.6147C22.2015 13.6773 22.7641 13.9107 23.1791 14.3257C23.594 14.7406 23.8275 15.3032 23.8282 15.8901V21.6144C23.8277 22.2014 23.5943 22.7641 23.1793 23.1792C22.7644 23.5943 22.2017 23.8278 21.6147 23.8286ZM15.8177 15.3943C15.6853 15.3945 15.5583 15.4471 15.4647 15.5407C15.371 15.6342 15.3182 15.7611 15.3178 15.8935V21.6178C15.318 21.7504 15.3707 21.8774 15.4644 21.9711C15.5581 22.0648 15.6852 22.1175 15.8177 22.1177H21.6147C21.7471 22.1174 21.874 22.0646 21.9675 21.9709C22.0611 21.8772 22.1137 21.7502 22.1139 21.6178V15.8901C22.1137 15.7577 22.0611 15.6309 21.9675 15.5373C21.8739 15.4437 21.7471 15.391 21.6147 15.3909L15.8177 15.3943Z" fill={isActive ? "#9E090F" : "white"} />
                            <path d="M18.7202 10.3234C17.7182 10.316 16.7409 10.0121 15.9114 9.44998C15.0819 8.8879 14.4374 8.09283 14.0591 7.16499C13.6808 6.23715 13.5857 5.21809 13.7857 4.23628C13.9858 3.25446 14.472 2.35384 15.1831 1.64795C15.8943 0.94207 16.7985 0.462523 17.7817 0.269768C18.765 0.077013 19.7833 0.179679 20.7083 0.564823C21.6333 0.949967 22.4236 1.60035 22.9795 2.43397C23.5355 3.2676 23.8321 4.24715 23.8322 5.24914C23.8255 6.59939 23.2835 7.89186 22.3252 8.84311C21.3669 9.79435 20.0704 10.3267 18.7202 10.3234ZM18.7202 1.88914C18.0573 1.89658 17.4114 2.09994 16.8638 2.47364C16.3163 2.84734 15.8915 3.37466 15.643 3.98924C15.3944 4.60382 15.3332 5.27818 15.4671 5.92745C15.601 6.57672 15.9239 7.17189 16.3953 7.63802C16.8667 8.10416 17.4654 8.42045 18.1161 8.54707C18.7669 8.67369 19.4405 8.60498 20.0523 8.3496C20.664 8.09422 21.1866 7.66358 21.5541 7.11187C21.9217 6.56017 22.1178 5.91207 22.1179 5.24914C22.1124 4.35283 21.7516 3.4953 21.1146 2.86473C20.4776 2.23415 19.6165 1.88206 18.7202 1.88571V1.88914Z" fill={isActive ? "#9E090F" : "white"} />
                     </g>
                     <defs>
                            <clipPath id="clip0_287_269">
                                   <rect width="24" height="24" fill="white" />
                            </clipPath>
                     </defs>
              </svg>

       )
}

export default CategoryIcon