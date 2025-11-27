/** @odoo-module **/

import { Pager } from "@web/core/pager/pager";
import { patch } from "@web/core/utils/patch";


patch(Pager.prototype, {
    setup(){
        super.setup();
        console.log("pager page called")
//        console.log(this.props.total)

    },



});