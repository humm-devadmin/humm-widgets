import * as jq from 'jquery';
import {ModalInjector} from './modal-injector';
import {Config} from './config';

let widget;

(($: JQueryStatic) => {

    /**
     * The src attribute from the script we are executing e.g
     * <script src="http://widgets.shophumm.com.au/scripts/price-info.js?foo"
     */
    let srcString: string;
    let scriptElement: any;

    widget = new ModalInjector($);

    /* Choose if we want to render the Humm Logo or not */
    let noLogo: boolean;

    /* Choose if we want to monitor price change ever second */
    let monitor: boolean;

    /* You can pass debug=true to the query string to enable console error messages */
    let debug: boolean;

    // You can pass in min="" and max="" in the script tag.
    let min: number;
    let max: number;

    // You can pass in used_in="checkout" when inserted into shopping cart checkout page.
    let used_in: string;

    // to insert widget after which element
    let element: any;

    // merchants type (bigThings only, littleThings only, or both)
    let type: string;

    /**
     * The extracted product price from either parsing the content from HTML (via css selector)
     * or a specifically passed in value
     */
    let productPrice: number;

    jq.fn.exists = function () {
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
    min = scriptElement.dataset.min || 0;
    max = scriptElement.dataset.max || 999999;
    used_in = (getParameterByName('used_in', srcString));
    element = (getParameterByName('element', srcString)) ? jq(getParameterByName('element', srcString)) : jq(scriptElement);
    if (getParameterByName('BigThings', srcString) !== null && getParameterByName('LittleThings', srcString) !== null) {
        type = 'both';
    } else if (getParameterByName('BigThings', srcString) !== null) {
        type = 'bigThings';
    } else if (getParameterByName('LittleThings', srcString) !== null) {
        type = 'littleThings';
    } else {
        type = 'both';
    }


    let priceStr = getParameterByName('productPrice', srcString);

    if (priceStr) {
        priceStr = priceStr.replace(/^\D+/, '');
        productPrice = parseFloat(priceStr.replace(',', ''));

        // just render the widget
        // because we have been provided the price we can't bind to events on 
        // the element containing the price. We just inject the template
        let widgetUrl = productPrice <= 2000 ? Config.priceInfoUrl : Config.priceInfoMoreUrl;
        let widgetId = productPrice <= 2000 ? Config.priceInfoModalId : Config.priceInfoMoreModalId;
        if (type == 'bigThings') {
            widgetUrl = Config.priceInfoMoreUrl;
            widgetId = Config.priceInfoMoreModalId;
        }
        if (type == 'littleThings') {
            widgetUrl = Config.priceInfoUrl;
            widgetId = Config.priceInfoModalId;
        }
        const template: string = generateWidget(productPrice, noLogo, min, max, used_in, widgetId, type);
        widget.injectBanner(template, widgetUrl, widgetId, element);

    } else {
        // we haven't been passed a URL, try to get the css selector for
        let selector = getParameterByName('price-selector', srcString);
        if (!selector) {
            logDebug("Can't locate an element with selector :  " + selector);
            return false;
        }

        let el = jq(selector, document.body);

        if (el.exists()) {
            productPrice = extractPrice(el);

            if (productPrice) {
                let widgetUrl = productPrice <= 2000 ? Config.priceInfoUrl : Config.priceInfoMoreUrl;
                let widgetId = productPrice <= 2000 ? Config.priceInfoModalId : Config.priceInfoMoreModalId;
                if (type == 'bigThings') {
                    widgetUrl = Config.priceInfoMoreUrl;
                    widgetId = Config.priceInfoMoreModalId;
                }
                if (type == 'littleThings') {
                    widgetUrl = Config.priceInfoUrl;
                    widgetId = Config.priceInfoModalId;
                }
                const template: string = generateWidget(productPrice, noLogo, min, max, used_in, widgetId, type);
                widget.injectBanner(template, widgetUrl, widgetId, element);
            }

            // register event handler to update the price
            if (monitor) {
                setInterval(function () {
                    let el = jq(selector, document.body);
                    updatePrice(el, jq, noLogo, min, max, used_in, type);
                }, 1000);
            } else {
                el.on("DOMSubtreeModified", function (e) {
                    updatePrice(jq(e.target), jq, noLogo, min, max, used_in, type);
                });
            }
        }
    }

    function logDebug(msg: string) {
        if (debug === true) {
            console.log(msg);
        }
    }
})(jq);


function extractPrice(el: any) {
    let textValue = el.text().trim();
    textValue = textValue.replace(/^\D+/, "");
    textValue = textValue.replace(/,/, "");
    return parseFloat(textValue);
}

function generateWidget(productPrice: number, noLogo: boolean, min: number, max: number, used_in: string, widgetId: string, type: string): string {
    let template;
    let logo_html = noLogo ? '' : `<div class="logo"><img alt="Humm" class="humm-logo" src="${Config.baseContentUrl}/content/images/logo-orange.svg" /></div>`;
    let main_html = '';
    let price_breakdown_html = '';

    if (type == 'littleThings' && (!max || max > 2000)) {
        max = 2000;
    }
    if (productPrice > max) {
        return '<a id="humm-tag-02" class="humm-price-info-widget"></a>';
    } else {
        if (type == 'bigThings') {
            main_html = 'Pay in slices. No interest ever.';
        } else {
            if (productPrice < min) {
                main_html = 'with 5 fortnightly payments';
            } else if ((productPrice <= 1000 && productPrice <= max)) {
                main_html = 'with 5 fortnightly payments';
                let productPriceDividedByFour = productPrice / 5;
                // Banking Rounding
                let roundedDownProductPrice = Math.floor(productPriceDividedByFour * Math.pow(10, 2)) / Math.pow(10, 2);
                price_breakdown_html = `of <span class="price">$${roundedDownProductPrice.toFixed(2)}</span>`
            } else if (productPrice <= max) {
                main_html = 'Pay in slices. No interest ever.';
            }
        }
    }

    template = `
        <a class="humm-price-info-widget" data-remodal-target="${widgetId}">
            ${logo_html}
            <span class="description">
                <span class="main">${main_html} ${price_breakdown_html}</span>
                <span class="more-info">more info</span>
            </span>
        </a>`;

    return template;
}

function getCurrentScript(): any {

    return document.currentScript || (function () {
        const scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    })();
}

function updatePrice(el: JQuery, jq: JQueryStatic, noLogo: boolean, min: number, max: number, used_in: string, type: string) {
    let productPrice = extractPrice(el);
    let parent = jq(getCurrentScript()).parent();
    let widgetUrl = productPrice <= 2000 ? Config.priceInfoUrl : Config.priceInfoMoreUrl;
    let widgetId = productPrice <= 2000 ? Config.priceInfoModalId : Config.priceInfoMoreModalId;
    let template = generateWidget(productPrice, noLogo, min, max, used_in, widgetId, type);
    widget.injectBanner(template, widgetUrl, widgetId, parent);
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
