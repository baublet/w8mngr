import React from "react";
import { Link } from "react-router-dom";

import { ContentContainer } from "./components/Containers/ContentContainer";
import { HeartIcon } from "./components/Icons/Heart";
import { Routes } from "./Routes";
import { HeaderNavigation } from "./components/Navigation/HeaderNavigation";

export function Application(): React.ReactComponentElement<any> {
  return (
    <div className="max-w-screen-xl w-full flex flex-col min-h-full px-8 bg-white">
      <header>
        <ContentContainer className="mt-4 pb-4 mb-4 flex items-center">
          <h1 className="text-center text-green-400 mr-4 pr-4 border-r border-gray-100">
            <Link to="/" title="w8mngr" className="flex items-center">
              <div className="text-5xl">
                <HeartIcon />
              </div>
              <div className="text-base ml-4 flex items-center">
                <b className="font-light text-green-700">w</b>
                <b className="text-purple-800 font-bold text-xl">8</b>
                <b className="font-light text-green-700">mngr</b>
              </div>
            </Link>
          </h1>
          <HeaderNavigation />
        </ContentContainer>
      </header>
      <main className="flex-grow flex-1 flex-col">
        <Routes />
      </main>
      <footer className="mt-12 text-gray-50 bg-green-600 mt-13 py-8 -mx-8 flex items-center">
        <ContentContainer>Footer</ContentContainer>
      </footer>
    </div>
  );
}
