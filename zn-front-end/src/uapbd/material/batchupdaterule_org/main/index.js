//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { asyncComponent,RenderRouter } from 'nc-lightapp-front';
import Batchupdaterulelist from '../list';

const Batchupdaterulecard = asyncComponent(() => import(/* webpackChunkName: "uapbd/material/batchupdaterule_org/Batchupdaterulecard" */ /* webpackMode:"eager" */ '../card'));

const routes = [{
    path:'/',
    component : Batchupdaterulelist,
    exact : true
},{
    path:'/list',
    component : Batchupdaterulelist
},{
    path : '/card',
    component : Batchupdaterulecard
}];

(function main(routers,htmlTagid){  RenderRouter(routers,htmlTagid);})(routes,"app");
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65