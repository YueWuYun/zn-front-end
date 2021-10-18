/*TZ8q/0LAp4WfJVPgyN7mAboKJ+mmUJrmigcdKIYMeQGGLNFXHHPngbPp1qdoMokR*/
import { asyncComponent } from 'nc-lightapp-front';
import List from '../list';
const Card = asyncComponent(() => import(/* webpackChunkName: "sf/delivery/deliveryapply/card/card" */ /* webpackMode: "eager" */ '../card'));
const LinkCard = asyncComponent(() => import(/* webpackChunkName: "sf/delivery/deliveryapply/linkcard/linkcard" */ /* webpackMode: "eager" */ '../linkcard'));
const LinkList = asyncComponent(() => import(/* webpackChunkName: "sf/delivery/deliveryapply/linklist/linklist" */ /* webpackMode: "eager" */ '../linklist'));

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
		path: '/linklist',
		component: LinkList
	},
	{
		path: '/linkcard',
		component: LinkCard
	}
];

export default routes;

/*TZ8q/0LAp4WfJVPgyN7mAboKJ+mmUJrmigcdKIYMeQGGLNFXHHPngbPp1qdoMokR*/