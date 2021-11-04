//Jd2y+qhYYLi1p942tboURnS76KoEXSLbKfBfpGam3ZHZoPBuN0QlU/QaBpV9m84t
import {asyncComponent} from 'nc-lightapp-front';
import List from '../list';
const  Card = asyncComponent(()=>import(/* webpackChunkName: "uapbd/org/orgrole/card/Card" */'../card'));
const routes = [
    {
        path:'/',
        component:List,
        exact:true
    },
    {
        path:'/list',
        component:List
    },
    {
        path:'/card',
        component:Card
    }
    ]
export default routes;
//Jd2y+qhYYLi1p942tboURnS76KoEXSLbKfBfpGam3ZHZoPBuN0QlU/QaBpV9m84t