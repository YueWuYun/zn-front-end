//Jd2y+qhYYLi1p942tboURnS76KoEXSLbKfBfpGam3ZHZoPBuN0QlU/QaBpV9m84t
import {asyncComponent} from 'nc-lightapp-front';
import BankAccountForg from '../main';
const  BankAccountCardForg = asyncComponent(()=>import(/*webpackChunkName:"uapbd/sminfo/bankAccount_forg/edit/BankAccountCardForg"*/ /*webpackMode:"eager"*/'../edit'));
const routes = [{
        path:'/',
        component:BankAccountForg,
        exact:true
    },
    {
        path:'/list',
        component:BankAccountForg
    },
    {
        path:'/card',
        component:BankAccountCardForg
    }]
export default routes;
//Jd2y+qhYYLi1p942tboURnS76KoEXSLbKfBfpGam3ZHZoPBuN0QlU/QaBpV9m84t