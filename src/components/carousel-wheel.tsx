import {useEffect, useState, WheelEventHandler} from "react";
import {useThrottledCallback} from "use-debounce";
import {twMerge} from "tailwind-merge";

import {CarouselProps} from "./carousel-overflow.tsx";

export const CarouselWheel = ({images}: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll: WheelEventHandler<HTMLDivElement> = useThrottledCallback(event => {
    const target = event.target as HTMLImageElement;
    // Snap to the nearest image
    const currentIndex = images.findIndex(image => image === target.src);
    let nextIndex = currentIndex + Math.sign(event.deltaY);

    if (nextIndex < 0) {
      nextIndex = images.length - 1;
    }
    if (nextIndex >= images.length) {
      nextIndex = 0;
    }
    target.src = images[nextIndex];
    setCurrentIndex(nextIndex)
  }, 1000, {leading: true, trailing: false});

  const disableScroll = () => {
    document.body.style.overflow = "hidden";
  };

  const enableScroll = () => {
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    setCurrentIndex(0)
  }, [images]);

  return (
    <div>
      <div className="overflow-hidden">
        <div onMouseEnter={disableScroll} onMouseLeave={enableScroll} onWheel={handleScroll} className="flex flex-row">
          <img className="carousel-image" src={images[0]} alt="Image"/>
        </div>
      </div>
      <div className="flex flex-row gap-2 mt-4 justify-center">
        {images.map((_, index) => (
          <div key={index} className={twMerge("w-4 h-4 rounded-full bg-amber-200", index === currentIndex && "scale-125 bg-amber-400")} />
        ))}
      </div>
    </div>
  );
};
