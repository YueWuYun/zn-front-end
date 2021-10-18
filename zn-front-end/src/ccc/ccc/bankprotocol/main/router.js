/*TZ8q/0LAp4WfJVPgyN7mAW11BmJLqCDn+cKhCM5bFfpYzXPFtmMOSS4G72p6KtiI*/
import { asyncComponent } from 'nc-lightapp-front';
import List from '../list';

const card = asyncComponent(() => import(/* webpackChunkName: "ccc/ccc/bankprotocol/card/card" *//* webpackMode: "eager" */'../card'));

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
	
];

export default routes;

/*TZ8q/0LAp4WfJVPgyN7mAW11BmJLqCDn+cKhCM5bFfpYzXPFtmMOSS4G72p6KtiI*/