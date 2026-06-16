export interface GameImages {
  land: HTMLImageElement;
  land_top: HTMLImageElement;
  land_top_1: HTMLImageElement;
  land_left: HTMLImageElement;
  land_left_1: HTMLImageElement;
  land_right: HTMLImageElement;
  land_right_1: HTMLImageElement;
  land_bottom: HTMLImageElement;
  land_bottom_1: HTMLImageElement;
  dust: HTMLImageElement;
  water: HTMLImageElement;
  rock: HTMLImageElement;
  rock1: HTMLImageElement;
  rock2: HTMLImageElement;
  castle: HTMLImageElement;
  tree: HTMLImageElement;
  tree1: HTMLImageElement;
  tree2: HTMLImageElement;
  p_left: HTMLImageElement;
  p_right: HTMLImageElement;
  p_front: HTMLImageElement;
  p_back: HTMLImageElement;
  bridge: HTMLImageElement;
  flag: HTMLImageElement;
  marker: HTMLImageElement;
  bush: HTMLImageElement;
  bush1: HTMLImageElement;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Could not load image: ${src}`));
    img.src = src;
  });
}

const imageSources = {
  land: new URL("./assets/land.png", import.meta.url).href,
  land_top: new URL("./assets/land_top.png", import.meta.url).href,
  land_top_1: new URL("./assets/land_top_1.png", import.meta.url).href,
  land_left: new URL("./assets/land_left.png", import.meta.url).href,
  land_left_1: new URL("./assets/land_left_1.png", import.meta.url).href,
  land_right: new URL("./assets/land_right.png", import.meta.url).href,
  land_right_1: new URL("./assets/land_right_1.png", import.meta.url).href,
  land_bottom: new URL("./assets/land_bottom.png", import.meta.url).href,
  land_bottom_1: new URL("./assets/land_bottom_1.png", import.meta.url).href,
  dust: new URL("./assets/dust.png", import.meta.url).href,
  water: new URL("./assets/water.png", import.meta.url).href,
  rock: new URL("./assets/rock.png", import.meta.url).href,
  rock1: new URL("./assets/rock1.png", import.meta.url).href,
  rock2: new URL("./assets/rock2.png", import.meta.url).href,
  castle: new URL("./assets/castle.png", import.meta.url).href,
  tree: new URL("./assets/tree.png", import.meta.url).href,
  tree1: new URL("./assets/tree1.png", import.meta.url).href,
  tree2: new URL("./assets/tree2.png", import.meta.url).href,
  p_left: new URL("./assets/p_left.png", import.meta.url).href,
  p_right: new URL("./assets/p_right.png", import.meta.url).href,
  p_front: new URL("./assets/p_front.png", import.meta.url).href,
  p_back: new URL("./assets/p_back.png", import.meta.url).href,
  bridge: new URL("./assets/bridge.png", import.meta.url).href,
  flag: new URL("./assets/flag.png", import.meta.url).href,
  marker: new URL("./assets/marker.png", import.meta.url).href,
  bush: new URL("./assets/bush.png", import.meta.url).href,
  bush1: new URL("./assets/bush1.png", import.meta.url).href,
} satisfies Record<keyof GameImages, string>;

export async function loadImages(): Promise<GameImages> {
  const [
    land,
    land_top,
    land_top_1,
    land_left,
    land_left_1,
    land_right,
    land_right_1,
    land_bottom,
    land_bottom_1,
    dust,
    water,
    rock,
    rock1,
    rock2,
    castle,
    tree,
    tree1,
    tree2,
    p_left,
    p_right,
    p_front,
    p_back,
    bridge,
    flag,
    marker,
    bush,
    bush1,
  ] = await Promise.all([
    loadImage(imageSources.land),
    loadImage(imageSources.land_top),
    loadImage(imageSources.land_top_1),
    loadImage(imageSources.land_left),
    loadImage(imageSources.land_left_1),
    loadImage(imageSources.land_right),
    loadImage(imageSources.land_right_1),
    loadImage(imageSources.land_bottom),
    loadImage(imageSources.land_bottom_1),
    loadImage(imageSources.dust),
    loadImage(imageSources.water),
    loadImage(imageSources.rock),
    loadImage(imageSources.rock1),
    loadImage(imageSources.rock2),
    loadImage(imageSources.castle),
    loadImage(imageSources.tree),
    loadImage(imageSources.tree1),
    loadImage(imageSources.tree2),
    loadImage(imageSources.p_left),
    loadImage(imageSources.p_right),
    loadImage(imageSources.p_front),
    loadImage(imageSources.p_back),
    loadImage(imageSources.bridge),
    loadImage(imageSources.flag),
    loadImage(imageSources.marker),
    loadImage(imageSources.bush),
    loadImage(imageSources.bush1),
  ]);

  return {
    land,
    land_top,
    land_top_1,
    land_left,
    land_left_1,
    land_right,
    land_right_1,
    land_bottom,
    land_bottom_1,
    dust,
    water,
    rock,
    rock1,
    rock2,
    castle,
    tree,
    tree1,
    tree2,
    p_left,
    p_right,
    p_front,
    p_back,
    bridge,
    flag,
    marker,
    bush,
    bush1
  };
}
