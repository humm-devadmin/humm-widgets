// when doing local test, set:
//   baseContentUrl = "./dist/au' (or './dist/nz' for New Zealand)

// When deploying to server:
//   baseContentUrl = 'https://YOUR-URL'

export class Config {
    // public static baseContentUrl = 'https://widgets.shophumm.com.au';    // for remote deploy
    public static baseContentUrl = './dist/au';       // for local testing

    // register interest modal
    public static registerInterestModalId = 'humm-modal-signup';
    public static registerInterestUrl = Config.baseContentUrl + '/content/html/signup.html';

    // price-info-less modal
    public static priceInfoLessModalId = 'humm-modal-less-info_1';
    public static priceInfoLessUrl = Config.baseContentUrl + '/content/html/priceInfoModal.html';

    // price-info-more modal
    public static priceInfoMoreModalId = 'humm-modal-more-info_1';
    public static priceInfoMoreUrl = Config.baseContentUrl + '/content/html/priceInfoMoreModal.html';

    // more-info modal
    public static moreInfoModalId = Config.priceInfoMoreModalId;
    public static moreInfoUrlNew = Config.priceInfoMoreUrl;

    // top-banner modal
    public static hummBannerTopModalId = Config.priceInfoMoreModalId;
    public static hummBannerTopModalUrl = Config.priceInfoMoreUrl;
}
