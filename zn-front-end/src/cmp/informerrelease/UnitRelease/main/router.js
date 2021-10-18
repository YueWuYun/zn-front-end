/*TZ8q/0LAp4WfJVPgyN7mAZ9BE6KMB9Uj6aa1doVwMKNzwcnbyEFZWLav3XnMfO4r*/
import { asyncComponent } from 'nc-lightapp-front';
import SettlementCenterList from '../list';

const card = asyncComponent(() => import(/* webpackChunkName: "cmp/informerrelease/UnitRelease/card/card" */'../card'));

const routes = [
	{
		path: '/',
		component: SettlementCenterList,
		exact: true
	},
	{
		path: '/list',
		component: SettlementCenterList
	},
	{
		path: '/card',
		component: card
	}
];

export default routes;

/*TZ8q/0LAp4WfJVPgyN7mAZ9BE6KMB9Uj6aa1doVwMKNzwcnbyEFZWLav3XnMfO4r*/