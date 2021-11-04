//Jd2y+qhYYLi1p942tboURnS76KoEXSLbKfBfpGam3ZHZoPBuN0QlU/QaBpV9m84t
import {asyncComponent } from 'nc-lightapp-front';
import UserList from '../list';

const acccard = asyncComponent(() => import(/* webpackChunkName: "uap/rbac/user/card/card" *//* webpackMode: "eager" */'../acccard'));
const liacard = asyncComponent(() => import(/* webpackChunkName: "uap/rbac/user/card/card" *//* webpackMode: "eager" */'../liacard'));

const routes = [
	{
		path: '/',
		component: UserList,
		exact: true
	},
	{
		path: '/list',
		component: UserList
	},
	{
		path: '/acccard',
		component: acccard
	},
	{
		path: '/liacard',
		component: liacard
	}
];

export default routes;

//Jd2y+qhYYLi1p942tboURnS76KoEXSLbKfBfpGam3ZHZoPBuN0QlU/QaBpV9m84t