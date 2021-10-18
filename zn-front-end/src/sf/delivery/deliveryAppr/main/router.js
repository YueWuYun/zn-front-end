/*TZ8q/0LAp4WfJVPgyN7mAboKJ+mmUJrmigcdKIYMeQGGLNFXHHPngbPp1qdoMokR*/
import { asyncComponent } from 'nc-lightapp-front';

// const card = asyncComponent(() => import('../card'));
// const listlinkq = asyncComponent(() => import('../listlinkq'));
// const cardlinkq = asyncComponent(() => import('../cardlinkq'));
const card = asyncComponent(() => import(/* webpackChunkName: "sf/delivery/delivery/card/card" */ /* webpackMode: "eager" */  '../card'));

const routes = [
	{
		path: '/card',
		component: card
	}

];

export default routes;

/*TZ8q/0LAp4WfJVPgyN7mAboKJ+mmUJrmigcdKIYMeQGGLNFXHHPngbPp1qdoMokR*/