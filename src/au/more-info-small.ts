import * as jq from 'jquery';
import {ModalInjector} from './modal-injector';
import {Config} from './config';

(($: JQueryStatic) => {
    // Adds popup to banner
    // const template =
    //     `<a class="humm-more-info-widget humm-more-info-small" data-remodal-target="${Config.moreInfoModalId}">

    // Removes popup from banner
    const template =
        `<div class="humm-more-info-widget humm-more-info-small">
            <div class="humm-inside">
                <div class = "title-text">
                    <span class = "tt-main">Pay in 5</span>
                    <br style = "display: none;">
                    <span class = "tt-sub">(or more)</span>
                </div>
                <div class = "if-text">
                    ALWAYS<br> INTEREST<br> FREE //
                </div>
                <div class = "humm-logo">
                    <img alt="Humm" src="${Config.baseContentUrl}/content/images/humm-phone.png" />
                </div>
                <div class = "getting-started">
                    <div class = "if-text-mb">
                        ALWAYS<br> 
                        INTEREST FREE //
                    </div>
                    <div class = "title"><a href = "https://www.shophumm.com/au/" target = "_blank">Get Started</a></div>
                    <div class = "humm-tandc">Terms and conditions apply.</div>
                </div>
            </div>
        </div>`;

    const widget = new ModalInjector($);
    widget.injectBanner(template, Config.moreInfoUrlNew, Config.moreInfoModalId);
})(jq);
