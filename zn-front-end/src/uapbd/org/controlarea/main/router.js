//Jd2y+qhYYLi1p942tboURnS76KoEXSLbKfBfpGam3ZHZoPBuN0QlU/QaBpV9m84t
import {asyncComponent} from 'nc-lightapp-front';
import List from '../list/index.js';


const card = asyncComponent(() => import(/* webpackChunkName: "resa/dutyVoucherMana/voucherEntery/card" */ /* webpackMode: "eager" */'../card/index.js'));
const routes = [
  {
    path: '/list',
    component: List,
    exact: true,
  }
  ,
  {
    path: '/card',//定义路由
    component: card,
  }

];

export default routes;

//Jd2y+qhYYLi1p942tboURnS76KoEXSLbKfBfpGam3ZHZoPBuN0QlU/QaBpV9m84t