//Jd2y+qhYYLi1p942tboURnS76KoEXSLbKfBfpGam3ZHZoPBuN0QlU/QaBpV9m84t
import {asyncComponent} from 'nc-lightapp-front';
import Listorg from '../list';
const  Cardorg = asyncComponent(()=>import(/* webpackChunkName: "uapbd/sminfo/rateschema_org/card/Cardorg" *//*webpackMode:"eager"*/'../card'));
const routes = [
    {
        path:'/',
        component:Listorg,
        exact:true
    },
    {
        path:'/list',
        component:Listorg
    },
    {
        path:'/card',
        component:Cardorg
    }
    ]
export default routes;
//Jd2y+qhYYLi1p942tboURnS76KoEXSLbKfBfpGam3ZHZoPBuN0QlU/QaBpV9m84t