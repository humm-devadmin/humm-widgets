import * as jq from 'jquery';
import {ModalInjector} from './modal-injector';
import {Config} from './config';

(($: JQueryStatic) => {
    let element: any;
    let srcString: string;
    let scriptElement: any;

    // get current script
    scriptElement = getCurrentScript();
    if (!scriptElement && !scriptElement.getAttribute('src')) {
        // bail if we don't have anything
        return false;
    }

    srcString = scriptElement.getAttribute('src');
    element = (getParameterByName('element', srcString)) ? jq(getParameterByName('element', srcString)) : jq(scriptElement);

    const template =
        `<a id="humm-banner-top" data-remodal-target="${Config.hummBannerTopModalId}">
            <div class="logo">
                <img alt="Humm" src="${Config.baseContentUrl}/content/images/logo-orange.svg" />
            </div>
            <div class="placeholder"></div>
            <div class='title'>
                <div>Get it now.&nbsp;</div>
                <div>Pay over time.&nbsp;</div>
                <div class="light">No Interest ever.</div>
                <div id="narrow-screen">
                    <span class="more-info-btn">MORE INFO</span>
                </div>
            </div>
            <div class="orange-area" id="wide-screen">
                <span class="more-info-btn">MORE INFO</span>
            </div>
        </a>`;
    const widget = new ModalInjector($);
    widget.injectBanner(template, Config.hummBannerTopModalUrl, Config.hummBannerTopModalId, element);


    function getCurrentScript(): any {

        return document.currentScript || (function () {
            const scripts = document.getElementsByTagName('script');
            return scripts[scripts.length - 1];
        })();
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
})(jq);


