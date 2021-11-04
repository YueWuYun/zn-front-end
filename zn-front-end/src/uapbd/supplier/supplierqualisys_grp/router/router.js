//Jd2y+qhYYLi1p942tboURnS76KoEXSLbKfBfpGam3ZHZoPBuN0QlU/QaBpV9m84t
import React, { Component } from 'react';
import {asyncComponent} from 'nc-lightapp-front'

import Main from '../main'
import List from '../list'
import Card from '../card'

class MainOne extends Component {
    render() {
        return (<Main {...{config: mainconfig}}/>)
    }
}

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

let mainconfig = {
    nodeName: '10140SAQSG-000056',
    nodetype: 'group',
    pageCode: '10140SAQSG_qualidoc_card',
    appid: '0001Z010000000001NMZ',
    treeId: 'materialtypetreeid',
    formId:'supqualidoc',
    typeFormId:'supqualitype',
    appcode:'10140SAQSG_GRP',
    tableId:'supqualilevel',
    template:'10140SAQSG_qualidoc_card',
    defaultOrg:{}
}
let listconfig = {
    nodeName: '10140SAQSG-000056',
    nodetype: 'group',
    pageCode: '10140SAQSG_qualidoc_list',
    appid: '0001Z010000000001NMZ',
    searchId: 'search',
    tableId: 'supqualidoc',
    oid: '1002Z81000000000HGVY',
    pk_item: 'pk_supqualidoc',
    appcode:'10140SAQSG_GRP',
    formId:'supqualidoc',
    template:'10140SAQSG_qualidoc_list',
    defaultOrg:{}
}
let cardconfig = {
    nodeName: '10140SAQSG-000056',
    nodetype: 'group',
    pageCode: '10140SAQSG_qualidoc_listcard',
    appid: '0001Z010000000001NMZ',
    treeId: 'materialtypetreeid',
    formId:'supqualidoc',
    appcode:'10140SAQSG_GRP',
    tableId: 'supqualilevel',
    template:'10140SAQSG_qualidoc_listcard',
    defaultOrg:{}
}

const routes = [
    {
        path: '/',
        component: MainOne,
        exact: true
    },
    {
        path: '/main',
        component: MainOne
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