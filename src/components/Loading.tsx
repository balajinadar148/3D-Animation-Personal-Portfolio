import { useEffect, useState } from "react";
import "./styles/Loading.css";
import { useLoading } from "../context/LoadingProvider";

import Marquee from "react-fast-marquee";

function useProcessedLogo(src: string, theme: "light" | "dark" = "light"): string {
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


const Loading = ({ percent }: { percent: number }) => {
  const logoSrc = useProcessedLogo("/images/logo.png", "light");
  const { setIsLoading } = useLoading();
  const [loaded, setLoaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [clicked, setClicked] = useState(false);

  if (percent >= 100) {
    setTimeout(() => {
      setLoaded(true);
      setTimeout(() => {
        setIsLoaded(true);
      }, 1000);
    }, 600);
  }

  useEffect(() => {
    import("./utils/initialFX").then((module) => {
      if (isLoaded) {
        setClicked(true);
        setTimeout(() => {
          if (module.initialFX) {
            module.initialFX();
          }
          setIsLoading(false);
        }, 900);
      }
    });
  }, [isLoaded]);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const { currentTarget: target } = e;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
  }

  return (
    <>
      <div className="loading-header">
        <a href="/#" className="loader-title" data-cursor="disable">
          <img src={logoSrc} alt="BM Logo" className="loader-logo-img" />
        </a>

        <div className={`loaderGame ${clicked && "loader-out"}`}>
          <div className="loaderGame-container">
            <div className="loaderGame-in">
              {[...Array(27)].map((_, index) => (
                <div className="loaderGame-line" key={index}></div>
              ))}
            </div>
            <div className="loaderGame-ball"></div>
          </div>
        </div>
      </div>
      <div className="loading-screen">
        <div className="loading-marquee">
          <Marquee>
            <span> A Creative Developer</span> <span>A Creative Designer</span>
            <span> A Creative Developer</span> <span>A Creative Designer</span>
          </Marquee>
        </div>
        <div
          className={`loading-wrap ${clicked && "loading-clicked"}`}
          onMouseMove={(e) => handleMouseMove(e)}
        >
          <div className="loading-hover"></div>
          <div className={`loading-button ${loaded && "loading-complete"}`}>
            <div className="loading-container">
              <div className="loading-content">
                <div className="loading-content-in">
                  Loading <span>{percent}%</span>
                </div>
              </div>
              <div className="loading-box"></div>
            </div>
            <div className="loading-content2">
              <span>Welcome</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Loading;

export const setProgress = (setLoading: (value: number) => void) => {
  let percent: number = 0;

  let interval = setInterval(() => {
    if (percent <= 50) {
      let rand = Math.round(Math.random() * 5);
      percent = percent + rand;
      setLoading(percent);
    } else {
      clearInterval(interval);
      interval = setInterval(() => {
        percent = percent + Math.round(Math.random());
        setLoading(percent);
        if (percent > 91) {
          clearInterval(interval);
        }
      }, 2000);
    }
  }, 100);

  function clear() {
    clearInterval(interval);
    setLoading(100);
  }

  function loaded() {
    return new Promise<number>((resolve) => {
      clearInterval(interval);
      interval = setInterval(() => {
        if (percent < 100) {
          percent++;
          setLoading(percent);
        } else {
          resolve(percent);
          clearInterval(interval);
        }
      }, 2);
    });
  }
  return { loaded, percent, clear };
};
