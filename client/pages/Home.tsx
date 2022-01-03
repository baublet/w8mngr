import React from "react";
import { ContentContainer } from "../components/Containers/ContentContainer";
import { SplashLogo } from "../components/SplashLogo";

export function Home() {
  return (
    <div>
      <ContentContainer className="p-0" fullFill>
        <div className="relative w-full h-full bg-gradient-to-r to-slate-700 from-slate-600">
          <img
            src="https://res.cloudinary.com/baublet/image/upload/v1641228333/prod/splash.jpg"
            className="opacity-30 grayscale"
          />
          <div className="aspect-square absolute top-0 left-0 max-w-md">
            <SplashLogo />
          </div>
        </div>
      </ContentContainer>
    </div>
  );
}
