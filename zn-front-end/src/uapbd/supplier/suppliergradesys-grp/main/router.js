//Jd2y+qhYYLi1p942tboURnS76KoEXSLbKfBfpGam3ZHZoPBuN0QlU/QaBpV9m84t
import React, { Component } from 'react';
import {asyncComponent} from 'nc-lightapp-front'

import List from '../list'
import Card from '../card'

class ListOne extends Component {
    render() {
        return (<List {...{config: listconfig}}/>)
    }
}

class CardOne extends Component {
    render() {
        return (<Card {...{config: cardconfig}}/>)
    }
}

const card =  asyncComponent(() => {return CardOne})

let listconfig = {
    nodeName: '10140SGRADEG-000043',
    nodetype: 'group',
    pageCode: '10140SGRADEG_bsgrade_list',
    appid: '0001Z010000000001L2L',
    searchId: 'search',
    tableId: 'supplier_grade_sys',
    oid: '1002Z81000000000HGVY',
    pk_item: 'pk_suppliergrade',
    formId:'head',
    appcode:'10140SGRADEG'
}
let cardconfig = {
    nodeName: '10140SGRADEG-000043',
    nodetype: 'group',
    pageCode: '10140SGRADEG_bsgrade_card',
    appid: '0001Z010000000001L2L',
    treeId: 'materialtypetreeid',
    formId:'supplier_grade_sys',
    tableId: 'supgrade',
    appcode:'10140SGRADEG'
}

const routes = [
    {
        path: '/',
        component: ListOne,
        exact: true
    },
    {
        path: '/list',
        component: ListOne
    },
    {
        path: '/card',
        component: CardOne
    }
]

export default routes
//Jd2y+qhYYLi1p942tboURnS76KoEXSLbKfBfpGam3ZHZoPBuN0QlU/QaBpV9m84t