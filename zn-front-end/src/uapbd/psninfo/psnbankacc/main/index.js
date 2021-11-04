//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { asyncComponent } from 'nc-lightapp-front';
import {RenderRouter} from 'nc-lightapp-front';
import PsnbankaccSimpleTable from '../list';

const PsnbankaccCard = asyncComponent(() => import(/* webpackChunkName: "uapbd/org/orgunit/card/orgunitcard" */ /* webpackMode: "eager" */'../card'));

const routes = [{
    path:'/',
    component : PsnbankaccSimpleTable,
    exact : true
},
{
    path:'/list',
    component : PsnbankaccSimpleTable
},{
    path : '/card',
    component : PsnbankaccCard
}];

(function main(routers,htmlTagid){  RenderRouter(routers,htmlTagid);})(routes,"app");
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65