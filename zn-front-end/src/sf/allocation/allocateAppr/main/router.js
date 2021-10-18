/*TZ8q/0LAp4WfJVPgyN7mAboKJ+mmUJrmigcdKIYMeQGGLNFXHHPngbPp1qdoMokR*/
import { asyncComponent } from 'nc-lightapp-front';

const Card = asyncComponent(() => import(/* webpackChunkName: "sf/allocation/allocateAppr/card/card" */ /* webpackMode: "eager" */ '../card'));


const routes = [
	
	{
		path: '/card',
		component: Card
	}
];

export default routes;

/*TZ8q/0LAp4WfJVPgyN7mAboKJ+mmUJrmigcdKIYMeQGGLNFXHHPngbPp1qdoMokR*/