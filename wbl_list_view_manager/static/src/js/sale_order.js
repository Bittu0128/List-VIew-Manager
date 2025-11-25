/** @odoo-module **/
import { ListRenderer } from "@web/views/list/list_renderer";
import { patch } from "@web/core/utils/patch";

patch(ListRenderer.prototype, {
    super(){
        super.setup();
    },

    get isShowModels() {
        return this.props.list.resModel === 'sale.order' ||
               this.props.list.resModel === 'product.template'
    },

    getColumns(_record) {

        return this.columns;
    },

    onFilterInputChange(ev) {
        const value = ev.target.value;
        const columnName = ev.target.dataset.column;
        const rangeType = ev.target.dataset.range;

        if (!this.filters) {
            this.filters = {};
        }

        if (rangeType) {
            if (!this.filters[columnName]) {
                this.filters[columnName] = {};
            }
            this.filters[columnName][rangeType] = value;
        } else {
            this.filters[columnName] = value;
        }

        console.log("🔥 ACTIVE FILTERS:", this.filters);

        this.render(true);
    },

    getRowClass(record) {
        const base = super.getRowClass(record) || "";
        const classes = [base];
        console.log("all data:", record.data);

        if (this.filters) {
            let hide = false;

            for (const col in this.filters) {
                const filterVal = this.filters[col];
                console.log("Checking column:", col);
                console.log("Filter value:", filterVal);

                // Check if the column is a Many-to-One (M2O) field
                if (record.data[col] && typeof record.data[col] === 'object') {
                    // Log the full object for inspection
                    console.log("record.data[col] is an object:", record.data[col]);

                    // Try accessing 'name' or 'id' for M2O fields like user_id
                    const recVal = record.data[col].display_name || record.data[col].id;

                    console.log("recVal for M2O field:", recVal);

                    if (recVal === false || recVal === undefined) {
                        hide = true;
                    } else {
                        if (!String(recVal).toLowerCase().includes(String(filterVal).toLowerCase())) {
                            hide = true;
                        }
                    }
                }

                // Handle other normal fields (text or number filter)
                else if (typeof filterVal === "object") {
                    const min = filterVal.min ? parseFloat(filterVal.min) : null;
                    const max = filterVal.max ? parseFloat(filterVal.max) : null;
                    const recVal = parseFloat(record.data[col] || 0);

                    if (min !== null && recVal < min) hide = true;
                    if (max !== null && recVal > max) hide = true;
                }
                else {
                    const recVal = record.data[col];

                    if (recVal === false || recVal === undefined) {
                        hide = true;
                    } else {
                        if (!String(recVal).toLowerCase().includes(String(filterVal).toLowerCase())) {
                            hide = true;
                        }
                    }
                }
            }

            if (hide) {
                classes.push("hide-row");
            }
        }
        return classes.join(" ");
    },

});