/*TZ8q/0LAp4WfJVPgyN7mAZ9BE6KMB9Uj6aa1doVwMKNzwcnbyEFZWLav3XnMfO4r*/
import { asyncComponent } from 'nc-lightapp-front';
import List from '../list';

const Card = asyncComponent(() => import(/* webpackChunkName: "cmp/blankbill/recipients/card/card" */  '../card'));

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
	// {
	// 	path: '/linkcard',
	// 	component: linkcard
	// }
];

export default routes;

/*TZ8q/0LAp4WfJVPgyN7mAZ9BE6KMB9Uj6aa1doVwMKNzwcnbyEFZWLav3XnMfO4r*/