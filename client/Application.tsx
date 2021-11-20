import React from "react";
import { Link } from "react-router-dom";

import { ContentContainer } from "./components/Containers/ContentContainer";
import { HeartIcon } from "./components/Icons/Heart";
import { Routes } from "./Routes";
import { HeaderNavigation } from "./components/Navigation/HeaderNavigation";

export function Application(): React.ReactComponentElement<any> {
  return (
    <div className="max-w-screen-xl w-full flex flex-col min-h-full px-8">
      <div className="min-h-screen">
        <header className="my-8 flex items-center">
          <h1 className="text-center text-secondary text-5xl mr-8">
            <Link to="/" title="w8mngr" className="block">
              <HeartIcon />
            </Link>
          </h1>
          <HeaderNavigation />
        </header>
        <main className="flex-grow flex-1 flex-col">
          <Routes />
        </main>
      </div>
      <footer className="bg-primary text-primaryText mt-13 py-8 min-h-screen flex items-center">
        <ContentContainer>Footer</ContentContainer>
      </footer>
    </div>
  );
}
