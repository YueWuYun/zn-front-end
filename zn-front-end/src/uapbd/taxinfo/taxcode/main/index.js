//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { asyncComponent } from 'nc-lightapp-front';
import {RenderRouter} from 'nc-lightapp-front';
import TaxCodeList from '../list';

const TaxCodeCard = asyncComponent(() => import(/* webpackChunkName: "uapbd/taxinfo/taxcode/card/TaxcodeCard" */ /* webpackMode: "eager" */'../card'));

const routes = [{
    path:'/',
    component : TaxCodeList,
    exact : true
},
{
    path:'/list',
    component : TaxCodeList
},{
    path : '/card',
    component : TaxCodeCard
}];

(function main(routers,htmlTagid){  RenderRouter(routers,htmlTagid);})(routes,"app");
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65