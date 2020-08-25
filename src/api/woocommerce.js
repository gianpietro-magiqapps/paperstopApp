import { settings } from "../../settings";

const WooApi = {
  url: {
    wc: "https://paperstop.pe/wp-json/wc/v3/",
    wp: "https://paperstop.pe/wp-json/wp/v2/media",
  },
  keys: {
    consumerKey: settings.wc_consumerKey,
    consumerSecret: settings.wc_consumerSecret,
  },
};

export default WooApi;
