//Jd2y+qhYYLi1p942tboURnS76KoEXSLbKfBfpGam3ZHZoPBuN0QlU/QaBpV9m84t
/**
 *成本中心
 */

import {asyncComponent} from 'nc-lightapp-front';
import ListPage from '../card/index.js';


// const card = asyncComponent(() => import(/* webpackChunkName: "resa/dutyVoucherMana/voucherEntery/card" */ /* webpackMode: "eager" */'../card/index.js'));
const routes = [
  {
    path: '/list',
    component: ListPage,
    exact: true,
  }
];

export default routes;

//Jd2y+qhYYLi1p942tboURnS76KoEXSLbKfBfpGam3ZHZoPBuN0QlU/QaBpV9m84t