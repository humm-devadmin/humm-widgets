// when doing local test, set:
//   baseContentUrl = "./dist/nz' (or './dist/au' for Australia)

// When deploying to server:
//   baseContentUrl = 'https://YOUR-URL'

export class Config {
    public static baseContentUrl = 'https://widgets.shophumm.co.nz';    // for remote deploy
    // public static baseContentUrl = 'https://s3-ap-southeast-2.amazonaws.com/widgets.oxipay.co.nz';    // for remote deploy
    // public static baseContentUrl = 'https://s3-ap-southeast-2.amazonaws.com/widgets.shophumm.co.nz/dist/nz';    // for remote demo
    public static baseContentUrl = './dist/nz';       // for local testing

    // price-info modal
    public static priceInfoModalId = 'humm-price-info-modal';
    public static priceInfoUrl = Config.baseContentUrl + '/content/html/priceInfoModal.html';

    // price-info-more modal
    public static priceInfoMoreModalId = 'humm-price-info-more-modal';
    public static priceInfoMoreUrl = Config.baseContentUrl + '/content/html/priceInfoMoreModal.html';

    // price-info-new modal
    public static priceInfoNewModalId = 'humm-price-info-new-modal';
    public static priceInfoNewUrl = Config.baseContentUrl + '/content/html/priceInfoNewModal.html';

    // price-info-api modal
    public static priceInfoAPIModalId = 'humm-price-info-api-modal';
    public static priceInfoAPIModalUrl = Config.baseContentUrl + '/content/html/priceInfoAPIModal.html';

    // more-info modal
    public static moreInfoModalId = 'humm-more-info-modal';
    public static moreInfoUrlNew = Config.baseContentUrl + '/content/html/moreInfoModal.html';

    // top-banner modal
    public static hummBannerTopModalId = Config.moreInfoModalId;
    public static hummBannerTopModalUrl = Config.moreInfoUrlNew;

    // price info api
    public static priceInfoAPIUrl = 'https://buyerapi.shophumm.co.nz/api';
}
