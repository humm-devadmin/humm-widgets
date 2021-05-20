import * as jq from 'jquery';
import {ModalInjector} from './modal-injector';
import {Config} from './config';

(($: JQueryStatic) => {
    const template =
        `<a class="humm-more-info-widget humm-more-info-large humm-more-info-large-slices">
            <div class="humm-inside">
                <div class="humm-main">
                    <div class="humm-text-area">
                        <div class='humm-title'>
                            <div class="humm-strong humm-nowrap">Pay in slices.</div>
                            <div class="humm-nowrap">No interest ever.</div>
                        </div>
                        <div class="humm-tandc">Lending criteria, fees, T&C's apply. See shophumm.co.nz</div>
                    </div>
                </div>
                <div class="humm-logo humm-nz">
                    <img alt="Humm" src="${Config.baseContentUrl}/content/images/bird-humm.svg" />
                </div>
            </div>
        </a>`;
    const widget = new ModalInjector($);
    widget.injectBanner(template, Config.moreInfoUrlNew, Config.moreInfoModalId);
})(jq);
