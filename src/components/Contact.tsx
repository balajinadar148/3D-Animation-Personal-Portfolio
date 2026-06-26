import { MdArrowOutward, MdCopyright } from "react-icons/md";
import { portfolioConfig } from "../data/config";
import "./styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Email</h4>
            <p>
              <a href={`mailto:${portfolioConfig.profile.email}`} data-cursor="disable">
                {portfolioConfig.profile.email}
              </a>
            </p>
            <h4>Phone</h4>
            <p>
              <a href="tel:7868964364" data-cursor="disable">
                7868964364
              </a>
              {" / "}
              <a href="tel:9168188997" data-cursor="disable">
                9168188997
              </a>
            </p>
          </div>
          <div className="contact-box">
            <h4>Social</h4>
            <a
              href={portfolioConfig.profile.socials.github}
              target="_blank"
              data-cursor="disable"
              className="contact-social"
            >
              Github <MdArrowOutward />
            </a>
            <a
              href={portfolioConfig.profile.socials.linkedin}
              target="_blank"
              data-cursor="disable"
              className="contact-social"
            >
              Linkedin <MdArrowOutward />
            </a>
            <a
              href={portfolioConfig.profile.socials.website}
              target="_blank"
              data-cursor="disable"
              className="contact-social"
            >
              Website <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box">
            <h2>
              Designed and Developed <br /> by <span>{portfolioConfig.profile.firstName} {portfolioConfig.profile.lastName}</span>
            </h2>
            <h5>
              <MdCopyright /> {new Date().getFullYear()}
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

