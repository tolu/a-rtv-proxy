import type { ApiAsset } from '../types/ApiAsset.ts';
import { IMAGE_VARIANTS } from '../utils/config.ts';
import type { Image } from '../types/MappedAsset.ts';

/**
 * Maps asset's `imagePackUri` to array of images with predefined widths,
 * Selects proper image `location` based on `isSeries`
 * Falls back to Channel image when no asset image is available
 */
export const mapImage = (asset: ApiAsset, isSeries = false): Image[] => {
  if (asset.imagePackUri) {
    return IMAGE_VARIANTS.map(
      getImageSizeMapper(
        asset.imagePackUri,
        isSeries ? 'series-main' : '',
      ),
    );
  }
  return [{
    width: 800,
    url: asset.originChannel._links.placeholderImage.href,
  }];
};

const getImageSizeMapper = (
  image: string,
  location: '' | 'series-main' = '',
) => {
  const url = new URL(image);
  return (width: number) => {
    url.searchParams.set('width', width.toString());
    url.searchParams.delete('location');
    location && url.searchParams.set('location', location);
    return {
      width,
      url: url.toString(),
    };
  };
};
