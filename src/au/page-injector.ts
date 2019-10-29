///<reference path="../../typings/jquery/jquery.d.ts"/>

import * as jq from 'jquery';
import { Config } from "./config";

export class PageInjector {
    public static inject(url: string) {
        const htmlLink = Config.baseContentUrl + url;
        const element = jq(document.currentScript);
        jq.ajax({
            dataType: "html",
            url: htmlLink,
            success: function(data) {
                if (element) {
                    element.after(data);
                } else {
                    jq("body").append(data);
                }
            }
        });
    }
}
