///<reference path="../../typings/jquery/jquery.d.ts"/>

import * as jq from 'jquery';
import {Config} from './config';

class PageInjector {
    constructor(private jQuery: JQueryStatic) {
    }

    public injectPage(targetUrl: string, element?: any) {

        this.jQuery.ajax({
            dataType: "html",
            url: targetUrl,
            success: function (data) {
                if (element) {
                    jq(element).after(data);
                } else {
                    jq("body").append(data);
                }
            }
        });
    }
}

(($: JQueryStatic) => {
    const widget = new PageInjector($);
    const htmlLink = Config.baseContentUrl + "/content/html/landing-page/landing-page-content-big-instore.html";
    widget.injectPage(htmlLink, "#humm-landing-page-big-instore");
})(jq);