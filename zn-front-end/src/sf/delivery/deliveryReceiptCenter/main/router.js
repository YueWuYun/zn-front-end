/*TZ8q/0LAp4WfJVPgyN7mAboKJ+mmUJrmigcdKIYMeQGGLNFXHHPngbPp1qdoMokR*/
import { asyncComponent } from 'nc-lightapp-front';
import List from '../list';

const Card = asyncComponent(() => import(/* webpackChunkName: "sf/delivery/deliveryReceiptCenter/card/card" */'../card'));
//const list = asyncComponent(() => import('../list'));

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
];

export default routes;

/*TZ8q/0LAp4WfJVPgyN7mAboKJ+mmUJrmigcdKIYMeQGGLNFXHHPngbPp1qdoMokR*/