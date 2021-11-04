//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { asyncComponent } from 'nc-lightapp-front';
import {RenderRouter} from 'nc-lightapp-front';
import Orgtable from '../list';

const Orgcard = asyncComponent(() => import(/* webpackChunkName: "uapbd/org/orgunit/card/orgunitcard" */ /* webpackMode: "eager" */'../card'));
const Orgversion = asyncComponent(() => import(/* webpackChunkName: "uapbd/org/orgunit/version/orgunitversion" */ /* webpackMode: "eager" */'../version'));

const routes = [{
    path:'/',
    component : Orgtable,
    exact : true
},
{
    path:'/list',
    component : Orgtable
},{
    path : '/card',
    component : Orgtable
},{
    path:'/version',
    component : Orgversion
},];

(function main(routers,htmlTagid){  RenderRouter(routers,htmlTagid);})(routes,"app");
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65