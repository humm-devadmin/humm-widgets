import * as jq from 'jquery';
import { ModalInjector } from './modal-injector';
import { Config } from './config';

(($: JQueryStatic) => {
    const template = 
        `<a id="oxipay-more-info-small" data-remodal-target="${Config.moreInfoModalId}">
            <img class="logo" alt="Oxipay" src="${Config.baseContentUrl}/content/images/logo-orange.svg" />
            <span class="more-info-btn">MORE INFO</span>
            <p>Get it now. Pay over time.</p>
        </a>`;

    const widget = new ModalInjector($);
    widget.injectBanner(template, Config.moreInfoUrlNew, Config.moreInfoModalId);
})(jq);
