import * as jq from 'jquery';
import {ModalInjector} from './modal-injector';
import {Config} from './config';

(($: JQueryStatic) => {
    // Adds popup to banner
    // const template =
    //     `<a class="humm-more-info-widget humm-more-info-large humm-more-info-large-slices" data-remodal-target="${Config.moreInfoModalId}">

    // Removes popup from banner
    const template =
        `<div class="humm-more-info-widget humm-more-info-small">
            <div class="humm-inside humm-big">
                <div class = "title-text-big">
                    <span class = "tt-main-big">THE BIGGER</span>
                    <br>
                    <span class = "tt-main">BUY NOW <br style = "display: none;">PAY LATER.</span>
                    <div class = "if-text-big">
                        ALWAYS INTEREST FREE //
                    </div>
                </div>
                <div class = "getting-started-big">
                    <div class = "if-text-mb">
                        ALWAYS<br> 
                        INTEREST FREE //
                    </div>
                    <div class = "title"><a href = "https://www.shophumm.com/au/" target = "_blank">Get Started</a></div>
                    <div class = "humm-tandc">Terms and conditions apply.</div>
                </div>
                <div class = "humm-logo-big">
                    <img alt="Humm" src="${Config.baseContentUrl}/content/images/humm-phone.png" />
                </div>
            </div>
        </div>`;
    const widget = new ModalInjector($);
    widget.injectBanner(template, Config.moreInfoUrlNew, Config.moreInfoModalId);
})(jq);
