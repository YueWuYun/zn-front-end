/*TZ8q/0LAp4WfJVPgyN7mAboKJ+mmUJrmigcdKIYMeQGGLNFXHHPngbPp1qdoMokR*/
import { asyncComponent } from 'nc-lightapp-front';
import List from '../list';

const card = asyncComponent(() => import(/* webpackChunkName: "sf/allocation/allocate_pay/card/card" */ /* webpackMode: "eager" */'../card'));
// const ref4C = asyncComponent(() => import('../ref4C'));
// const ref30 = asyncComponent(() => import('../ref30'));
// const ref4310 = asyncComponent(() => import('../ref4310'));
// const ref21 = asyncComponent(() => import('../ref21'));
// const refZ3 = asyncComponent(() => import('../refZ3'));

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
	// {
	// 	path: '/ref4C',
	// 	component: ref4C
	// },
	// {
	// 	path: '/ref30',
	// 	component: ref30
	// },
	// {
	// 	path: '/ref4310',
	// 	component: ref4310
	// },
	// {
	// 	path: '/ref21',
	// 	component: ref21
	// },
	// {
	// 	path: '/refZ3',
	// 	component: refZ3
	// }
];

export default routes;

/*TZ8q/0LAp4WfJVPgyN7mAboKJ+mmUJrmigcdKIYMeQGGLNFXHHPngbPp1qdoMokR*/