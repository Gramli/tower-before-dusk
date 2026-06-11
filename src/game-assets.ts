export interface GameImages {
  land:           HTMLImageElement;
  water:          HTMLImageElement;
  rock:           HTMLImageElement;
  rock1:          HTMLImageElement;
  rock2:          HTMLImageElement;
  castle:         HTMLImageElement;
  tree:           HTMLImageElement;
  tree1:          HTMLImageElement;
  p_left:         HTMLImageElement;
  p_right:        HTMLImageElement;
  p_front:        HTMLImageElement;
  p_back:         HTMLImageElement;
  bridge:         HTMLImageElement;
  flag:           HTMLImageElement;
}


function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload  = () => resolve(img);
    img.onerror = () => reject(new Error(`Could not load image: ${src}`));
    img.src = src;
  });
}

const imageSources = {
  land: new URL('./assets/land.png', import.meta.url).href,
  water: new URL('./assets/water.png', import.meta.url).href,
  rock: new URL('./assets/rock.png', import.meta.url).href,
  rock1: new URL('./assets/rock1.png', import.meta.url).href,
  rock2: new URL('./assets/rock2.png', import.meta.url).href,
  castle: new URL('./assets/castle.png', import.meta.url).href,
  tree: new URL('./assets/tree.png', import.meta.url).href,
  tree1: new URL('./assets/tree1.png', import.meta.url).href,
  p_left: new URL('./assets/p_left.png', import.meta.url).href,
  p_right: new URL('./assets/p_right.png', import.meta.url).href,
  p_front: new URL('./assets/p_front.png', import.meta.url).href,
  p_back: new URL('./assets/p_back.png', import.meta.url).href,
  bridge: new URL('./assets/bridge.png', import.meta.url).href,
  flag: new URL('./assets/flag.png', import.meta.url).href,
} satisfies Record<keyof GameImages, string>;

export async function loadImages(): Promise<GameImages> {
  const [
    land, water, rock, rock1, rock2, castle,
    tree, tree1, p_left, p_right, p_front, p_back, bridge, flag
  ] = await Promise.all([
    loadImage(imageSources.land),
    loadImage(imageSources.water),
    loadImage(imageSources.rock),
    loadImage(imageSources.rock1),
    loadImage(imageSources.rock2),
    loadImage(imageSources.castle),
    loadImage(imageSources.tree),
    loadImage(imageSources.tree1),
    loadImage(imageSources.p_left),
    loadImage(imageSources.p_right),
    loadImage(imageSources.p_front),
    loadImage(imageSources.p_back),
    loadImage(imageSources.bridge),
    loadImage(imageSources.flag),
  ]);

  return {
    land, water, rock, rock1, rock2, castle,
    tree, tree1, p_left, p_right, p_front,
    p_back, bridge, flag,
  };
}
