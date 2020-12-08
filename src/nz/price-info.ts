import * as jq from 'jquery';
import { ModalInjector } from './modal-injector';
import { Config } from './config';
import { MerchantTerms } from './merchant-terms';

(($: JQueryStatic) => {

    /**
     * The src attribute from the script we are executing e.g
     * <script src="http://widgets.shophumm.co.nz/scripts/price-info.js?foo"
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
    let bigThingChoice = existParameterByName('BigThings', srcString);

    let priceStr = getParameterByName('productPrice', srcString);
    let merchantId = getParameterByName('merchantId', srcString);

    if(littleThingChoice != LittleThingOptions.w10)
        {
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
    }

    function newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
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
        let logo_html_no_div = noLogo ? '' : `<img alt="Humm" class="humm-widget-logo" src="${Config.baseContentUrl}/content/images/logo-orange.svg" />`;
        let main_html = '';
        let price_breakdown_html = '';
        let myGuid = newGuid();

        if (bigThingChoice || (littleThingChoice===undefined && productPrice >= 1000)) {
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

        if (productPrice > max || productPrice < min || productPrice == 0) {
            return '<a class="humm-price-info-widget"></a>';
        }

        if (type === Type.littleThings) {
            if ((productPrice <= 1000 && productPrice <= max)) {
                if (littleThingChoice === LittleThingOptions.f5) {
                    main_html = 'or 5 fortnightly payments';
                    let productPriceDividedByFive = productPrice / 5;
                    // Banking Rounding
                    let roundedDownProductPrice = Math.floor(productPriceDividedByFive * Math.pow(10, 2)) / Math.pow(10, 2);
                    price_breakdown_html = `of <span class="humm-price">$${roundedDownProductPrice.toFixed(2)}</span>`
                } else {
                    main_html = 'or 10 weekly payments';
                    let productPriceDividedByTen = productPrice / 10;
                    // Banking Rounding
                    let roundedDownProductPrice = Math.floor(productPriceDividedByTen * Math.pow(10, 2)) / Math.pow(10, 2);
                    price_breakdown_html = `of <span class="humm-price">$${roundedDownProductPrice.toFixed(2)}</span>`
                }

                template = `
                    <a class="humm-price-info-widget" data-remodal-target="${widgetId}">
                        <span class="humm-description">
                            <span class="humm-main">${main_html} ${price_breakdown_html} with ${logo_html_no_div}</span>
                            <span class="humm-more-info">more info</span>
                        </span>
                    </a>`;
            }
        } else {
            if (productPrice >= min && productPrice <= max) {
                if (merchantId) {
                    getMerchantTerms(merchantId,productPrice).then (
                        terms => {
                            template = `
                            <a id="${myGuid}" class="humm-price-info-widget" data-remodal-target="${Config.priceInfoAPIModalId + '-' + merchantId + '-' + (terms.totalRepaymentAmount + terms.depositAmount).toFixed(0)}">
                                <span class="humm-description">
                                    <span class="humm-main wrap">
                                        <span class="nowrap">or ${terms.numberOfRepayments} fortnightly payments of <span class="humm-price">$${terms.repaymentAmount.toFixed(2)}</span></span>
                                        <span class="nowrap">(total payable 
                                            <span class="humm-price">$${terms.totalPayableAmount.toFixed(2)}</span>)
                                            <span class="nowrap"> with ${logo_html_no_div}</span>
                                            <span class="humm-more-info left-pad">more info</span>
                                            
                                        </span>
                                    </span>
                                </span>
                            </a>`;
                            insert(template, myGuid, terms);
                        }
                    ).catch(error => { console.log(error); });
                    
                    template = `
                    <a id="${myGuid}" class="humm-price-info-widget" data-remodal-target="${widgetId}">
                        <span class="humm-description">
                            <span class="humm-main">Pay in slices. No interest ever with ${logo_html_no_div}</span>
                            <span class="humm-main">Loading...</span>
                        </span>
                    </a>`;
                } else {
                    template = `
                    <a id="${myGuid}" class="humm-price-info-widget" data-remodal-target="${widgetId}">
                        <span class="humm-description">
                            <span class="humm-main">Pay in slices. No interest ever with ${logo_html_no_div}</span><span class="humm-more-info">more info</span>
                        </span>
                    </a>`;
                }
            }
        }


        return template;
    }

    function getMerchantTerms(merchantNumber: string, purchaseAmount: number ): Promise<MerchantTerms> {
        return fetch (Config.priceInfoAPIUrl + '/PriceInfo/Get?merchantNumber=' + merchantNumber + '&purchaseAmount=' + purchaseAmount)
                // the JSON body is taken from the response
                .then(res => res.json())
                .then(res => {
                        return res as MerchantTerms
                })
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

    function existParameterByName(name: string, url: string): boolean {
        name = name.replace(/[\[\]]/g, '\\$&');
        let regex = new RegExp('[?&]' + name + '(([^&#]*)|&|#|$)'),
            results = regex.exec(url);

        if (!results) {
            return null;
        }
        
        return true;
    }

    function insert(useHTML?: string, replaceElement?: string, dynamicData?: MerchantTerms) {
        let widgetUrl = Config.priceInfoUrl;
        let widgetId = Config.priceInfoModalId;
        if (type !== Type.littleThings) {
            if (merchantId) {
                widgetUrl = Config.priceInfoAPIModalUrl;
                widgetId = Config.priceInfoAPIModalId;
            } 
            else {
                widgetUrl = Config.priceInfoMoreUrl;
                widgetId = Config.priceInfoMoreModalId;    
            }
        }
        if (typeof useHTML !== 'undefined') {
            if (typeof replaceElement !== 'undefined') {
                widget.replaceBanner(useHTML, Config.priceInfoAPIModalUrl, Config.priceInfoAPIModalId + '-' + merchantId + '-' + (dynamicData.totalRepaymentAmount + dynamicData.depositAmount).toFixed(0), dynamicData, productPrice, element.next('#' + replaceElement), );
            } else {
                widget.injectBanner(useHTML, widgetUrl, widgetId, element);
            }
        }
        else {
            let template = generateWidget(widgetId);
            widget.injectBanner(template, widgetUrl, widgetId, element);
        }
    }

    function logDebug(msg: string) {
        if (debug === true) {
            console.log(msg);
        }
    }
})(jq);

