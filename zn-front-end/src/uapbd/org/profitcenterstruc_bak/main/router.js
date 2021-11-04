//Jd2y+qhYYLi1p942tboURnS76KoEXSLbKfBfpGam3ZHZoPBuN0QlU/QaBpV9m84t
import { asyncComponent } from 'nc-lightapp-front';
import ProfitCenterstrucTable from '../list/index';
const card = asyncComponent(() => import(/* webpackChunkName: "uap/rbac/adminRole/card/card" *//* webpackMode: "eager" */'../card/index'));
const routes = [
    {
        path : '/',
        component : ProfitCenterstrucTable,
        exact : true
    },
    {
        path : '/list',
        component : ProfitCenterstrucTable
    },
    {
        path : '/card',
        component : card
    }
];
export default routes;
//Jd2y+qhYYLi1p942tboURnS76KoEXSLbKfBfpGam3ZHZoPBuN0QlU/QaBpV9m84t