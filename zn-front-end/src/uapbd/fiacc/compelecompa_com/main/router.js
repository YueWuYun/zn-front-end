//Jd2y+qhYYLi1p942tboURnS76KoEXSLbKfBfpGam3ZHZoPBuN0QlU/QaBpV9m84t
import {asyncComponent} from 'nc-lightapp-front';
import JobEditTable from '../list/index.js';


const card = asyncComponent(() => import(/* webpackChunkName: "uapbd/fiacc/compelecompa_grp/card" */ /* webpackMode: "eager" */'../card/index.js'));

const routes = [
  {
    path: '/list',
    component: JobEditTable,
    exact: true,
  },
  {
    path: '/card',//定义路由
    component: card,
  }
];

export default routes;

//Jd2y+qhYYLi1p942tboURnS76KoEXSLbKfBfpGam3ZHZoPBuN0QlU/QaBpV9m84t