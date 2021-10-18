/*TZ8q/0LAp4WfJVPgyN7mAb8ilTwtNrV/YAORlOBXL9IJ+YrgguDYedlwBacai/R/*/
import { asyncComponent } from 'nc-lightapp-front';
import List from '../list';
import Card from '../card';

const card = asyncComponent(() => import(/* webpackChunkName: "fts/commission/paymentreceipt/card/card" *//* webpackMode: "eager" */'../card'));

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

/*TZ8q/0LAp4WfJVPgyN7mAb8ilTwtNrV/YAORlOBXL9IJ+YrgguDYedlwBacai/R/*/