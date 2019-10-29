import * as jq from 'jquery';
import {Config} from './config';
import {PageInjector} from './page-injector';

(($: JQueryStatic) => {
    const widget = new PageInjector($);
    const htmlLink = Config.baseContentUrl + "/content/html/landing-page/landing-page-content-little-big-online.html";
    widget.injectPage(htmlLink, $(document.currentScript));
})(jq);