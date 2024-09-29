import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
// import { setLanguage } from "../store/languageSlice";
// import { useTranslation } from "react-i18next";

const Header = () => {
  // const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  // const selectedLanguage = useSelector(
  //   (state) => state.language.selectedLanguage
  // );
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const handleLanguageChange = (event) => {
    // const selectedLanguage = event.target.value;
    setSelectedLanguage(selectedLanguage);
    // i18n.changeLanguage(selectedLanguage);
    // dispatch(setLanguage(selectedLanguage));
  };

  const handleSignOut = () => {
    dispatch(logout());
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center">
        <select
          value={selectedLanguage}
          onChange={handleLanguageChange}
          className="bg-gray-100 px-3 py-1 rounded-full mr-4"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          {/* Add more languages here */}
        </select>
        <button
          onClick={handleSignOut}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          {/* {t("sign_out")} */}
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Header;
