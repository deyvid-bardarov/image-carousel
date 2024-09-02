import {useEffect, useRef, useState} from "react";
import {twMerge} from "tailwind-merge";

export type CarouselProps = {
  images: string[]
}

export const CarouselOverflow = ({images}: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const backImageRef = useRef<HTMLImageElement>(null);
  const nextImageRef = useRef<HTMLImageElement>(null);
  const firstImageRef = useRef<HTMLImageElement>(null);
  const lastImageRef = useRef<HTMLImageElement>(null);

  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    firstImageRef.current?.scrollIntoView({behavior: "instant", block: "start"});

    if (nextImageRef.current === null || backImageRef.current === null) return;

    const nextIntersectionObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        firstImageRef.current?.scrollIntoView({behavior: "instant", block: "start"});
      }
    }, {root: carouselRef.current, threshold: 1});

    const backIntersectionObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        lastImageRef.current?.scrollIntoView({behavior: "instant", block: "start"});
      }
    }, {root: carouselRef.current, threshold: 1});

    nextIntersectionObserver.observe(nextImageRef.current);
    backIntersectionObserver.observe(backImageRef.current);

    return () => {
      nextIntersectionObserver.disconnect();
      backIntersectionObserver.disconnect();
    };
  }, []);

  return (
    <div ref={carouselRef}>
      <div className="carousel">
        <img ref={backImageRef} src={images[images.length - 1]} alt="back image"
             className="carousel-image snap-start"/>

        <img ref={firstImageRef} src={images[0]} alt="Image" className="carousel-image snap-start"/>

        {images.slice(1, -1).map((image, index) => (
          <img key={image} id={`image-${index}`} className="carousel-image snap-start" src={image} alt="Image"/>
        ))}

        <img ref={lastImageRef} src={images[images.length - 1]} alt="Image"
             className="carousel-image snap-start"/>

        <img ref={nextImageRef} src={images[0]} alt="back image" className="carousel-image snap-start"/>
      </div>
    </div>
  )
}