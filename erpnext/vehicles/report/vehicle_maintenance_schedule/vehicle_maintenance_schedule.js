// Copyright (c) 2016, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.query_reports["Vehicle Maintenance Schedule"] = {
	"filters": [
		{
			fieldname: "company",
			label: __("Company"),
			fieldtype: "Link",
			options: "Company",
			default: frappe.defaults.get_user_default("Company"),
			reqd: 1
		},
		{
			fieldname: "date_type",
			label: __("Date Type"),
			fieldtype: "Select",
			options: ["Reminder Date", "Service Due Date"],
			default: "Reminder Date",
			reqd: 1,
		},
		{
			"fieldname":"from_date",
			"label": __("From Date"),
			"fieldtype": "Date",
			"default": frappe.datetime.get_today(),
			"reqd": 1
		},
		{
			"fieldname":"to_date",
			"label": __("To Date"),
			"fieldtype": "Date",
			"default": frappe.datetime.get_today(),
			"reqd": 1
		},
		{
			"fieldname":"project_template",
			"label": __("Project Template"),
			"fieldtype": "Link",
			"options": "Project Template"
		},
		{
			"fieldname":"project_template_category",
			"label": __("Project Template Category"),
			"fieldtype": "Link",
			"options": "Project Template Category"
		},
		{
			fieldname: "customer",
			label: __("Customer"),
			fieldtype: "Link",
			options: "Customer",
			get_query: function() {
				return {
					query: "erpnext.controllers.queries.customer_query"
				};
			}
		},
		{
			fieldname: "customer_group",
			label: __("Customer Group"),
			fieldtype: "Link",
			options: "Customer Group"
		},
		{
			fieldname: "variant_of",
			label: __("Model Item Code"),
			fieldtype: "Link",
			options: "Item",
			get_query: function() {
				return {
					query: "erpnext.controllers.queries.item_query",
					filters: {"is_vehicle": 1, "has_variants": 1, "include_disabled": 1}
				};
			}
		},
		{
			fieldname: "item_code",
			label: __("Variant Item Code"),
			fieldtype: "Link",
			options: "Item",
			get_query: function() {
				var variant_of = frappe.query_report.get_filter_value('variant_of');
				var filters = {"is_vehicle": 1, "include_disabled": 1};
				if (variant_of) {
					filters['variant_of'] = variant_of;
				}
				return {
					query: "erpnext.controllers.queries.item_query",
					filters: filters
				};
			}
		},
		{
			fieldname: "item_group",
			label: __("Item Group"),
			fieldtype: "Link",
			options: "Item Group"
		},
	],

	onChange: function(new_value, column, data, rowIndex) {
		if (column.fieldname == "remarks") {
			if (cstr(data['remarks']) === cstr(new_value)) {
				return
			}

			if (!data.opportunity) {
				setTimeout(() => {
					erpnext.utils.query_report_local_refresh();
					frappe.msgprint(__("Opportunity does not exist"));
				});
				return;
			}

			return frappe.call({
				method: "erpnext.crm.doctype.opportunity.opportunity.submit_communication",
				args: {
					remarks: new_value,
					name: data.opportunity,
					contact_date: frappe.datetime.get_today()
				},
				callback: function() {
					frappe.query_report.datatable.datamanager.data[rowIndex].contact_date = frappe.datetime.get_today();
					frappe.query_report.datatable.datamanager.data[rowIndex].remarks = new_value;
					erpnext.utils.query_report_local_refresh()
				},
				error: function() {
					erpnext.utils.query_report_local_refresh()
				},
			});
		}
	},
};
