//Jd2y+qhYYLi1p942tboURnS76KoEXSLbKfBfpGam3ZHZoPBuN0QlU/QaBpV9m84t
import { asyncComponent } from 'nc-lightapp-front';
import list from '../list';


const card = asyncComponent(() => import(/*webpackChunkName:"uapbd/material/marassistant/card/card"*/ /* webpackMode: "eager"  */ '../card'));

const routes = [
	{
		path: '/',
		component: list,
		exact: true
	},
	{
		path: '/list',
		component: list
	},
	{
		path: '/card',
		component: card
	}
];

export default routes;


//Jd2y+qhYYLi1p942tboURnS76KoEXSLbKfBfpGam3ZHZoPBuN0QlU/QaBpV9m84t