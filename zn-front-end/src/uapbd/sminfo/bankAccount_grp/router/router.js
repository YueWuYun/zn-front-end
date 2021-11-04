//Jd2y+qhYYLi1p942tboURnS76KoEXSLbKfBfpGam3ZHZoPBuN0QlU/QaBpV9m84t
import {asyncComponent} from 'nc-lightapp-front';
import BankAccountGrp from '../main';
const  BankAccountCardGrp = asyncComponent(()=>import(/*webpackChunkName:"uapbd/sminfo/bankAccount_grp/edit/BankAccountCardGrp"*/ /*webpackMode:"eager"*/'../edit'));
const routes = [
    {
        path:'/',
        component:BankAccountGrp,
        exact:true
    },
    {
        path:'/list',
        component:BankAccountGrp
    },
    {
        path:'/card',
        component:BankAccountCardGrp
    }
    ]

export default routes;
//Jd2y+qhYYLi1p942tboURnS76KoEXSLbKfBfpGam3ZHZoPBuN0QlU/QaBpV9m84t