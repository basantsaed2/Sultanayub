import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

const Switch = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  const isArabic = currentLang === 'ar';

  const handleToggle = () => {
    const newLang = isArabic ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <StyledWrapper isArabic={isArabic}>
      <label className="switch">
        <input type="checkbox" onChange={handleToggle} checked={isArabic} />
        <span className="slider" />
      </label>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .switch {
    position: relative;
    display: inline-block;
    width: 64px;
    height: 32px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #9D9D9D;
    transition: 0.4s;
    border-radius: 30px;
    border: 1px solid transparent;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    background-color: white;
    border-radius: 50%;
    top: 3px;
    left: ${(props) => (props.isArabic ? "4px" : "unset")};
    right: ${(props) => (props.isArabic ? "unset" : "4px")};
    transition: 0.4s;
  }

  input:checked + .slider:before {
    transform: ${(props) =>
      props.isArabic ? "translateX(32px)" : "translateX(-32px)"};
  }

  input:checked + .slider {
    background-color: #9e090f;
  }
`;

export default Switch;
