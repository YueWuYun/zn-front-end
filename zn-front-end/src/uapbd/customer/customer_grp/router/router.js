//Jd2y+qhYYLi1p942tboURnS76KoEXSLbKfBfpGam3ZHZoPBuN0QlU/QaBpV9m84t
import {asyncComponent} from 'nc-lightapp-front';
import CustGrpTable from '../main';
const  CustomerGrpCard = asyncComponent(()=>import(/*webpackChunkName:"uapbd/customer/customer_glb/edit/CustomerGrpCard"*/ /*webpackMode:"eager"*/'../edit'));
const routes = [
    {
        path:'/',
        component:CustGrpTable,
        exact:true
    },
    {
        path:'/list',
        component:CustGrpTable
    },
    {
        path:'/card',
        component:CustomerGrpCard
    }]
export default routes;
//Jd2y+qhYYLi1p942tboURnS76KoEXSLbKfBfpGam3ZHZoPBuN0QlU/QaBpV9m84t