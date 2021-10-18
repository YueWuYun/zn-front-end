/*TZ8q/0LAp4WfJVPgyN7mAZw5S3f9tcAb0zUbJXa0kIcLTlsL1UWeXNeAAXWJS0sy*/
import { asyncComponent } from 'nc-lightapp-front';
import List from '../list';

const Card = asyncComponent(() => import(/* webpackChunkName: "tmpub/pub/settledate/card/card" */ /* webpackMode: "eager" */'../card'));

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

/*TZ8q/0LAp4WfJVPgyN7mAZw5S3f9tcAb0zUbJXa0kIcLTlsL1UWeXNeAAXWJS0sy*/