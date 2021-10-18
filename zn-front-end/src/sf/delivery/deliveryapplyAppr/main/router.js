/*TZ8q/0LAp4WfJVPgyN7mAboKJ+mmUJrmigcdKIYMeQGGLNFXHHPngbPp1qdoMokR*/
import { asyncComponent } from 'nc-lightapp-front';
const Card = asyncComponent(() => import(/* webpackChunkName: "sf/delivery/deliveryapply/card/card" */ /* webpackMode: "eager" */ '../card'));
const routes = [
	{
		path: '/',
		component: Card,
		exact: true
	},
	{
		path: '/card',
		component: Card
	}
];

export default routes;

/*TZ8q/0LAp4WfJVPgyN7mAboKJ+mmUJrmigcdKIYMeQGGLNFXHHPngbPp1qdoMokR*/