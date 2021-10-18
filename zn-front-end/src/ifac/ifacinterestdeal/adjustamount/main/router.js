/*TZ8q/0LAp4WfJVPgyN7mAcZ+dQTfb8W1tZHdkGKyKMlNXM0Exq2WthVQeZr4j1Pt*/
import { asyncComponent } from 'nc-lightapp-front';

const card = asyncComponent(() => import(/* webpackChunkName: "ifac//ifacinterestdeal/adjustamount/card" */ /* webpackMode: "eager" */ '../card'));

const routes = [
	{
		path: '/',
		component: card,
		exact: true
	},
	{
		path: '/card',
		component: card
	}
	
];

export default routes;

/*TZ8q/0LAp4WfJVPgyN7mAcZ+dQTfb8W1tZHdkGKyKMlNXM0Exq2WthVQeZr4j1Pt*/