import * as jq from 'jquery';
import {ModalInjector} from './modal-injector';
import {Config} from './config';

(($: JQueryStatic) => {
    const template =
        `<a class="humm-more-info-widget humm-more-info-small" data-remodal-target="${Config.moreInfoModalId}">
            <div class="inside">
                <div class="main">
                    <div class="text-area">
                        <div class='title'>
                            <div class="strong">Little things. Big things. Everything.</div>
                            <div>No interest ever.</div>
                        </div>
                        <div class="tandc">T&Cs apply. See shophumm.com.au</div>
                    </div>
                </div>
                <div class="logo">
                    <img alt="Humm" src="${Config.baseContentUrl}/content/images/bird-humm.svg" />
                </div>
            </div>
        </a>`;

    const widget = new ModalInjector($);
    widget.injectBanner(template, Config.moreInfoUrlNew, Config.moreInfoModalId);
})(jq);
