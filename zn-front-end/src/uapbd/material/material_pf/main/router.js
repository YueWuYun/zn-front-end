//Jd2y+qhYYLi1p942tboURnS76KoEXSLbKfBfpGam3ZHZoPBuN0QlU/QaBpV9m84t
import { asyncComponent } from 'nc-lightapp-front';
import materialpfList from '../list';

const materialpfcard = asyncComponent(() => import(/* webpackChunkName: "uapbd/material/material_pf/card/materialpfcard" */ /* webpackMode: "eager"  */'../card'));

const routes = [
    {
        path: '/',
        component: materialpfList,
        exact: true
    },
    {
        path: '/list',
        component: materialpfList
    },
    {
        path: '/card',
        component: materialpfcard
    }
];

export default routes;

//Jd2y+qhYYLi1p942tboURnS76KoEXSLbKfBfpGam3ZHZoPBuN0QlU/QaBpV9m84t