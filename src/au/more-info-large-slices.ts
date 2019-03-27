import * as jq from 'jquery';
import {ModalInjector} from './modal-injector';
import {Config} from './config';

(($: JQueryStatic) => {
    const template =
        `<a class="humm-more-info-large humm-more-info-large-slices" data-remodal-target="${Config.moreInfoModalId}">
            <div class="inside">
                <div class="main">
                    <img class="elephant" src="${Config.baseContentUrl}/content/images/elephant.png" alt="sliced pink elephant">
                        <div class="text-area">
                        <div class='title'>
                            <div class="strong">Pay in slices.</div>
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
