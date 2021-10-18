/*TZ8q/0LAp4WfJVPgyN7mAZ9BE6KMB9Uj6aa1doVwMKNzwcnbyEFZWLav3XnMfO4r*/
import { asyncComponent } from 'nc-lightapp-front';
import List from '../list';
const Card = asyncComponent(() => import(/* webpackChunkName: "cmp/apply/apply/card/card" *//* webpackMode: "eager" */'../card'));
const approvecard = asyncComponent(() => import(/* webpackChunkName: "cmp/apply/apply/approvecard/approvecard" *//* webpackMode: "eager" */'../approvecard'));
const ref21 = asyncComponent(() => import(/* webpackChunkName: "cmp/apply/apply/ref21/ref21" */'../ref21'));
const ref22 = asyncComponent(() => import(/* webpackChunkName: "cmp/apply/apply/ref22/ref22" */'../ref22'));
const ref23 = asyncComponent(() => import(/* webpackChunkName: "cmp/apply/apply/ref23/ref23" */'../ref23'));

/**
 * 定义路由
 */
const routes = [
    {
        path: '/',
        component: List,
        exact: true
    },
    {
        path: '/list',
        component: List
    },
    {
        path: '/card',
        component: Card
    },
    {
        path: '/ref21',
        component: ref21
    },
    {
        path: '/ref22',
        component: ref22
    },
    {
        path: '/ref23',
        component: ref23
    },
    {
        path: '/approvecard',
        component: approvecard
    }
];

export default routes;

/*TZ8q/0LAp4WfJVPgyN7mAZ9BE6KMB9Uj6aa1doVwMKNzwcnbyEFZWLav3XnMfO4r*/