/*TZ8q/0LAp4WfJVPgyN7mAcZ+dQTfb8W1tZHdkGKyKMlNXM0Exq2WthVQeZr4j1Pt*/
import { asyncComponent } from 'nc-lightapp-front';
import List from '../list';

const Card = asyncComponent(() => import(/* webpackChunkName: "ifac/facbankfixredeposit/bankfixredeposit/card/card" */ /* webpackMode: "eager" */ '../card'));
// const linkcard = asyncComponent(() => import(/* webpackChunkName: "ifac/facbankfixredeposit/bankfixredeposit/linkcard/linkcard" */ '../linkcard'));

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
	// {
	// 	path: '/linkcard',
	// 	component: linkcard
	// }
	
];

export default routes;

/*TZ8q/0LAp4WfJVPgyN7mAcZ+dQTfb8W1tZHdkGKyKMlNXM0Exq2WthVQeZr4j1Pt*/