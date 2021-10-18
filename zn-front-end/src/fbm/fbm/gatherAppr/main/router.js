/*TZ8q/0LAp4WfJVPgyN7mAdFhrxVe3C3ZqWDWT10iQaNHCWYrqPLpqbCZgebdSPez*/
import { asyncComponent } from 'nc-lightapp-front';

//应付单卡片
const card = asyncComponent(() => import(/*webpackChunkName:"/fbm/fbm/receivable/card/card"*/  /* webpackMode: "eager" */ '../card'));



const routes = [	
	{
		path: '/card',
		component: card
	}

];

export default routes;



/*TZ8q/0LAp4WfJVPgyN7mAdFhrxVe3C3ZqWDWT10iQaNHCWYrqPLpqbCZgebdSPez*/