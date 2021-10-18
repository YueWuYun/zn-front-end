/*TZ8q/0LAp4WfJVPgyN7mAdFhrxVe3C3ZqWDWT10iQaNHCWYrqPLpqbCZgebdSPez*/
import { asyncComponent } from 'nc-lightapp-front';
import List from '../list';

const Card = asyncComponent(() => import(/* webpackChunkName: "icdmc/innerdebitcontract/card/card" */ '../card'));
// const linkcard = asyncComponent(() => import(/* webpackChunkName: "icdmc/innerdebitcontract/linkcard/linkcard" */ '../linkcard'));

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
	}
	// {
	// 	path: '/linkcard',
	// 	component: linkcard
	// }
	
];

export default routes;

/*TZ8q/0LAp4WfJVPgyN7mAdFhrxVe3C3ZqWDWT10iQaNHCWYrqPLpqbCZgebdSPez*/