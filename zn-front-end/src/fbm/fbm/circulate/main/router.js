/*TZ8q/0LAp4WfJVPgyN7mAdFhrxVe3C3ZqWDWT10iQaNHCWYrqPLpqbCZgebdSPez*/
import { asyncComponent } from 'nc-lightapp-front';
const card = asyncComponent(() => import(/* webpackChunkName: "fbm/fbm/circulate/card/card" */ /* webpackMode: "eager" */'../card'));

const routes = [
	{
		path: '/',
		component: card,
		exact: true
	},
	{
		path: '/card',
		component: card
	},
	
];

export default routes;

/*TZ8q/0LAp4WfJVPgyN7mAdFhrxVe3C3ZqWDWT10iQaNHCWYrqPLpqbCZgebdSPez*/