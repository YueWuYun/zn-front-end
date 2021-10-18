import { asyncComponent } from "nc-lightapp-front";
import List from "../list";

const Card = asyncComponent(() =>
    import(/* webpackChunkName: "lcm/documentarybill/paydocubills/card" */ /* webpackMode: "eager" */ "../card")
);

const routes = [
    {
        path: "/",
        component: List,
        exact: true
    },
    {
        path: "/list",
        component: List
    },
    {
        path: "/card",
        component: Card
    }
];

export default routes;
