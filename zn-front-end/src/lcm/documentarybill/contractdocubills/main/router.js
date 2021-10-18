import { asyncComponent } from "nc-lightapp-front";
import List from "../list";
import pullBillList from "../pullBillList";
const Card = asyncComponent(() =>
    import(/* webpackChunkName: "lcm/documentarybill/contractdocubills/card" */ /* webpackMode: "eager" */ "../card")
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
    },
    {
        path: "/pullBillList",
        component: pullBillList,
    },
];

export default routes;
