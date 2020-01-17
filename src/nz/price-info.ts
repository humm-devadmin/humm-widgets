import * as jq from 'jquery';
import { ModalInjector } from './modal-injector';
import { Config } from './config';

(($: JQueryStatic) => {

    /**
     * The src attribute from the script we are executing e.g
     * <script src="http://widgets.shophumm.com.au/scripts/price-info.js?foo"
     */
    let srcString: string;
    let scriptElement: any;

    let widget = new ModalInjector($);

    /* Choose if we want to render the Humm Logo or not */
    let noLogo: boolean;

    /* Choose if we want to monitor price change every second */
    let monitor: boolean;

    /* You can pass debug=true to the query string to enable console error messages */
    let debug: boolean;

    // You can pass in min="" and max="" in the script tag.
    let min: number;
    let max: number;

    // You can pass in used_in="checkout" when inserted into shopping cart checkout page.
    let used_in: string;

    // to insert widget after which element
    let element: JQuery;

    // merchants type (bigThings or littleThings)
    enum Type {
        bigThings,
        littleThings
    }

    let type: Type;

    // widget type in price range
    enum LittleThingOptions {
        f5,
        w10
    }

    let littleThingChoice: LittleThingOptions;

    enum BigThingOptions {
        m6 = 6,
        m9 = 9,
        m12 = 12,
        m18 = 18,
        m24 = 24
    }

    let bigThingChoice: BigThingOptions;

    /**
     * The extracted product price from either parsing the content from HTML (via css selector)
     * or a specifically passed in value
     */
    let productPrice: number;

    jq.fn.exists = function() {
        return this.length !== 0;
    };

    // get current script
    scriptElement = getCurrentScript();
    if (!scriptElement && !scriptElement.getAttribute('src')) {
        // bail if we don't have anything
        return false;
    }

    srcString = scriptElement.getAttribute('src');
    noLogo = (getParameterByName('noLogo', srcString) !== null);
    monitor = (getParameterByName('monitor', srcString) !== null);
    debug = !!scriptElement.getAttribute('debug');
    used_in = (getParameterByName('used_in', srcString));
    element = (getParameterByName('element', srcString)) ? jq(getParameterByName('element', srcString)) : jq(scriptElement);

    littleThingChoice = LittleThingOptions[getParameterByName('little', srcString) ? getParameterByName('little', srcString).toLowerCase() : null];
    bigThingChoice = BigThingOptions[getParameterByName('big', srcString) ? getParameterByName('big', srcString).toLowerCase() : null];

    if (bigThingChoice) {
        type = Type.bigThings;
        min = scriptElement.dataset.min > 80 ? scriptElement.dataset.min : 80;
        max = scriptElement.dataset.max < 10000 ? scriptElement.dataset.max : 10000;
    } else {
        type = Type.littleThings;
        min = scriptElement.dataset.min > 20 ? scriptElement.dataset.min : 20;
        max = scriptElement.dataset.max < 1000 ? scriptElement.dataset.max : 1000;
        if (!littleThingChoice) {
            littleThingChoice = LittleThingOptions.f5
        }
    }

    let priceStr = getParameterByName('productPrice', srcString);

    if (priceStr) {
        priceStr = priceStr.replace(/^\D+/, '');
        productPrice = parseFloat(priceStr.replace(',', ''));

        // just render the widget
        // because we have been provided the price we can't bind to events on 
        // the element containing the price. We just inject the template
        insert();
    } else {
        // we haven't been passed a price in URL, try to get the css selector for price element
        let selector = getParameterByName('price-selector', srcString);
        if (!selector) {
            logDebug("Can't locate an element with selector :  " + selector);
            return false;
        }

        let el = jq(selector, document.body);

        if (el.exists()) {
            productPrice = extractPrice(el);

            if (productPrice) {
                insert();
            }

            // register event handler to update the price
            if (monitor) {
                setInterval(function() {
                    let el = jq(selector, document.body);
                    updatePrice(el);
                }, 1000);
            } else {
                el.on("DOMSubtreeModified", function(e) {
                    updatePrice(jq(e.target));
                });
            }
        }
    }

    function extractPrice(el: any) {
        let textValue = el.text().trim();
        textValue = textValue.replace(/^\D+/, "");
        textValue = textValue.replace(/,/, "");
        return parseFloat(textValue);
    }

    function generateWidget(widgetId): string {
        let deposit: number;
        let instalment: number;
        let numberOfInstalments: number;
        let numberOfMonths: number;

        let template: string;
        let logo_html = noLogo ? '' : `<div><img alt="Humm" class="humm-widget-logo" src="${Config.baseContentUrl}/content/images/logo-orange.svg" /></div>`;
        let main_html = '';
        let price_breakdown_html = '';

        if (productPrice > max || productPrice < min || productPrice == 0) {
            return '<a class="humm-price-info-widget"></a>';
        }

        if (type === Type.littleThings) {
            if ((productPrice <= 1000 && productPrice <= max)) {
                if (littleThingChoice === LittleThingOptions.f5) {
                    main_html = 'with 5 fortnightly payments';
                    let productPriceDividedByFive = productPrice / 5;
                    // Banking Rounding
                    let roundedDownProductPrice = Math.floor(productPriceDividedByFive * Math.pow(10, 2)) / Math.pow(10, 2);
                    price_breakdown_html = `of <span class="humm-price">$${roundedDownProductPrice.toFixed(2)}</span>`
                } else {
                    main_html = 'with 10 weekly payments';
                    let productPriceDividedByTen = productPrice / 10;
                    // Banking Rounding
                    let roundedDownProductPrice = Math.floor(productPriceDividedByTen * Math.pow(10, 2)) / Math.pow(10, 2);
                    price_breakdown_html = `of <span class="humm-price">$${roundedDownProductPrice.toFixed(2)}</span>`
                }

                template = `
                    <a class="humm-price-info-widget" data-remodal-target="${widgetId}">
                        ${logo_html}
                        <span class="humm-description">
                            <span class="humm-main">${main_html} ${price_breakdown_html}</span>
                            <span class="humm-more-info">more info</span>
                        </span>
                    </a>`;
            }
        } else {
            if (productPrice >= min && productPrice <= max) {
                let instalmentsList = {
                    "m6": 13,
                    "m9": 19,
                    "m12": 26,
                    "m18": 39,
                    "m24": 52
                };
                numberOfInstalments = instalmentsList[BigThingOptions[bigThingChoice]];

                deposit = Math.floor(productPrice * 0.1 * Math.pow(10, 2)) / Math.pow(10, 2);
                instalment = productPrice * 0.9 / numberOfInstalments;
                numberOfMonths = bigThingChoice;
                // Banking Rounding
                let roundedDownProductPrice = Math.floor(instalment * Math.pow(10, 2)) / Math.pow(10, 2);
                price_breakdown_html = `<span class="humm-price">$${roundedDownProductPrice.toFixed(2)}</span>`;

                template = `
                <a class="humm-price-info-widget" data-remodal-target="${widgetId}">
                    ${logo_html}
                    <span class="humm-description">
                        <span class="humm-main">$${deposit} upfront then fortnightly instalments of ${price_breakdown_html} over ${numberOfMonths} months plus fees.</span>
                        <span class="humm-more-info">more info</span>
                    </span>
                </a>`;
            }
        }


        return template;
    }

    function getCurrentScript(): any {
        return document.currentScript || (function() {
            const scripts = document.getElementsByTagName('script');
            return scripts[scripts.length - 1];
        })();
    }

    function updatePrice(el: JQuery) {
        productPrice = extractPrice(el);
        element = jq(getCurrentScript()).parent();

        insert();
    }

    function getParameterByName(name: string, url: string): string {
        name = name.replace(/[\[\]]/g, '\\$&');
        let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);

        if (!results) {
            return null;
        }
        if (!results[2]) {
            return '';
        }

        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    function insert() {
        let widgetUrl = productPrice <= 2000 ? Config.priceInfoUrl : Config.priceInfoMoreUrl;
        let widgetId = productPrice <= 2000 ? Config.priceInfoModalId : Config.priceInfoMoreModalId;
        if (type == Type.littleThings) {
            widgetUrl = Config.priceInfoUrl;
            widgetId = Config.priceInfoModalId;
        }
        let template = generateWidget(widgetId);
        widget.injectBanner(template, widgetUrl, widgetId, element);
    }

    function logDebug(msg: string) {
        if (debug === true) {
            console.log(msg);
        }
    }
})(jq);

