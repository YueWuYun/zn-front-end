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
}
let cardconfig = {
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