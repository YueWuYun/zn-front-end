//Jd2y+qhYYLi1p942tboURnS76KoEXSLbKfBfpGam3ZHZoPBuN0QlU/QaBpV9m84t
import { asyncComponent } from 'nc-lightapp-front';
import AddressdocgrpList from '../list';

//const AddressdocgrpList = asyncComponent(() => import(/* webpackChunkName: "uapbd/address/addressdoc_grp/list/addressdocgrpList" */ /* webpackMode: "eager"  */'../list'));
const AddressdocgrpCard = asyncComponent(() => import(/* webpackChunkName: "uapbd/address/addressdoc_grp/card/addressdocgrpCard" */ /* webpackMode: "eager"  */'../card'));

const routes = [
    {
        path: '/',
        component: AddressdocgrpList,
        exact: true
    },
    {
        path: '/list',
        component: AddressdocgrpList
    },
    {
        path: '/card',
        component: AddressdocgrpCard
    }
];

export default routes;

//Jd2y+qhYYLi1p942tboURnS76KoEXSLbKfBfpGam3ZHZoPBuN0QlU/QaBpV9m84t