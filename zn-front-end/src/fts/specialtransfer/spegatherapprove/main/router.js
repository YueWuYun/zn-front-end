/*TZ8q/0LAp4WfJVPgyN7mAb8ilTwtNrV/YAORlOBXL9IJ+YrgguDYedlwBacai/R/*/
import {asyncComponent} from 'nc-lightapp-front';
import List from '../list';


const card = asyncComponent(() => import(/* webpackChunkName: "fts/specialtransfer/spegather/card/card" */ /* webpackMode: "eager" */ '../card'));
// const linkcard = asyncComponent(() => import('../linkcard'));
// const edit11 = asyncComponent(() => import(/* webpackChunkName: "reva_demo/module/apply/card/soCard" */'../../apply/card'));

// const appHome = asyncComponent(() => import(/* webpackChunkName: "demo/module/so/js/AppHome" */'pages/app/home'));
// const appMain = asyncComponent(() => import(/* webpackChunkName: "demo/module/so/js/AppMain" */'pages/app/main'));

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
	}
	// {
	// 	path: '/linkcard',
	// 	component: linkcard
	// }
];

export default routes;

/*TZ8q/0LAp4WfJVPgyN7mAb8ilTwtNrV/YAORlOBXL9IJ+YrgguDYedlwBacai/R/*/