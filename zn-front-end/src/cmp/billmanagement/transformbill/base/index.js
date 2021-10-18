/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
//加载开源组件
import { Component } from "react";
//财务组织参照
import FinanceOrgTreeRef from '../../../../uapbd/refer/org/FinanceOrgTreeRef'
//银行账户参照
import BankaccSubUseTreeGridRef from '../../../../uapbd/refer/pub/BankaccSubUseTreeGridRef'
//现金账户参照
import CashAccountGridRef from '../../../../uapbd/refer/sminfo/CashAccountGridRef'
//内部账户参照
import AccidGridRef from '../../../../tmpub/refer/accid/AccidGridRef'
//退回弹框
import ReBackModal from '../../../../tmpub/pub/util/modal'
//账户余额组件
import NCCOriginalBalance from '../../../../cmp/public/restmoney/list'
//联查内部账户组件
import { InnerAccoutDialog } from '../../../../tmpub/pub/inneraccount/list'
//分组页签
import NCTabs from "../../../../tmpub/pub/util/NCTabs";
const { NCTabPane } = NCTabs;
//加载小应用API
import api from "./api/index";
//加载常量定义
import cons from "./cons/index";

//组件(第三方组件)
const comp = {
    Component, FinanceOrgTreeRef, BankaccSubUseTreeGridRef, CashAccountGridRef, AccidGridRef, ReBackModal, NCCOriginalBalance, InnerAccoutDialog, NCTabs, NCTabPane
}

/**
 * 小应用所依赖的组件，API，全部在此维护，避免依赖过于松散
 * @author tangleic
 */
export default {
    comp, api, cons
}


/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/