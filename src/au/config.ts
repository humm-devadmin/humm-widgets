// when doing local test, set:
//   baseContentUrl = "./dist/au' (or './dist/nz' for New Zealand)

// When deploying to server:
//   baseContentUrl = 'https://YOUR-URL'

export class Config {
    // public static baseContentUrl = 'https://widgets.shophumm.com.au';    // for remote deploy
    public static baseContentUrl = './dist/au';       // for local testing

    // register interest modal
    public static registerInterestModalId = 'humm-modal-signup';
    public static registerInterestUrl = Config.baseContentUrl + '/content/html/Signup.html';


    // public static priceInfoModalId = 'humm-modal-more-info_1';
    // public static priceInfoUrl = Config.baseContentUrl + '/content/html/PriceInfoMore.html';

    // price-info-less modal
    public static priceInfoModalLessId = 'humm-modal-less-info_1';
    public static priceInfoLessUrl = Config.baseContentUrl + '/content/html/PriceInfoLess.html';

    // price-info-more modal
    public static priceInfoModalMoreId = 'humm-modal-more-info_1';
    public static priceInfoMoreUrl = Config.baseContentUrl + '/content/html/PriceInfoMore.html';

    // more-info modal (current)
    public static moreInfoModalId = 'humm-modal-more-info_1';
    public static moreInfoUrlNew = Config.baseContentUrl + '/content/html/MoreInfo-modal.html';

    // more-info modal (future)
    public static hummMoreInfoGeneralModalId = 'humm-modal-more-info_1';
    public static hummMoreInfoGeneralModalUrl = Config.baseContentUrl + '/content/html/MoreInfo-modal.html';

    // top-banner modal
    public static hummBannerTopModalId = 'humm-modal-more-info_1';
    public static hummBannerTopModalUrl = Config.baseContentUrl + '/content/html/MoreInfo-modal.html';
}
