/*TZ8q/0LAp4WfJVPgyN7mAZ9BE6KMB9Uj6aa1doVwMKNzwcnbyEFZWLav3XnMfO4r*/
import { asyncComponent } from 'nc-lightapp-front';
import SharingCenterList from '../list';

const card = asyncComponent(() => import(/* webpackChunkName: "cmp/informer/SharingCenter/card/card" */'../card'));

const routes = [
	{
		path: '/',
		component: SharingCenterList,
		exact: true
	},
	{
		path: '/list',
		component: SharingCenterList
	},
	{
		path: '/card',
		component: card
	}
];

export default routes;

/*TZ8q/0LAp4WfJVPgyN7mAZ9BE6KMB9Uj6aa1doVwMKNzwcnbyEFZWLav3XnMfO4r*/