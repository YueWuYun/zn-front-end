/*TZ8q/0LAp4WfJVPgyN7mAZw5S3f9tcAb0zUbJXa0kIcLTlsL1UWeXNeAAXWJS0sy*/
import { asyncComponent } from 'nc-lightapp-front';
import InterestrateList from '../list';
// const card = asyncComponent(() => import('../card'));
const card = asyncComponent(() => import(/* webpackChunkName: "tmpub/pub/interestrate_group/card" */ /* webpackMode: "eager" */'../card'));

const routes = [
	{
		path: '/',
		component: InterestrateList,
		exact: true
	},
	{
		path: '/list',
		component: InterestrateList
	},
	{
		path: '/card',
		component: card
	},
	
];

export default routes;

/*TZ8q/0LAp4WfJVPgyN7mAZw5S3f9tcAb0zUbJXa0kIcLTlsL1UWeXNeAAXWJS0sy*/