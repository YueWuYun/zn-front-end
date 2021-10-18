/*TZ8q/0LAp4WfJVPgyN7mAZw5S3f9tcAb0zUbJXa0kIcLTlsL1UWeXNeAAXWJS0sy*/
import { asyncComponent } from 'nc-lightapp-front';
import ConferTable from '../list';

const card = asyncComponent(() => import(/* webpackChunkName: "cmp/billmanagement/confer/card/card" */'../card'));

const routes = [
	{
		path: '/',
		component: ConferTable,
		exact: true
	},
	{
		path: '/list',
		component: ConferTable
	},
	{
		path: '/card',
		component: card
	}
];

export default routes;

/*TZ8q/0LAp4WfJVPgyN7mAZw5S3f9tcAb0zUbJXa0kIcLTlsL1UWeXNeAAXWJS0sy*/