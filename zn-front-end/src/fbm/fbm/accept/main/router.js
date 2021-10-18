/*TZ8q/0LAp4WfJVPgyN7mAdFhrxVe3C3ZqWDWT10iQaNHCWYrqPLpqbCZgebdSPez*/
import { asyncComponent } from 'nc-lightapp-front';
import List from '../list';
import ListLinkQ from '../listlinkq'
import CardLinkQ from '../cardlinkq'
import Card from '../card';
//const CardLinkQ = asyncComponent(() => import(/* webpackChunkName: "fbm/fbm/accept/card/cardlinkq" */'../cardlinkq'));

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
	,
	{
		path: '/cardlinkq',
		component: CardLinkQ
	},
	{
		path: '/listlinkq',
		component: ListLinkQ
	}
];

export default routes;

/*TZ8q/0LAp4WfJVPgyN7mAdFhrxVe3C3ZqWDWT10iQaNHCWYrqPLpqbCZgebdSPez*/