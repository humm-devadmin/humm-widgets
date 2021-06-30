import * as jq from 'jquery';
import { ModalInjector } from './modal-injector';
import { Config } from './config';
import { MerchantTerms } from './merchant-terms';


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

    // merchants type (bigThings only, littleThings only, or both)
    enum Type {
        bigThings,
        littleThings,
        both
    }

    let type: Type;

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
    min = scriptElement.dataset.min || 0;
    max = scriptElement.dataset.max || 999999;
    used_in = getParameterByName('used_in', srcString);
    element = getParameterByName('element', srcString) ? jq(getParameterByName('element', srcString)) : jq(scriptElement);

    let bigThings = (getParameterByName('BigThings', srcString) !== null || getParameterByName('BigOnly', srcString) !== null);
    let littleThings = (getParameterByName('LittleThings', srcString) !== null || getParameterByName('LittleOnly', srcString) !== null);

    if (bigThings && littleThings) {
        type = Type.both;
    } else if (bigThings) {
        type = Type.bigThings;
    } else if (littleThings) {
        type = Type.littleThings;
    } else {
        type = Type.both;
    }

    let priceStr = getParameterByName('productPrice', srcString);
    let merchantId = getParameterByName('merchantId', srcString);
    let length = getParameterByName('length', srcString);
    // let theme = getParameterByName('theme', srcString);

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
        let template;
        let logo_html = noLogo ? '' : `<div><img alt="Humm" class="humm-widget-logo" src="${Config.baseContentUrl}/content/images/logo-orange.svg" /></div>`;
        let logo_html_no_div = noLogo ? '' : `<img alt="Humm" class="humm-widget-logo-winning-group" src="${Config.baseContentUrl}/content/images/logo-orange.svg" />`;
        let main_html = '';
        let price_breakdown_html = '';
        let myGuid = newGuid();

        if (type == Type.littleThings && (!max || max > 2000)) {
            max = 2000;
        }
        if (productPrice > max) {
            return '<a class="humm-price-info-widget" href=""></a>';
        }

        if (type == Type.bigThings) {
            main_html = 'Pay in slices. No interest ever.';
            if (merchantId) {
                getMerchantTerms(merchantId,productPrice).then (
                    terms => {
                        template = `
                            <a id="${myGuid}" class="humm-price-info-widget" data-remodal-target="${Config.priceInfoAPIModalWinningGroupId + '-' + merchantId + '-' + (terms.totalRepaymentAmount + terms.depositAmount).toFixed(0)}" href="">
                                <span class="humm-description">
                                    <span class="humm-main wrap">
                                        <span class="nowrap">${terms.numberOfRepayments} fortnightly payments of <span class="humm-price">$${terms.repaymentAmount.toFixed(2)}</span></span>
                                        <span class="nowrap">(total payable 
                                            <span class="humm-price">$${(terms.totalRepaymentAmount + terms.depositAmount).toFixed(2)}</span>)
                                            ${logo_html_no_div}
                                        </span>
                                    </span>
                                    
                                </span>
                            </a>`;
                        insert(template, myGuid, terms);
                    }
                ).catch(error => { console.log(error); });          
            }
        } else {
            if (productPrice < min || productPrice == 0) {
                if (length == 'short') {
                    main_html = '5 payments';
                } else {
                    main_html = "5 fortnightly payments"
                }
            } else if ((productPrice <= 2000 && productPrice <= max)) {
                if (length == 'short') {
                    main_html = '5 payments';
                } else {
                    main_html = "5 fortnightly payments"
                }                
                let productPriceDividedByFive = productPrice / 5;
                // Banking Rounding
                let roundedDownProductPrice = Math.floor(productPriceDividedByFive * Math.pow(10, 2)) / Math.pow(10, 2);
                price_breakdown_html = `of <span class="humm-price">$${roundedDownProductPrice.toFixed(2)}</span>`
            // } else if(productPrice > 1000 && productPrice < 2000) {
                // main_html = 'Pay in slices. No interest ever, ';
            } else if (productPrice <= max && productPrice > 2000) {
                main_html = 'Pay in slices. No interest ever, ';
                if (merchantId) {
                    getMerchantTerms(merchantId,productPrice).then (
                        terms => {
                            template = `
                            <a id="${myGuid}" class="humm-price-info-widget" data-remodal-target="${Config.priceInfoAPIModalWinningGroupId + '-' + merchantId + '-' + (terms.totalRepaymentAmount + terms.depositAmount).toFixed(0)}" href="">
                                <span class="humm-description">
                                    <span class="humm-main wrap">
                                        ${main_html} with ${logo_html_no_div}
                                    </span>
                                </span>
                            </a>`;
                            insert(template, myGuid, terms);
                        }
                    ).catch(error => { console.log(error); });          
                }
            }
        }

        template = `
        <a id="${myGuid}" class="humm-price-info-widget" data-remodal-target="${widgetId}" href="">
            <span class="humm-description">
                <span class="humm-main">
                    ${main_html} ${price_breakdown_html} with ${logo_html_no_div}
                </span>
            </span>
        </a>`;

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

    function insert(useHTML?: string, replaceElement?: string, dynamicData?: MerchantTerms) {
        let widgetUrl = productPrice <= 2000 ? Config.priceInfoV2Url : ( merchantId ? Config.priceInfoAPIModalUrl : Config.priceInfoMoreUrl );
        let widgetId = productPrice <= 2000 ? Config.priceInfoV2ModalId : ( merchantId ? Config.priceInfoAPIModalId : Config.priceInfoMoreModalId );
        if (type == Type.bigThings) {
            if (merchantId) {
                widgetUrl = Config.priceInfoAPIModalWinningGroupUrl;
                widgetId = Config.priceInfoAPIModalWinningGroupId;
            } 
            else {
                widgetUrl = Config.priceInfoMoreUrl;
                widgetId = Config.priceInfoMoreModalId;    
            }
        }
        // If widget is specified as little things, check for theme
        if (type == Type.littleThings) {
            widgetUrl = Config.priceInfoWinningGroupUrl;
            widgetId = Config.priceInfoWinningGroupModalId;
            // If widget is little things only and price > $2000
        } else if (productPrice >= 1000) {
            widgetUrl = Config.priceInfoWinningGroup5mUrl;
            widgetId = Config.priceInfoWinningGroup5mModalId;
        } else {
            widgetUrl = Config.priceInfoWinningGroupUrl;
            widgetId = Config.priceInfoWinningGroupModalId;
        }
        if (typeof useHTML !== 'undefined') {
            if (typeof replaceElement !== 'undefined') {
                widget.replaceBanner(useHTML, Config.priceInfoAPIModalWinningGroupUrl, Config.priceInfoAPIModalWinningGroupId + '-' + merchantId + '-' + (dynamicData.totalRepaymentAmount + dynamicData.depositAmount).toFixed(0), dynamicData, element.next('#' + replaceElement), );
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
