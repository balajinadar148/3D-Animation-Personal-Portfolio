import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";
import { portfolioData } from "../data/portfolioData";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Email</h4>
            <p>
              <a href={`mailto:${portfolioData.contact.email}`} data-cursor="disable">
                {portfolioData.contact.email}
              </a>
            </p>
            <h4>Phone</h4>
            {portfolioData.contact.phones.map((phone, idx) => (
              <p key={idx}>
                <a href={`tel:${phone.replace(/\s+/g, "")}`} data-cursor="disable">
                  {phone}
                </a>
              </p>
            ))}
          </div>
          <div className="contact-box">
            <h4>Social</h4>
            {portfolioData.contact.github && (
              <a
                href={portfolioData.contact.github}
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
                className="contact-social"
              >
                Github <MdArrowOutward />
              </a>
            )}
            {portfolioData.contact.linkedin && (
              <a
                href={portfolioData.contact.linkedin}
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
                className="contact-social"
              >
                Linkedin <MdArrowOutward />
              </a>
            )}
            {portfolioData.contact.website && (
              <a
                href={portfolioData.contact.website}
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
                className="contact-social"
              >
                Website <MdArrowOutward />
              </a>
            )}
            {(portfolioData.contact as any).twitter && (
              <a
                href={(portfolioData.contact as any).twitter}
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
                className="contact-social"
              >
                Twitter <MdArrowOutward />
              </a>
            )}
            {(portfolioData.contact as any).instagram && (
              <a
                href={(portfolioData.contact as any).instagram}
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
                className="contact-social"
              >
                Instagram <MdArrowOutward />
              </a>
            )}
          </div>
          <div className="contact-box">
            <h2>
              Designed and Developed <br /> by <span>{portfolioData.personal.firstName} {portfolioData.personal.lastName}</span>
            </h2>
            <h5>
              <MdCopyright /> {portfolioData.contact.copyrightYear}
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
