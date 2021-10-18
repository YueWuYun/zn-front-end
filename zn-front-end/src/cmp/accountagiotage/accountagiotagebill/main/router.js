/*TZ8q/0LAp4WfJVPgyN7mAZ9BE6KMB9Uj6aa1doVwMKNzwcnbyEFZWLav3XnMfO4r*/
import { asyncComponent } from 'nc-lightapp-front';
import List from '../list';

const Card = asyncComponent(() => import(/* webpackChunkName: "cmp/accountagiotage/accountagiotagebill/card/card" */ /* webpackMode: "eager" */'../card'));
const linkcard = asyncComponent(() => import(/* webpackChunkName: "cmp/accountagiotage/accountagiotagebill/linkcard/linkcard" */ /* webpackMode: "eager" */'../linkcard'));

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
		path: '/linkcard',
		component: linkcard
	}
	
];

export default routes;

/*TZ8q/0LAp4WfJVPgyN7mAZ9BE6KMB9Uj6aa1doVwMKNzwcnbyEFZWLav3XnMfO4r*/