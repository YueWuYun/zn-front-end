/*TZ8q/0LAp4WfJVPgyN7mAboKJ+mmUJrmigcdKIYMeQGGLNFXHHPngbPp1qdoMokR*/
import { asyncComponent } from 'nc-lightapp-front';
import List from '../list';

// const card = asyncComponent(() => import('../card'));
// const listlinkq = asyncComponent(() => import('../listlinkq'));
// const cardlinkq = asyncComponent(() => import('../cardlinkq'));
const card = asyncComponent(() => import(/* webpackChunkName: "sf/delivery/delivery/card/card" */ /* webpackMode: "eager" */ '../card'));
const listlinkq = asyncComponent(() => import(/* webpackChunkName: "sf/delivery/delivery/listlinkq/listlinkq" */ /* webpackMode: "eager" */ '../listlinkq'));
const cardlinkq = asyncComponent(() => import(/* webpackChunkName: "sf/delivery/delivery/cardlinkq/cardlinkq" */ /* webpackMode: "eager" */ '../cardlinkq'));

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
		path: '/listlinkq',
		component: listlinkq
	},
	{
		path: '/cardlinkq',
		component: cardlinkq
	},
	
];

export default routes;

/*TZ8q/0LAp4WfJVPgyN7mAboKJ+mmUJrmigcdKIYMeQGGLNFXHHPngbPp1qdoMokR*/