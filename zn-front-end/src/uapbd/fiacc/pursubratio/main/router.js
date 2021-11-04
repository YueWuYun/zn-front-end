//Jd2y+qhYYLi1p942tboURnS76KoEXSLbKfBfpGam3ZHZoPBuN0QlU/QaBpV9m84t
import {asyncComponent} from 'nc-lightapp-front';
import List from '../list';


const card = asyncComponent(() => import(/* webpackChunkName: "uapbd/fiacc/pursubratio/card/card" */ /* webpackMode: "eager" */'../card'));

const routes = [
  {
    path: '/list',
    component: List,
    exact: true,
  },
  {
    path: '/card',
    component: card,
  }
];

export default routes;

//Jd2y+qhYYLi1p942tboURnS76KoEXSLbKfBfpGam3ZHZoPBuN0QlU/QaBpV9m84t