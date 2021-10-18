/*TZ8q/0LAp4WfJVPgyN7mAcZ+dQTfb8W1tZHdkGKyKMlNXM0Exq2WthVQeZr4j1Pt*/
import { asyncComponent } from 'nc-lightapp-front';
import List from '../list';

const card = asyncComponent(() => import(/* webpackChunkName: "ifac/ifacdemanddepositset/interestobj/card/card" */'../card'));
// const approvecard = asyncComponent(() => import(/* webpackChunkName: "ifac/ifacdemanddepositset/interestobj/approvecard/approvecard" */'../approvecard'));
// const linkcard = asyncComponent(() => import(/* webpackChunkName: "ifac/ifacdemanddepositset/interestobj/linkcard/linkcard" */ /* webpackMode: "eager" */ '../linkcard'));

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
	}
	// {
	// 	path: '/approvecard',
	// 	component: approvecard
	// },
	// {
	// 	path: '/linkcard',
	// 	component: linkcard
	// }
];

export default routes;

/*TZ8q/0LAp4WfJVPgyN7mAcZ+dQTfb8W1tZHdkGKyKMlNXM0Exq2WthVQeZr4j1Pt*/