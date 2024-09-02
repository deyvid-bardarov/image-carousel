import {useEffect, useMemo, useState} from "react";

import {CarouselWheel} from "./components/carousel-wheel.tsx";
import {CarouselOverflow} from "./components/carousel-overflow.tsx";

type PicsumImage = {
  "id": string
  "author": string
  "width": number
  "height": number
  "url": string
  "download_url": string
}

function App() {
  const [selectedCarousel, setSelectedCarousel] = useState<"wheel" | "overflow">("wheel")
  const [usedImages, setUsedImages] = useState<"picsum" | "numbered">("numbered")

  const [picsumImages, setPicsumImages] = useState<string[]>([])
  const numberedImages = useMemo(() => Array.from({length: 10}).map(((_item, i) => `https://placehold.co/600x400?text=${i + 1}`)), [])

  const images = useMemo(() => {
    switch (usedImages) {
      case "picsum":
        return picsumImages
      case "numbered":
        return numberedImages
      default:
        return []
    }
  }, [usedImages, picsumImages, numberedImages])

  useEffect(() => {
    fetch("https://picsum.photos/v2/list?limit=10")
      .then(response => response.json())
      .then((data: PicsumImage[]) => setPicsumImages(data.map(image => image.download_url)))
  }, []);

  return (
    <div className="h-full flex flex-col justify-center items-center">
      <div className="flex flex-col gap-8 w-1/2">
        <h1 className="text-4xl font-bold text-white text-center">
          Welcome to Image Carousel
        </h1>

        <div className="flex flex-col gap-2">
          <label className="text-white" htmlFor="selectedCarousel">Which carousel to show?</label>
          <select id="selectedCarousel" onChange={e => setSelectedCarousel(e.target.value as typeof selectedCarousel)}
                  value={selectedCarousel}
                  className="rounded-md form-select">
            <option value="overflow">Overflow</option>
            <option value="wheel">Wheel</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-white" htmlFor="usedImages">Which types of images to use?</label>
          <select id="usedImages" onChange={e => setUsedImages(e.target.value as typeof usedImages)} value={usedImages}
                  className="rounded-md form-select">
            <option value="picsum">Picsum</option>
            <option value="numbered">Numbered</option>
          </select>
        </div>

        <div>
          {selectedCarousel === "overflow" && <CarouselOverflow images={images}/>}
        </div>
        {selectedCarousel === "wheel" && <CarouselWheel images={images}/>}
      </div>
    </div>
  )
}

export default App
