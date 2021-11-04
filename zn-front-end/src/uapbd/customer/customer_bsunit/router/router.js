//Jd2y+qhYYLi1p942tboURnS76KoEXSLbKfBfpGam3ZHZoPBuN0QlU/QaBpV9m84t
import {asyncComponent} from 'nc-lightapp-front';
import CustBusTable from '../main';

const  CustomerBsunitCard = asyncComponent(()=>import(/*webpackChunkName:"uapbd/customer/customer_bsunit/edit/CustomerBsunitCard"*/ /*webpackMode:"eager"*/'../edit'));
const routes = [
    {
        path:'/',
        component:CustBusTable,
        exact:true
    },
    {
        path:'/list',
        component:CustBusTable
    },
    {
        path:'/card',
        component:CustomerBsunitCard
    }
    ]

export default routes;
//Jd2y+qhYYLi1p942tboURnS76KoEXSLbKfBfpGam3ZHZoPBuN0QlU/QaBpV9m84t