import { PropsWithChildren } from "react";
import "./styles/Landing.css";
import { portfolioData } from "../data/portfolioData";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
              {portfolioData.personal.firstName}
              <br />
              <span>{portfolioData.personal.lastName}</span>
            </h1>
          </div>
          <div className="landing-info">
            <h3>{portfolioData.personal.titlePrefix}</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">{portfolioData.personal.rolesGroup1[0]}</div>
              <div className="landing-h2-2">{portfolioData.personal.rolesGroup1[1]}</div>
            </h2>
            <h2>
              <div className="landing-h2-info">{portfolioData.personal.rolesGroup2[0]}</div>
              <div className="landing-h2-info-1">{portfolioData.personal.rolesGroup2[1]}</div>
            </h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
