/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { setDefOrg2AdvanceSrchArea, setDefOrg2ListSrchArea } from "src/tmpub/pub/util/index";
import { list } from "../../cons/constant";
import { buttonVisible } from "./buttonVisible";

/***
 *
 * @Description: 贴现试算列表初始化
 * @author: zhoulyu
 * @date: 2019年11月27日 下午5:05:41
 * @version ncc2004
 */

export default function(props) {
  props.createUIDom(
    {
      pagecode: list.pageCode, //页面code
      appcode: props.getSearchParam("c") || props.getUrlParam("c")
    },
    data => {
      if (data) {
        if (data.template) {
          let meta = data.template;
          meta = modifierMeta.call(this, props, meta);
          //给高级查询区域赋默认业务单元(在setMeta之前使用)
          setDefOrg2AdvanceSrchArea(props, list.searchCode, data);
          props.meta.setMeta(meta);
          //给列表查询区域赋默认业务单元(在setMeta之后使用)
          setDefOrg2ListSrchArea(props, list.searchCode, data);
          this.searchOid = meta.search.oid;
          this.props.form.setFormStatus(list.headCode, "edit");
        }
        if (data.button) {
          let button = data.button;
          props.button.setButtons(button);
          buttonVisible.call(this, props);
        }
      }
    }
  );
}

function modifierMeta(props, meta) {
  if (meta[this.searchId].items) {
    meta[this.searchId].items = meta[this.searchId].items.map((item, key) => {
      //票据类型
      if (item.attrcode == "fbmbilltype") {
        item.queryCondition = () => {
          return {
            GridRefActionExt:
              "nccloud.web.fbm.fbm.sign.filter.GatherFbmbilltypeRefModelFilter"
          };
        };
      }
      // 自定义项过滤
      if (item.attrcode.indexOf("def") > -1) {
        //自定义档案按照组织或者集团过滤
        item.queryCondition = p => {
          let pk_org = this.props.search.getSearchValByField(
            this.searchId,
            "pk_org"
          );
          if (pk_org && pk_org.value && pk_org.value.firstvalue) {
            return {
              pk_org: pk_org.value.firstvalue
            };
          }
        };
      }
      //财务组织用户过滤
      if (item.attrcode == "pk_org") {
        item.queryCondition = () => {
          return {
            funcode: props.getSearchParam("c") || props.getUrlParam("c"),
            TreeRefActionExt:
              "nccloud.web.tmpub.filter.FinanceOrgPermissionFilter"
          };
        };
      }
      return item;
    });
  }
  return meta;
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/