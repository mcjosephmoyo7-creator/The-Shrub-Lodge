/**
 * Central catalogue of photography. Every asset lives on the Wix media CDN
 * or in /images, so we store the media path here and let `next/image`
 * request the exact size we need.
 */
const CDN = "https://static.wixstatic.com/media/";

/**
 * Build an image source URL.
 * Handles both Wix media IDs and local/absolute paths seamlessly.
 * @param mediaPath Wix media path, e.g. `48e288_xxxx~mv2.jpg` or `/images/...`
 * @param aspectRatio Optional width/height ratio used by the image loader.
 */
export function wix(mediaPath: string, aspectRatio?: number): string {
  if (!mediaPath) return "";
  if (mediaPath.startsWith("/") || mediaPath.startsWith("http://") || mediaPath.startsWith("https://")) {
    return mediaPath;
  }
  const url = `${CDN}${mediaPath}`;
  return aspectRatio ? `${url}?ar=${aspectRatio}` : url;
}

export const IMAGES = {
  // Brand Logo
  logo: "48e288_8835d09b08ae4c9ea2a2ebf2e8bb6963~mv2.png",
  logoLocal: "/images/logo.png",

  // Home
  heroFalls: "63da5c_b355042841df442aabd689ff770a193e~mv2.jpeg",
  heroFallsPortrait: "63da5c_dfcd53939b6f4ab5b8ac7a4ab7244024~mv2.jpeg",
  heroFallsTall: "63da5c_e526e39c261942c7b02e0c76ed5324ff~mv2.jpeg",
  lodgeExterior: "48e288_420a82e317fc469ca28cd7bb382680eb~mv2.jpg",
  lodgeInterior: "83df1a_26f57da3a4f3489683c2709d0a189024~mv2.jpeg",
  lodgeGarden: "83df1a_78b43ca423fa49018aa14616d3bfd67c~mv2.png",
  lodgePool: "48e288_014fb99b75634f2c95c70b27c9f56ade~mv2.jpg",
  pool: "83df1a_7dc421ea56a24ea88ab35f6f9e4f5b18~mv2.jpeg",

  // Rooms
  roomSingle: "83df1a_7dc421ea56a24ea88ab35f6f9e4f5b18~mv2.jpeg",
  roomDouble: "83df1a_ee3d64168c1f4087aadd5d92a807bf58~mv2.jpeg",
  roomTwin: "83df1a_ac28749fce0f4e98a6a2c7d770e01e07~mv2.jpeg",
  roomDetail1: "83df1a_ee3d64168c1f4087aadd5d92a807bf58~mv2.jpeg",
  roomDetail2: "83df1a_ac28749fce0f4e98a6a2c7d770e01e07~mv2.jpeg",

  // The Shrub Restaurant & Dining
  restaurantHero: "48e288_6b0ae0c990e64765b810dc3983736e00~mv2.jpg", // The Shrub Lodge restaurant dining hall
  restaurantDish: "63da5c_65a3a9352088420d9e87173f43f54704~mv2.jpg", // Plated signature dish
  restaurantTable: "48e288_6b0ae0c990e64765b810dc3983736e00~mv2.jpg", // Elegant dining tables
  restaurantPoolside: "63da5c_aea60354152b4eab915434203ca407ca~mv2.png", // Poolside restaurant terrace
  comfortAdventure1: "63da5c_1896e2ad419042148aebedc8a97e556e~mv2.jpeg",
  comfortAdventure2: "63da5c_5cb80aaabc5e4d749490cc605ac267b2~mv2.jpeg",
  comfortAdventure3: "63da5c_f36536809a1b401fbb320820eb507ac1~mv2.jpeg",
  comfortAdventure4: "63da5c_f869a78a1b894c52947b0377d8d0ecf4~mv2.jpeg",
  comfortAdventure5: "63da5c_bbb86c6915354dfc8fa61d9f5028e7c4~mv2.jpeg",
  comfortAdventure6: "63da5c_dc3024e403f3402ea83addb5c4fcca2f~mv2.jpeg",
  comfortAdventure7: "63da5c_95fb1e98b5684e72894e2468ad5892f4~mv2.jpeg",

  // Food & Beverage Collections
  foodGourmet: "/images/restaurant/gourmet-plating.jpg",
  foodSteak: "/images/restaurant/grilled-steak.jpg",
  foodBreakfast: "/images/restaurant/breakfast-spread.jpg",
  foodSalad: "/images/restaurant/fresh-salad.jpg",
  foodDessert: "/images/restaurant/dessert-pastry.jpg",
  drinkCocktail: "/images/restaurant/signature-cocktail.jpg",
  drinkWine: "/images/restaurant/fine-wine.jpg",
  drinkJuice: "/images/restaurant/fresh-juice.jpg",
  drinkCoffee: "/images/restaurant/barista-coffee.jpg",
  staffService: "/images/restaurant/restaurant-service.jpg",
  staffChef: "/images/restaurant/chef-cooking.jpg",
  staffWaiter: "/images/restaurant/waiter-hospitality.jpg",

  // Page heroes
  aboutHero: "48e288_da212190c9954f0e929153b6c198b3c2~mv2.jpg",

  // Activity Category Heroes (Exact matches from theshrublodge.com)
  vicFalls: "63da5c_42ec6b463ef94889bafa3398faa84130~mv2.jpg",
  safari: "63da5c_d969b31caa18434ca9cd04f6091e0f10~mv2.png",
  animals: "63da5c_46b2bb3250f24e25b0d848040209d84a~mv2.jpg",
  cruises: "nsplsh_de98735f94f14b4da018fed5b3f950b1~mv2.jpg",
  aerial: "63da5c_b14f83e6c0304618b1462919fa017127~mv2.jpg",
  adrenaline: "63da5c_51875649c4304ac1aaa4f2c718a4fbaf~mv2.jpg",
  cultural: "63da5c_49ec148e60484c5cbe1efa22ad20eab7~mv2.png",
  transfers: "48e288_420a82e317fc469ca28cd7bb382680eb~mv2.jpg",

  // Victoria Falls & Scenic (Exact matches from services-9-1)
  fallsZimbabwe: "63da5c_f50976ddee1a49f0893a6e09fecb8b73~mv2.jpg",
  fallsZambia: "63da5c_6e53823fcbab4f9bbf86bed0f87761c0~mv2.jpg",
  morningBreeze: "63da5c_e2a14db3363b478fa9015b4a5c0448d8~mv2.jpg",
  devil: "63da5c_7ab72b45e5d044f79cb4e71ba5c8a99a~mv2.jpg",
  devilLunch: "63da5c_139eba35c643479abfc08a1fb5df0cf3~mv2.jpg",
  angel: "63da5c_8c640248059a4945bfd5470292e1d16b~mv2.jpg",
  bridgeTour: "63da5c_a74a54ea1ca943ff9dad5e0c75394c90~mv2.jpg",
  batoka: "63da5c_83d1644f402140588aca59cef9957b31~mv2.jpg",
  bambaTram: "63da5c_681a5a7015ae4a1ab38a0f480d570aa9~mv2.jpg",

  // Safari, Wildlife & Nature (Exact matches from copy-of-victoria-falls-scenic-exper)
  hwange: "63da5c_85c54bb3fb15477aa4a30463778426e3~mv2.jpg",
  chobe: "63da5c_6ac6dda6ccf347d4946cf399fad84609~mv2.jpg",
  chobeOvernight: "48e288_29e83d8f4d5e4a0e8a0f67911a11fffa~mv2.jpg",
  gameDriveZambezi: "63da5c_75f59df466d748539fb5d6163142e20d~mv2.jpg",
  gameDriveChamabondo: "63da5c_02b3c06e5dd64fa5a4e29b3069b80d99~mv2.jpg",
  nightDrive: "63da5c_f0fc73aaa6594ad7a83431b2a072e51e~mv2.jpg",
  gameWalk: "63da5c_d0ed8b9296d14d8f8b12afa772ad0309~mv2.jpg",
  horseback: "83df1a_865465c1eabf4cd0ae54c911f06784de~mv2.jpeg",
  rhino: "63da5c_7c4c5a1dc1d4491d926b7035c33e4381~mv2.jpg",
  rhinoWalk: "63da5c_2f03027551784867a79e7f50f592a603~mv2.jpg",
  birding: "63da5c_40c07629d4dc49469ab5c4d0a76bcc87~mv2.jpg",
  fishing: "63da5c_3ac32b980c4448beb9c9d9acde250d54~mv2.jpg",

  // Animal Encounters & Conservation (Exact matches from copy-of-safari-wildlife-nature)
  elephant: "63da5c_3b95965c8e8b42c6ab2b28cab8cfc6be~mv2.jpg",
  lionWalk: "63da5c_565cf0fa215c4fc99b41a89f751a33ea~mv2.webp",
  lion: "63da5c_9816b4433a8342778264f6ae64f7bf29~mv2.jpg",
  cheetah: "63da5c_658d4bf82237404ea02341079c5ee6f5~mv2.jpg",
  crocodileDive: "83df1a_cd559c6cef5c401db18377eed20a6a13~mv2.png",
  crocodileFarm: "63da5c_b6a8cf284c3f4b0f9274088bd6bb7a67~mv2.avif",

  // Cruises & River Experiences (Exact matches from copy-of-animal-encounters-conservation)
  cruiseRa: "63da5c_8e84819dd8e641dcbb8ebe139e6aed6f~mv2.avif",
  cruiseExplorer: "63da5c_a1c4aba8d61d4102a8cc9c7463e83b2e~mv2.avif",
  cruiseVista: "63da5c_02241328073c4faf99375e18dd2a49b5~mv2.avif",
  cruiseSunset: "63da5c_33450266335d401e91d46a7da40f8c30~mv2.jpg",
  cruiseSunrise: "63da5c_e7d3ad217cf74bf1b0478d685e43edf1~mv2.jpg",
  cruiseDinner: "63da5c_a40ffa3f348a42f094ee9df0377d9db1~mv2.jpg",
  cruiseCombo: "63da5c_766e1a2cf83243baaba07e51814c4ee9~mv2.avif",
  cruisePackage: "63da5c_5d4ca37523804358a05d12e12476ccc4~mv2.avif",

  // Aerial Adventures (Exact matches from copy-of-cruises-river-experiences)
  helicopterHero: "63da5c_81969c53e4084a5994187c7a54ed503d~mv2.jpg",
  helicopter: "63da5c_ef4f9469608f4be48163ef57a1ea4893~mv2.jpg",
  helicopterAlt: "63da5c_52b5c2982a3a415c9e6132db92520a16~mv2.jpg",
  microlight: "63da5c_8e79e095604c47beaa09f7733b2fdb5c~mv2.jpg",

  // Adventure & Adrenaline (Exact matches from copy-of-cultural-city-local-experi)
  raftingLow: "63da5c_1ee443cb5f87410fb4df662dfc6c2b3c~mv2.avif",
  raftingHigh: "63da5c_06bd2f50a6f843a193665f48e133f226~mv2.jpg",
  bungee: "63da5c_10b5e43d384d46f0854eba538240af32~mv2.png",
  bridgeSwing: "63da5c_3696cfaedddf4ba583057d32f671f5d6~mv2.png",
  tandemBridgeSwing: "63da5c_dffac8f60c194faaa2ef014c2c35b0f9~mv2.jpg",
  gorgeSwing: "63da5c_a6bb6ce2b10943be9e823e72608ccbc0~mv2.jpg",
  tandemGorgeSwing: "63da5c_b8c18f5e07f242c38db253578e093530~mv2.jpg",
  zipLine: "63da5c_22318066068c4b6fa1c54e18cf4e054a~mv2.jpg",
  tandemZip: "63da5c_b4f9cb319b4240b6b46dab4f1375d7a7~mv2.jpg",
  bridgeSlide: "63da5c_54220171fe1c429997c3e3c60da15a02~mv2.jpg",
  flyingFox: "63da5c_03b3d48545bb4b6c86fbced908266f29~mv2.jpg",
  highWire: "63da5c_8f2391cf14544c5bb3abf34c116a55f2~mv2.jpg",
  canopy: "63da5c_0c050139a15f483cac21c4279bbe9ee9~mv2.jpg",
  quadBike: "63da5c_86ffdf3c5b97462daa26ce9696b6488f~mv2.webp",
  jetboat: "63da5c_be9ffd13df6e4b6499fab16710adc6f9~mv2.avif",

  // Cultural, City & Local (Exact matches from copy-of-aerial-adventures)
  chinotimba: "63da5c_b307907174a748b9824da80461cadfce~mv2.webp",
  village: "63da5c_6c28e2de20fd40dabf46efda92966b75~mv2.jpg",
  mukuni: "63da5c_e5583dbb853d4b82b7c4931de392adb6~mv2.jpg",
  livingstone: "63da5c_c43aaf3536744e80818c6af23dc9b7a6~mv2.jpg",
  shop: "63da5c_0ea2e19c070f4c959a3846042e829d84~mv2.png",
  simunye: "63da5c_c73fd5a5ba5643ea92b7d6ffb744dc3c~mv2.jpg",
  bomaInternational: "63da5c_fd798a64c4e44ff0ab09ed8f097fb01b~mv2.jpg",
  bomaResident: "63da5c_b8b9a0f0c3d74436afafc8c238a4ad2b~mv2.jpg",
} as const;

export type ImageKey = keyof typeof IMAGES;
