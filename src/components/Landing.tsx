import { PropsWithChildren } from "react";
import { portfolioConfig } from "../data/config";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
              {portfolioConfig.profile.firstName}
              <br />
              <span>{portfolioConfig.profile.lastName}</span>
            </h1>
          </div>
          <div className="landing-info">
            <h3>A Creative</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">Web</div>
              <div className="landing-h2-2">Cloud</div>
            </h2>
            <h2>
              <div className="landing-h2-info">Developer</div>
              <div className="landing-h2-info-1">Developer</div>
            </h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
