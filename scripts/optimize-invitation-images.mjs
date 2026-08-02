import sharp from "sharp";

const images = [
  {
    input: "public/invitation-box-lid.png",
    output: "public/invitation-box-lid.webp",
    quality: 82,
  },
  {
    input: "public/satin-bow-v2.png",
    output: "public/satin-bow-v2.webp",
    quality: 84,
    width: 1100,
  },
  {
    input: "public/narayani-heights-venue.png",
    output: "public/narayani-heights-venue.webp",
    quality: 80,
  },
  {
    input: "public/pooja-blessings.png",
    output: "public/pooja-blessings.webp",
    quality: 85,
    width: 1000,
  },
  {
    input: "public/festive-floral-frame.webp",
    output: "public/festive-floral-frame-optimized.webp",
    quality: 82,
  },
  {
    input: "public/festive-floral-garland.webp",
    output: "public/festive-floral-garland-optimized.webp",
    quality: 82,
  },
];

for (const image of images) {
  let pipeline = sharp(image.input).rotate();
  if (image.width) {
    pipeline = pipeline.resize({ width: image.width, withoutEnlargement: true });
  }
  await pipeline
    .webp({
      quality: image.quality,
      alphaQuality: 100,
      effort: 6,
      smartSubsample: true,
    })
    .toFile(image.output);
}
