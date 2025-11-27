# -*- coding: utf-8 -*-
#
#################################################################################
# Author      : Weblytic Labs Pvt. Ltd. (<https://store.weblyticlabs.com/>)
# Copyright(c): 2023-Present Weblytic Labs Pvt. Ltd.
# All Rights Reserved.
#
#
# This program is copyright property of the author mentioned above.
# You can`t redistribute it and/or modify it.
##################################################################################

{
    'name': 'List View Manager',
    'version': '19.0.1.0.0',
    "sequence": 1,
    'summary': """""",
    'description': """""",
    'category': '',
    'author': 'Weblytic Labs',
    'company': 'Weblytic Labs',
    'website': "https://store.weblyticlabs.com",
    'depends': ['base', 'web', 'account', 'website', 'website_sale', 'sale_management'],
    # 'price': 99,
    # 'currency': 'USD',
    'data': [
        # 'views/',
    ],
    'assets': {
        'web.assets_backend': [
            'wbl_list_view_manager/static/src/xml/sale_order_views.xml',
            'wbl_list_view_manager/static/src/js/sale_order.js',
            'wbl_list_view_manager/static/src/js/inherit_pager.js',
            'wbl_list_view_manager/static/src/css/style.css',
        ],
    },
    'license': 'OPL-1',
    'installable': True,
    'auto_install': False,
    'application': True,
}
