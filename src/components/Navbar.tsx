import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { portfolioConfig } from "../data/config";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother: ScrollSmoother;

function useProcessedLogo(src: string, theme: "dark" | "light" = "dark"): string {
  const [processedSrc, setProcessedSrc] = useState<string>(src);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Find bounds of dark logo pixels
      let minX = canvas.width;
      let minY = canvas.height;
      let maxX = 0;
      let maxY = 0;
      let found = false;

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const idx = (y * canvas.width + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];

          if (r < 150 || g < 150 || b < 150) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
            found = true;
          }
        }
      }

      if (!found) {
        minX = 0;
        minY = 0;
        maxX = canvas.width;
        maxY = canvas.height;
      }

      const cropWidth = maxX - minX + 1;
      const cropHeight = maxY - minY + 1;

      const cropCanvas = document.createElement("canvas");
      cropCanvas.width = cropWidth;
      cropCanvas.height = cropHeight;
      const cropCtx = cropCanvas.getContext("2d");
      if (!cropCtx) return;

      const croppedData = ctx.getImageData(minX, minY, cropWidth, cropHeight);
      const cData = croppedData.data;

      // Make background transparent, style letters by theme
      for (let i = 0; i < cData.length; i += 4) {
        const r = cData[i];
        const g = cData[i + 1];
        const b = cData[i + 2];

        if (r > 150 && g > 150 && b > 150) {
          cData[i + 3] = 0; // Transparent
        } else {
          if (theme === "dark") {
            cData[i] = 230;     // R
            cData[i + 1] = 220; // G
            cData[i + 2] = 255; // B
          } else {
            cData[i] = 15;      // R
            cData[i + 1] = 8;   // G
            cData[i + 2] = 20;  // B
          }
          cData[i + 3] = 255; // A
        }
      }

      cropCtx.putImageData(croppedData, 0, 0);
      setProcessedSrc(cropCanvas.toDataURL());
    };
  }, [src, theme]);

  return processedSrc;
}



const Navbar = () => {
  const logoSrc = useProcessedLogo("/images/logo.png");

  useEffect(() => {
    smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.7,
      speed: 1.7,
      effects: true,
      autoResize: true,
      ignoreMobileResize: true,
    });

    smoother.scrollTop(0);
    smoother.paused(true);

    let links = document.querySelectorAll(".header ul a");
    links.forEach((elem) => {
      let element = elem as HTMLAnchorElement;
      element.addEventListener("click", (e) => {
        if (window.innerWidth > 1024) {
          e.preventDefault();
          let elem = e.currentTarget as HTMLAnchorElement;
          let section = elem.getAttribute("data-href");
          smoother.scrollTo(section, true, "top top");
        }
      });
    });
    window.addEventListener("resize", () => {
      ScrollSmoother.refresh(true);
    });
  }, []);
  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title" data-cursor="disable">
          <img src={logoSrc} alt="BM Logo" className="logo-img" />
        </a>
        <a
          href={`mailto:${portfolioConfig.profile.email}`}
          className="navbar-connect"
          data-cursor="disable"
        >
          {portfolioConfig.profile.email}
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;


