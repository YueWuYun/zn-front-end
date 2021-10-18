/*TZ8q/0LAp4WfJVPgyN7mAZ9BE6KMB9Uj6aa1doVwMKNzwcnbyEFZWLav3XnMfO4r*/
import { asyncComponent } from 'nc-lightapp-front';
import ConferTable from '../list';

const card = asyncComponent(() => import(/* webpackChunkName: "cmp/billmanagement/confer/card/card" *//* webpackMode: "eager" */'../card'));

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

/*TZ8q/0LAp4WfJVPgyN7mAZ9BE6KMB9Uj6aa1doVwMKNzwcnbyEFZWLav3XnMfO4r*/