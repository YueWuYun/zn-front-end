//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { asyncComponent } from 'nc-lightapp-front';
import {RenderRouter} from 'nc-lightapp-front';
import List from '../list/index';
//const List = asyncComponent(()=>import(/* webpackChunkName: "uapbd/pubinfo/formatdoc/list/list" *//* webpackMode: "eager" */'../list'));
const card = asyncComponent(()=>import(/* webpackChunkName: "uapbd/pubinfo/formatdoc/card/card" *//* webpackMode: "eager" */'../card'));
const routes = [
    {
        path : '/',
        component : List,
        exact : true
    },
    {
        path : '/list',
        component : List
    },
    {
        path : '/card',
        component : card
    }
];
(function main(routers,htmlTagid){  RenderRouter(routers,htmlTagid);})(routes,"app");

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65