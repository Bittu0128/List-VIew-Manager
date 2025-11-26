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
//        console.log(this.columns)
//        console.log(this.columns.map(item => item.name))
//        console.log(this.columns.map(item => item.fieldType))
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
//        console.log("all data:", record.data);

        if (this.filters) {
            let hide = false;

            for (const col in this.filters) {
                const filterVal = this.filters[col];
                console.log("Checking column:", col, typeof col);
                console.log("Filter value:", filterVal, typeof filterVal);

                // Check if the column is a Many-to-One (M2O) field
                if (record.data[col] && typeof record.data[col] === 'object') {
                    console.log("if condition called")

                    if (col === 'tag_ids'){
                        console.log("super if inside if condition")

                        const staticListValue = record.data[col];
                        const allDisplayNames = staticListValue.records.map(r => {
                            return r.data.display_name;
                        });

                        console.log("All Display Names:", allDisplayNames);
                        // output = ['Product', 'Services', 'Information'] array aata hs isme yrr

                        const filterString = String(filterVal).toLowerCase();

                        if (!filterString) {
                            hide = false;
                        } else {
                            const isMatch = allDisplayNames.some(displayName => {
                                const nameString = String(displayName || '').toLowerCase();
                                return nameString.includes(filterString);
                            });
                            if (!isMatch) {
                                hide = true;
                            } else {
                                hide = false;
                            }
                        }

                    }

//                    else if (col === 'date_order'){
                    else if (["date_order", "validity_date", "commitment_date", "expected_date"].includes(col)){
                        console.log("Date-Only Filter Applied (Normalized Native Date) for:", col);

                        const recordDateTime = record.data[col];
                        let recordTs = null;

                        if (recordDateTime instanceof Date) {
                            recordDateTime.setHours(0, 0, 0, 0);
                            recordTs = recordDateTime.getTime();
                        } else if (recordDateTime && typeof recordDateTime.ts === 'number') {
                            const dateFromTs = new Date(recordDateTime.ts);
                            dateFromTs.setHours(0, 0, 0, 0);
                            recordTs = dateFromTs.getTime();
                        }

                        console.log("Normalized Record Date Timestamp (ms):", recordTs);

                        if (recordTs === null || isNaN(recordTs)) {
                            hide = true;
                            return;
                        }


                        const minInput = filterVal.min;
                        const maxInput = filterVal.max;

                        let minTs = null;
                        let maxTs = null;

                        if (minInput) {
                            const minDate = new Date(minInput);
                            minDate.setHours(0, 0, 0, 0);
                            if (!isNaN(minDate.getTime())) {
                                minTs = minDate.getTime();
                            }
                        }

                        if (maxInput) {
                            const maxDate = new Date(maxInput);
                            maxDate.setHours(0, 0, 0, 0);

                            if (!isNaN(maxDate.getTime())) {
                                maxTs = maxDate.getTime();
                            }
                        } else {
                            // ✅ नया लॉजिक: यदि maxInput नहीं दिया गया है, तो आज की तारीख का उपयोग करें
                            const today = new Date();
                            today.setHours(0, 0, 0, 0); // आज को 00:00:00 पर सेट करें
                            maxTs = today.getTime();
                            console.log("Max date not provided. Defaulting to start of today:", new Date(maxTs));
                        }


                        if (minTs !== null && recordTs < minTs) {
                            console.log("Hidden: Record is before min date.");
                            hide = true;
                        }

                        else if (maxTs !== null && recordTs > maxTs) {
                            console.log("Hidden: Record is after max date (i.e., tomorrow or later).");
                            hide = true;
                        }

                        else {
                            console.log("Visible: Record is within the range.");
                            hide = false;
                        }
                    }

                    else {
//                        console.log("record.data[col] is an object:", record.data[col]);

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

                }

                // Handle other normal fields (text or number filter)
                else if (typeof filterVal === "object") {
                    console.log("elsif condition")
                    const min = filterVal.min ? parseFloat(filterVal.min) : null;
                    const max = filterVal.max ? parseFloat(filterVal.max) : null;
                    const recVal = parseFloat(record.data[col] || 0);

                    if (min !== null && recVal < min) hide = true;
                    if (max !== null && recVal > max) hide = true;
                }
                else {
                    console.log("else condition")
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