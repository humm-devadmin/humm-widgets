import * as jq from 'jquery';
import {ModalInjector} from './modal-injector';
import {Config} from './config';

(($: JQueryStatic) => {
    const template =
        `<a class="humm-more-info-widget humm-more-info-mini" data-remodal-target="${Config.moreInfoModalId}">
            <img alt="Humm" src="${Config.baseContentUrl}/content/images/bird-freeee.svg" />
        </a>`;

    const widget = new ModalInjector($);
    widget.injectBanner(template, Config.moreInfoUrlNew, Config.moreInfoModalId);
})(jq);
