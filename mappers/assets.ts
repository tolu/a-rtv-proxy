export const mapAsset = (assetList: Asset[]) => {
  return assetList.map(a => {
    a.__mapped = true;
    return a;
  });
}

interface Asset {
  __mapped: boolean;
}