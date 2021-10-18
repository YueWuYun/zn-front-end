/*TZ8q/0LAp4WfJVPgyN7mAdFhrxVe3C3ZqWDWT10iQaNHCWYrqPLpqbCZgebdSPez*/
import { asyncComponent } from "nc-lightapp-front";
import List from "../list";

//付票登记卡片页面
const card = asyncComponent(() =>
  import(
    /*webpackChunkName:"fbm/fbm/paybill/card"*/ /* webpackMode: "eager" */ "../card"
  )
);
//付票登记被联查卡片页面
const cardlinkq = asyncComponent(() =>
  import(
    /*webpackChunkName:"fbm/fbm/paybill/cardlinkq"*/ /* webpackMode: "eager" */ "../cardlinkq"
  )
);
//付票登记被联查列表页面
const listlinkq = asyncComponent(() =>
  import(
    /*webpackChunkName:"fbm/fbm/paybill/listlinkq"*/ /* webpackMode: "eager" */ "../listlinkq"
  )
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
    path: "/listlinkq",
    component: listlinkq
  },
  {
    path: "/card",
    component: card
  },
  {
    path: "/cardlinkq",
    component: cardlinkq
  }
];

export default routes;

/*TZ8q/0LAp4WfJVPgyN7mAdFhrxVe3C3ZqWDWT10iQaNHCWYrqPLpqbCZgebdSPez*/