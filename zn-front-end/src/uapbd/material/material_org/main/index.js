//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { asyncComponent,RenderRouter } from 'nc-lightapp-front';
import Materialorglist from '../list';

const Materialorgcard = asyncComponent(() => import(/* webpackChunkName: "uapbd/material/material_org/Materialorgcard" */ /* webpackMode:"eager" */ '../card'));

const routes = [{
    path:'/',
    component : Materialorglist,
    exact : true
},{
    path:'/list',
    component : Materialorglist
},{
    path : '/card',
    component : Materialorgcard
}];

(function main(routers,htmlTagid){  RenderRouter(routers,htmlTagid);})(routes,"app");
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65