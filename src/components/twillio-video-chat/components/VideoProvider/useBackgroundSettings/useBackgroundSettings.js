import { useEffect, useCallback } from "react";
import { SELECTED_BACKGROUND_SETTINGS_KEY } from "../../../constants";
import {
  GaussianBlurBackgroundProcessor,
  VirtualBackgroundProcessor,
  ImageFit,
  isSupported,
} from "@twilio/video-processors";
const Abstract = "/images/Abstract.jpg";
const AbstractThumb = "/videobackgroundthumbs/Abstract.jpg";
const BohoHome = "/images/BohoHome.jpg";
const BohoHomeThumb = "/videobackgroundthumbs/BohoHome.jpg";
const Bookshelf = "/images/Bookshelf.jpg";
const BookshelfThumb = "/videobackgroundthumbs/Bookshelf.jpg";
const CoffeeShop = "/images/CoffeeShop.jpg";
const CoffeeShopThumb = "/videobackgroundthumbs/CoffeeShop.jpg";
const Contemporary = "/images/Contemporary.jpg";
const ContemporaryThumb = "/videobackgroundthumbs/Contemporary.jpg";
const CozyHome = "/images/CozyHome.jpg";
const CozyHomeThumb = "/videobackgroundthumbs/CozyHome.jpg";
const Desert = "/images/Desert.jpg";
const DesertThumb = "/videobackgroundthumbs/Desert.jpg";
const Fishing = "/images/Fishing.jpg";
const FishingThumb = "/videobackgroundthumbs/Fishing.jpg";
const Flower = "/images/Flower.jpg";
const FlowerThumb = "/videobackgroundthumbs/Flower.jpg";
const Kitchen = "/images/Kitchen.jpg";
const KitchenThumb = "/videobackgroundthumbs/Kitchen.jpg";
const ModernHome = "/images/ModernHome.jpg";
const ModernHomeThumb = "/videobackgroundthumbs/ModernHome.jpg";
const Nature = "/images/Nature.jpg";
const NatureThumb = "/videobackgroundthumbs/Nature.jpg";
const Ocean = "/images/Ocean.jpg";
const OceanThumb = "/videobackgroundthumbs/Ocean.jpg";
const Patio = "/images/Patio.jpg";
const PatioThumb = "/videobackgroundthumbs/Patio.jpg";
const Plant = "/images/Plant.jpg";
const PlantThumb = "/videobackgroundthumbs/Plant.jpg";
const SanFrancisco = "/images/SanFrancisco.jpg";
const SanFranciscoThumb = "/videobackgroundthumbs/SanFrancisco.jpg";
import { useLocalStorageState } from "../../../hooks/useLocalStorageState/useLocalStorageState";

const imageNames = [
  "Abstract",
  "Boho Home",
  "Bookshelf",
  "Coffee Shop",
  "Contemporary",
  "Cozy Home",
  "Desert",
  "Fishing",
  "Flower",
  "Kitchen",
  "Modern Home",
  "Nature",
  "Ocean",
  "Patio",
  "Plant",
  "San Francisco",
];

const images = [
  AbstractThumb,
  BohoHomeThumb,
  BookshelfThumb,
  CoffeeShopThumb,
  ContemporaryThumb,
  CozyHomeThumb,
  DesertThumb,
  FishingThumb,
  FlowerThumb,
  KitchenThumb,
  ModernHomeThumb,
  NatureThumb,
  OceanThumb,
  PatioThumb,
  PlantThumb,
  SanFranciscoThumb,
];

const rawImagePaths = [
  Abstract,
  BohoHome,
  Bookshelf,
  CoffeeShop,
  Contemporary,
  CozyHome,
  Desert,
  Fishing,
  Flower,
  Kitchen,
  ModernHome,
  Nature,
  Ocean,
  Patio,
  Plant,
  SanFrancisco,
];

let imageElements = new Map();

const getImage = (index) => {
  return new Promise((resolve, reject) => {
    if (imageElements.has(index)) {
      return resolve(imageElements.get(index));
    }
    const img = new Image();
    img.onload = () => {
      imageElements.set(index, img);
      resolve(img);
    };
    img.onerror = reject;
    img.src = rawImagePaths[index];
  });
};

export const backgroundConfig = {
  imageNames,
  images,
};

const virtualBackgroundAssets = "/virtualbackground";
let blurProcessor;
let virtualBackgroundProcessor;

export default function useBackgroundSettings(videoTrack, room) {
  const [backgroundSettings, setBackgroundSettings] = useLocalStorageState(
    SELECTED_BACKGROUND_SETTINGS_KEY,
    {
      type: "none",
      index: 0,
    }
  );

  const removeProcessor = useCallback(() => {
    if (videoTrack && videoTrack.processor) {
      videoTrack.removeProcessor(videoTrack.processor);
    }
  }, [videoTrack]);

  const addProcessor = useCallback(
    (processor) => {
      if (!videoTrack || videoTrack.processor === processor) {
        return;
      }
      removeProcessor();
      videoTrack.addProcessor(processor);
    },
    [videoTrack, removeProcessor]
  );

  useEffect(() => {
    if (!isSupported) {
      return;
    }
    // make sure localParticipant has joined room before applying video processors
    // this ensures that the video processors are not applied on the LocalVideoPreview
    const handleProcessorChange = async () => {
      if (!blurProcessor) {
        blurProcessor = new GaussianBlurBackgroundProcessor({
          assetsPath: virtualBackgroundAssets,
        });
        await blurProcessor.loadModel();
      }
      if (!virtualBackgroundProcessor) {
        virtualBackgroundProcessor = new VirtualBackgroundProcessor({
          assetsPath: virtualBackgroundAssets,
          backgroundImage: await getImage(0),
          fitType: ImageFit.Cover,
        });
        await virtualBackgroundProcessor.loadModel();
      }
      if (!room?.localParticipant) {
        return;
      }

      if (backgroundSettings.type === "blur") {
        addProcessor(blurProcessor);
      } else if (
        backgroundSettings.type === "image" &&
        typeof backgroundSettings.index === "number"
      ) {
        virtualBackgroundProcessor.backgroundImage = await getImage(
          backgroundSettings.index
        );
        addProcessor(virtualBackgroundProcessor);
      } else {
        removeProcessor();
      }
    };
    handleProcessorChange();
  }, [backgroundSettings, videoTrack, room, addProcessor, removeProcessor]);

  return [backgroundSettings, setBackgroundSettings];
}
