//Jd2y+qhYYLi1p942tboURnS76KoEXSLbKfBfpGam3ZHZoPBuN0QlU/QaBpV9m84t
import { asyncComponent } from 'nc-lightapp-front';
import assigntemplateList from '../list';

const assigntemplatecard = asyncComponent(() => import(/* webpackChunkName: "uapbd/other/assigntemplate/card/assigntemplatecard" */ /* webpackMode: "eager"  */'../card'));

const routes = [
    {
        path: '/',
        component: assigntemplateList,
        exact: true
    },
    {
        path: '/list',
        component: assigntemplateList
    },
    {
        path: '/card',
        component: assigntemplatecard
    }
];

export default routes;

//Jd2y+qhYYLi1p942tboURnS76KoEXSLbKfBfpGam3ZHZoPBuN0QlU/QaBpV9m84t