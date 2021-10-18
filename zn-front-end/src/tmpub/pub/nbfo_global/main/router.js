/*TZ8q/0LAp4WfJVPgyN7mAZw5S3f9tcAb0zUbJXa0kIcLTlsL1UWeXNeAAXWJS0sy*/
import { asyncComponent } from 'nc-lightapp-front';
import NbfoList from '../list';
// const card = asyncComponent(() => import('../card'));
const card = asyncComponent(() => import(/* webpackChunkName: "tmpub/pub/interestrate_global/card" */ /* webpackMode: "eager" */'../card'));

const routes = [
	{
		path: '/',
		component: NbfoList,
		exact: true
	},
	{
		path: '/list',
		component: NbfoList
	},
	{
		path: '/card',
		component: card
	},
	
];

export default routes;

/*TZ8q/0LAp4WfJVPgyN7mAZw5S3f9tcAb0zUbJXa0kIcLTlsL1UWeXNeAAXWJS0sy*/