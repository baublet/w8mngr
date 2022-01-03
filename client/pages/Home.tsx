import React from "react";
import { Link } from "react-router-dom";

import { IsLoggedIn } from "../components/Auth/IsLoggedIn";
import { IsLoggedOut } from "../components/Auth/IsLoggedOut";
import { GhostInvertedButton } from "../components/Button/GhostInverted";
import { PrimaryButton } from "../components/Button/Primary";
import { ContentContainer } from "../components/Containers/ContentContainer";
import { HealthCircleIcon } from "../components/Icons/HealthCircle";
import { HeartIcon } from "../components/Icons/Heart";
import { Ping } from "../components/Ping";
import { SplashLogo } from "../components/SplashLogo";
import { PageHeading } from "../components/Type/PageHeading";

import { useWindowSize } from "../helpers";

export function Home() {
  const { ratio } = useWindowSize();
  const splashImage = React.useMemo(() => {
    if (
      isWithin({
        near: 0.1,
        subject: ratio,
        target: 1,
      })
    ) {
      // Square-ish
      return "https://res.cloudinary.com/baublet/image/upload/w_1000,ar_1:1,c_fill,g_auto/v1641231466/prod/splash.jpg";
    } else if (ratio > 1) {
      // Video-ish
      return "https://res.cloudinary.com/baublet/image/upload/v1641228333/prod/splash.jpg";
    } else {
      // Tall
      return "https://res.cloudinary.com/baublet/image/upload/e_improve,w_600,h_1200,c_fill,g_auto/v1641231466/prod/splash.jpg";
    }
  }, [ratio]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full h-full bg-gradient-to-r to-slate-500 from-slate-800 rounded-lg overflow-hidden">
        <img src={splashImage} className="opacity-30 grayscale w-full h-auto" />
        <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col gap-4 justify-around">
          <div className="text-slate-50 p-8 text-center self-center flex flex-col gap-4">
            <div className="flex flex-col gap-1 font-thin">
              <div className="text-2xl">Take control of your life</div>
              <div className="text-lg">one day at a time</div>
            </div>
            <IsLoggedIn>
              <div className="flex flex-col gap-2">
                <GhostInvertedButton
                  size="extra-large"
                  leftIcon={<HealthCircleIcon />}
                  to="/nutrition"
                  className="relative"
                >
                  <Ping size="3xl" color="secondary" />
                  Dashboard
                </GhostInvertedButton>
                <div className="text-base">
                  <span>Or, you can </span>
                  <Link
                    to="/logout"
                    className="font-bold underline-offset-4 hover:text-emerald-300 underline"
                  >
                    logout
                  </Link>
                </div>
              </div>
            </IsLoggedIn>
            <IsLoggedOut>
              <div className="flex flex-col gap-2">
                <GhostInvertedButton
                  size="extra-large"
                  leftIcon={<HealthCircleIcon />}
                  to="/register"
                  className="relative"
                >
                  <Ping size="3xl" color="secondary" />
                  Get Started
                </GhostInvertedButton>
                <div className="text-base">
                  <span>Or, you can </span>
                  <Link
                    to="/login"
                    className="font-bold underline-offset-4 hover:text-emerald-300 underline"
                  >
                    login
                  </Link>
                </div>
              </div>
            </IsLoggedOut>
          </div>
        </div>
      </div>
      <div className="what-is-it">
        <PageHeading
          icon={
            <span className="text-4xl">
              <HeartIcon />
            </span>
          }
        >
          What is it?
        </PageHeading>
        <ContentContainer>
          <b>w8mngr</b> (pronounced "weight manager") is a food, fitness, and health
          tracker to help you maintain a healthy lifestyle of your choosing.
        </ContentContainer>
      </div>
    </div>
  );
}

function isWithin({
  subject,
  near,
  target,
}: {
  subject: number;
  near: number;
  target: number;
}): boolean {
  const absoluteDifference = Math.abs(subject - target);
  return absoluteDifference <= near;
}
