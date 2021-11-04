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
	nodeName: '10141486-000033',
    nodetype: 'group',
    pageCode: '10141486_list',
    appid: '0001Z0100000000019BE',
    searchId: 'search',
    tableId: 'ic_setpart',
    oid: '1002Z81000000000HGVY',
    pk_item: 'pk_setpart',
    formId:'head',
    appcode:'10141486',
    template:'10141486_list',//模板编码
    defaultOrg:{}
}
let cardconfig = {
	nodeName: '10141486-000033',
    nodetype: 'group',
    pageCode: '10141486_card',
    appid: '0001Z0100000000019BE',
    treeId: 'materialtypetreeid',
    formId:'ic_setpart',
    tableId: 'ic_setpart_b',
    appcode:'10141486',
    template:'10141486_card',//模板编码
    defaultOrg:{}
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