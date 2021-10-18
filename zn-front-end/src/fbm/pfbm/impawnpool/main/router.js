/*TZ8q/0LAp4WfJVPgyN7mAdFhrxVe3C3ZqWDWT10iQaNHCWYrqPLpqbCZgebdSPez*/
import { asyncComponent } from 'nc-lightapp-front';
import List from '../list';
const card = asyncComponent(() => import(/* webpackChunkName: "fbm/pfbm/impawnpool/card" */ /* webpackMode: "eager" */'../card'));
const ref21 = asyncComponent(() => import(/* webpackChunkName: "fbm/pfbm/impawnpool/ref21" */ /* webpackMode: "eager" */'../ref21'));
const ref22 = asyncComponent(() => import(/* webpackChunkName: "fbm/pfbm/impawnpool/ref22" */ /* webpackMode: "eager" */'../ref22'));
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
		component: card
	},
	{
		path: '/ref21',
		component: ref21
	},
	{
		path: '/ref22',
		component: ref22
	}
	
];

export default routes;

/*TZ8q/0LAp4WfJVPgyN7mAdFhrxVe3C3ZqWDWT10iQaNHCWYrqPLpqbCZgebdSPez*/