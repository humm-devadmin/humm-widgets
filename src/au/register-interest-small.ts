import * as jq from 'jquery';
import { ModalInjector } from './modal-injector';
import { Config } from './config';


(($: JQueryStatic) => {
    const template = `<a id="oxipay-tag-01" data-remodal-target="${Config.registerInterestModalId}">
            <p>Pay the easier way with</p> <img alt="Oxipay" src="${Config.baseContentUrl}/content/images/logo-orange.svg" /> <span>More info</span>
        </a>`;

    const widget = new ModalInjector($);
    widget.injectBanner(template, Config.registerInterestUrl, Config.registerInterestModalId);
})(jq);
