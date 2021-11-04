//Jd2y+qhYYLi1p942tboURnS76KoEXSLbKfBfpGam3ZHZoPBuN0QlU/QaBpV9m84t
import {asyncComponent} from 'nc-lightapp-front';
import CustGlbTable from '../main';

const  CustomerGlbCard = asyncComponent(()=>import(/*webpackChunkName:"uapbd/customer/customer_glb/edit/CustomerGlbCard"*/ /*webpackMode:"eager"*/'../edit'));
const routes = [
    {
        path:'/',
        component:CustGlbTable,
        exact:true
    },
    {
        path:'/list',
        component:CustGlbTable
    },
    {
        path:'/card',
        component:CustomerGlbCard
    }
    ]

export default routes;
//Jd2y+qhYYLi1p942tboURnS76KoEXSLbKfBfpGam3ZHZoPBuN0QlU/QaBpV9m84t