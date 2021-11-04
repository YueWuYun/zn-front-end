//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { asyncComponent,RenderRouter } from 'nc-lightapp-front';
import Materialgrplist from '../list';

const Materialgrpcard = asyncComponent(() => import(/* webpackChunkName: "uapbd/material/material_grp/Materialgrpcard" */ /* webpackMode:"eager" */ '../card'));

const routes = [{
    path:'/',
    component : Materialgrplist,
    exact : true
},{
    path:'/list',
    component : Materialgrplist
},{
    path : '/card',
    component : Materialgrpcard
}];

(function main(routers,htmlTagid){  RenderRouter(routers,htmlTagid);})(routes,"app");
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65