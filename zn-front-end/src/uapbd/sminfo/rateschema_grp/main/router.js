//Jd2y+qhYYLi1p942tboURnS76KoEXSLbKfBfpGam3ZHZoPBuN0QlU/QaBpV9m84t
import {asyncComponent} from 'nc-lightapp-front';
import Listgrp from '../list';
const  Cardgrp = asyncComponent(()=>import(/* webpackChunkName: "uapbd/sminfo/rateschema_grp/card/Cardgrp" *//*webpackMode:"eager"*/'../card'));
const routes = [
    {
        path:'/',
        component:Listgrp,
        exact:true
    },
    {
        path:'/list',
        component:Listgrp
    },
    {
        path:'/card',
        component:Cardgrp
    }
    ]
export default routes;
//Jd2y+qhYYLi1p942tboURnS76KoEXSLbKfBfpGam3ZHZoPBuN0QlU/QaBpV9m84t