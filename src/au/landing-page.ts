///<reference path="../../typings/jquery/jquery.d.ts"/>

import * as jq from 'jquery';

class PageInjector {
    constructor(private jQuery: JQueryStatic) { }

    public injectPage(targetUrl: string, element?: any) {

        this.jQuery.ajax({
            dataType: "html",
            url: targetUrl,
            success: function (data) {
                if(element) {
                    jq(element).after(data);
                }else{
                    jq("body").append(data);
                }
            }
        });
    }
}

(($: JQueryStatic) => {
    const widget = new PageInjector($);
    widget.injectPage("https://s3-ap-southeast-2.amazonaws.com/widgets.oxipay.com.au/content/html/landing-page/landing-page-content.html", "#oxipay-landing-page");
})(jq);