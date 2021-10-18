/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { cardCache } from "nc-lightapp-front";
import { btn_Controller } from "../btnClicks";
import { REF21_CONST } from "../const";
import { referEvent } from "../events";

export default function(props) {
  props.createUIDom(
    {
      pagecode: REF21_CONST.transPageId, //卡片页面编码
      appcode: props.getSearchParam("c") || props.getUrlParam("c") //应用编码
    },
    data => {
      if (data) {
        if (data.template) {
          let meta = data.template;
          referEvent.call(this, props, meta);
          props.meta.setMeta(meta, btn_Controller.bind(this, props));
          loadSearchCache(props);
          //列表查询区域加载默认业务单元
          setDefOrg2ListSrchArea(props, REF21_CONST.searchId, data);
          // props.search.setSearchValByField(REF21_CONST.searchId, 'isqualitymy', { value: 0, display: this.props.MutiInit.getIntl("36070APM") && this.props.MutiInit.getIntl("36070APM").get('36070APM--000003') }, '=');/* 国际化处理： 否*/
        }
        if (data.button) {
          let button = data.button;
          props.button.setButtons(button);
        }
      }
    }
  );
}

/**
 * 加载查询区域缓存
 * @param {*} props
 */
export const loadSearchCache = function(props) {
  //从缓存中获取查询区域条件
  let searchData = cardCache.getDefData(
    REF21_CONST.searchId,
    REF21_CONST.Ref21DataSource
  );
  //更新查询区域
  if (searchData) {
    props.search.setSearchValue(
      REF21_CONST.searchId,
      searchData.querycondition
    );
  }
};

/**
 * 给列表查询区域赋默认业务单元(在setMeta之后使用)
 * @param {*} props 页面内置对象
 * @param {*} areaCode 列表查询区域编码
 * @param {*} data  createUIDom请求返回数据
 */
export const setDefOrg2ListSrchArea = function(props, areaCode, data) {
  //获取默认业务单元
  let { pk_org, org_Name } = data.context;
  let searchData = { display: org_Name, value: pk_org };
  //更新列表查询区域
  props.search.setSearchValByField(areaCode, "pk_org", searchData);
};

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/