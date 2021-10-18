/*TZ8q/0LAp4WfJVPgyN7mAZw5S3f9tcAb0zUbJXa0kIcLTlsL1UWeXNeAAXWJS0sy*/
import { asyncComponent } from 'nc-lightapp-front';
import List from '../list';

const Card = asyncComponent(() => import(/* webpackChunkName: "tmpub/pub/nbfo/card/card" */ /* webpackMode: "eager" */'../card'));
const AccList = asyncComponent(() => import(/* webpackChunkName: "tmpub/pub/nbfo/acclist/acclist" */ /* webpackMode: "eager" */'../acclist'));
const AccCard = asyncComponent(() => import(/* webpackChunkName: "tmpub/pub/nbfo/acccard/acccard" */ /* webpackMode: "eager" */'../acccard'));

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
	{
		path: '/acclist',
		component: AccList
	},
	{
		path: '/acccard',
		component: AccCard
	}
];

export default routes;

/*TZ8q/0LAp4WfJVPgyN7mAZw5S3f9tcAb0zUbJXa0kIcLTlsL1UWeXNeAAXWJS0sy*/