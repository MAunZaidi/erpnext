// Copyright (c) 2016, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.query_reports["Vehicles In Workshop"] = {
	filters: [
		{
			fieldname: "status",
			label: __("Vehicle Status"),
			fieldtype: "Select",
			options: [
				'All Vehicles',
				'In Stock Vehicles',
				'Delivered Vehicles',
			],
			default: 'All Vehicles'
		},
		{
			fieldname: "from_date",
			label: __("From Date"),
			fieldtype: "Date",
			reqd: 1,
			default: frappe.datetime.get_today()
		},
		{
			fieldname: "to_date",
			label: __("To Date"),
			fieldtype: "Date",
			reqd: 1,
			default: frappe.datetime.get_today()
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
			},
			on_change: function() {
				var variant_of = frappe.query_report.get_filter_value('variant_of');
				if(!variant_of) {
					frappe.query_report.set_filter_value('variant_of_name', "");
				} else {
					frappe.db.get_value("Item", variant_of, 'item_name', function(value) {
						frappe.query_report.set_filter_value('variant_of_name', value['item_name']);
					});
				}
			}
		},
		{
			"fieldname":"variant_of_name",
			"label": __("Model Name"),
			"fieldtype": "Data",
			"hidden": 1
		},
		{
			fieldname: "item_code",
			label: __("Variant Item Code"),
			fieldtype: "Link",
			options: "Item",
			get_query: function(asd) {
				var variant_of = frappe.query_report.get_filter_value('variant_of');
				var filters = {"is_vehicle": 1, "include_disabled": 1};
				if (variant_of) {
					filters['variant_of'] = variant_of;
				}
				return {
					query: "erpnext.controllers.queries.item_query",
					filters: filters
				};
			},
			on_change: function() {
				var item_code = frappe.query_report.get_filter_value('item_code');
				if(!item_code) {
					frappe.query_report.set_filter_value('item_name', "");
				} else {
					frappe.db.get_value("Item", item_code, 'item_name', function(value) {
						frappe.query_report.set_filter_value('item_name', value['item_name']);
					});
				}
			}
		},
		{
			"fieldname":"item_name",
			"label": __("Variant Item Name"),
			"fieldtype": "Data",
			"hidden": 1
		},
		{
			fieldname: "warehouse",
			label: __("Warehouse"),
			fieldtype: "Link",
			options: "Warehouse"
		},
		{
			fieldname: "item_group",
			label: __("Item Group"),
			fieldtype: "Link",
			options: "Item Group"
		},
		{
			fieldname: "brand",
			label: __("Brand"),
			fieldtype: "Link",
			options: "Brand"
		},
		{
			fieldname: "vehicle",
			label: __("Vehicle"),
			fieldtype: "Link",
			options: "Vehicle"
		},
		{
			fieldname: "vehicle_color",
			label: __("Vehicle Color"),
			fieldtype: "Link",
			options: "Vehicle Color"
		},
		{
			fieldname: "vehicle_booking_order",
			label: __("Vehicle Booking Order"),
			fieldtype: "Link",
			options: "Vehicle Booking Order"
		},
		{
			fieldname: "customer",
			label: __("Customer (User)"),
			fieldtype: "Link",
			options: "Customer",
			get_query: function() {
				return {
					query: "erpnext.controllers.queries.customer_query"
				};
			}
		},
		{
			fieldname: "vehicle_owner",
			label: __("Vehicle Owner"),
			fieldtype: "Link",
			options: "Customer",
			get_query: function() {
				return {
					query: "erpnext.controllers.queries.customer_query"
				};
			}
		},
		{
			fieldname: "group_by_1",
			label: __("Group By Level 1"),
			fieldtype: "Select",
			options: ["Ungrouped", "Group by Model", "Group by Variant", "Group by Item Group", "Group by Brand", "Group by Warehouse"],
			default: "Ungrouped"
		},
		{
			fieldname: "group_by_2",
			label: __("Group By Level 2"),
			fieldtype: "Select",
			options: ["Ungrouped", "Group by Model", "Group by Variant", "Group by Item Group", "Group by Brand", "Group by Warehouse"],
			default: "Ungrouped"
		},
		{
			fieldname: "show_customer_in_print",
			label: __("Show Customer In Print"),
			fieldtype: "Check",
			default: 1,
			on_change: function() { return false; }
		},
	],
	formatter: function(value, row, column, data, default_formatter) {
		var style = {};

		if (column.fieldname === "status" && data.status_color) {
			style['color'] = data.status_color;
		}

		if (cint(data.has_return)) {
			style['background-color'] = '#ffe2a7';
		}

		return default_formatter(value, row, column, data, {css: style});
	}
};