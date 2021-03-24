// when doing local test, set:
//   baseContentUrl = "./dist/au' (or './dist/nz' for New Zealand)

// When deploying to server:
//   baseContentUrl = 'https://YOUR-URL'

export class Config {
    public static baseContentUrl = 'https://widgets.shophumm.com.au';    // for remote deploy
    // public static baseContentUrl = 'https://s3-ap-southeast-2.amazonaws.com/widgets.oxipay.com.au';    // for remote deploy
    // public static baseContentUrl = 'https://s3-ap-southeast-2.amazonaws.com/widgets.shophumm.com.au/dist/au';    // for remote demo
    // public static baseContentUrl = './dist/au';       // for local testing

    // price-info modal
    public static priceInfoModalId = 'humm-price-info-modal';
    public static priceInfoUrl = Config.baseContentUrl + '/content/html/priceInfoModal.html';

    // price-info-more modal
    public static priceInfoMoreModalId = 'humm-price-info-more-modal';
    public static priceInfoMoreUrl = Config.baseContentUrl + '/content/html/priceInfoMoreModal.html';

    // price-info-api modal
    public static priceInfoAPIModalId = 'humm-price-info-api-modal';
    public static priceInfoAPIModalUrl = Config.baseContentUrl + '/content/html/priceInfoAPIModal.html';

    //price-info-v2 modal
    public static priceInfoV2ModalId = 'humm-price-info-v2-modal';
    public static priceInfoV2Url = Config.baseContentUrl + '/content/html/priceInfoV2.html';

    //price-info-v2-black-modal
    public static priceInfoV2BlackModalId = 'humm-price-info-v2-black-modal';
    public static priceInfoV2BlackUrl = Config.baseContentUrl + '/content/html/priceInfoV2-black.html';

    //price-info-myer modal
    public static priceInfoMyerModalId = 'humm-price-info-myer-modal';
    public static priceInfoMyerUrl = Config.baseContentUrl + '/content/html/priceInfoModalMyer.html';

    // more-info modal
    public static moreInfoModalId = 'humm-more-info-modal';
    public static moreInfoUrlNew = Config.baseContentUrl + '/content/html/moreInfoModal.html';

    // top-banner modal
    public static hummBannerTopModalId = Config.moreInfoModalId;
    public static hummBannerTopModalUrl = Config.moreInfoUrlNew;

    // price info api
    public static priceInfoAPIUrl = 'https://buyerapi.shophumm.com.au/api';}
