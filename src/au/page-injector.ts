///<reference path="../../typings/jquery/jquery.d.ts"/>

import * as jq from 'jquery';

export class PageInjector {
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
