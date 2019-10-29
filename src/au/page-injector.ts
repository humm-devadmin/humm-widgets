///<reference path="../../typings/jquery/jquery.d.ts"/>

import * as jq from 'jquery';

export class PageInjector {
    constructor(private jQuery: JQueryStatic) {
    }

    public injectPage(targetUrl: string, element?: JQuery) {

        this.jQuery.ajax({
            dataType: "html",
            url: targetUrl,
            success: function (data) {
                if (element) {
                    element.after(data);
                } else {
                    jq("body").append(data);
                }
            }
        });
    }
}
