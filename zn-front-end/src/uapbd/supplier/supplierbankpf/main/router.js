//Jd2y+qhYYLi1p942tboURnS76KoEXSLbKfBfpGam3ZHZoPBuN0QlU/QaBpV9m84t
import { asyncComponent } from 'nc-lightapp-front';
import supplierbankpfList from '../list';

const supplierbankpfcard = asyncComponent(() => import(/* webpackChunkName: "uapbd/supplier/supplierbankpf/card/supplierbankpfcard" */ /* webpackMode: "eager"  */'../card'));

const routes = [
    {
        path: '/',
        component: supplierbankpfList,
        exact: true
    },
    {
        path: '/list',
        component: supplierbankpfList
    },
    {
        path: '/card',
        component: supplierbankpfcard
    }
];

export default routes;

//Jd2y+qhYYLi1p942tboURnS76KoEXSLbKfBfpGam3ZHZoPBuN0QlU/QaBpV9m84t