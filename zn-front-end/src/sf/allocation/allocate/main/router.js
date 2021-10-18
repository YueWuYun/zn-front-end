/*TZ8q/0LAp4WfJVPgyN7mAboKJ+mmUJrmigcdKIYMeQGGLNFXHHPngbPp1qdoMokR*/
import { asyncComponent } from 'nc-lightapp-front';
import List from '../list';

const Card = asyncComponent(() => import(/* webpackChunkName: "sf/allocation/allocate/card/card" */ /* webpackMode: "eager" */'../card'));
const LinkList = asyncComponent(() => import(/* webpackChunkName: "sf/allocation/allocate/linklist/linklist" */ /* webpackMode: "eager" */'../linklist'));
const LinkCard = asyncComponent(() => import(/* webpackChunkName: "sf/allocation/allocate/linkcard/linkcard" */ /* webpackMode: "eager" */'../linkcard'));


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