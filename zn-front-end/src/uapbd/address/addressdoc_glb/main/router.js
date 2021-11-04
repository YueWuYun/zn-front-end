//Jd2y+qhYYLi1p942tboURnS76KoEXSLbKfBfpGam3ZHZoPBuN0QlU/QaBpV9m84t
import { asyncComponent } from 'nc-lightapp-front';
import addressdocglbList from '../list';

const addressdocglbCard = asyncComponent(() => import(/* webpackChunkName: "uapbd/address/addressdoc_glb/card/addressdocglbCard" */ /* webpackMode: "eager"  */'../card'));

const routes = [
    {
        path: '/',
        component: addressdocglbList,
        exact: true
    },
    {
        path: '/list',
        component: addressdocglbList
    },
    {
        path: '/card',
        component: addressdocglbCard
    }
];

export default routes;

//Jd2y+qhYYLi1p942tboURnS76KoEXSLbKfBfpGam3ZHZoPBuN0QlU/QaBpV9m84t