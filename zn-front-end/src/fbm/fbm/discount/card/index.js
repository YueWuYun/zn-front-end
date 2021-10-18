/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/* 
 期初应收票据卡片页
 created by：lifft 2019-03-25
 update: 
*/
import { ajax, base, createPage, high } from "nc-lightapp-front";
import React, { Component } from "react";
import BaseCard from "../../../public/components/BaseCard";
import { initForm } from "../../../public/container/page";
import { REF21_CONST } from "../ref21/const";
import {
  API_URL,
  billtype,
  CARD,
  LIST,
  DATA_SOURCE,
  disableReason,
  DISABLE_BTN_PARAM,
  fullAggClassName,
  module_id,
  nodekey,
  tableName
} from "../cons/constant.js";
import {
  afterEvent,
  beforeEvent,
  buttonVisible,
  initTemplate,
  initTemplate1,
  initTemplate2
} from "./events";

//componentDidMount
function cardDidMount() {
  let status = this.props.getUrlParam("status");
  initForm.call(this, status,
    () => {
      let status = this.props.getUrlParam("status");
      let pk = this.props.getUrlParam("id");
      if (status == "add" && pk != null) {
        // 清空表单form所有数据
        this.props.form.EmptyAllFormValue(
          CARD.form_id
        );
        let data = {
          pageCode: CARD.page_id
        };
        if (pk != null) {
          data = {
            pageCode: CARD.page_id,
            pk: pk
          };
        }
        ajax({
          url: "/nccloud/fbm/discount/init.do",
          data: data,
          success: res => {
            if (res.data) {
              if (res.data.head) {
                this.props.form.setAllFormValue({
                  [CARD.form_id]: res.data.head[CARD.form_id]
                });
              }
              let pk_org = this.props.form.getFormItemsValue(
                CARD.form_id,
                "pk_org"
              ).value;
              if (pk_org != "") {
                this.props.resMetaAfterPkorgEdit();
              }
              let olcrate = this.props.form.getFormItemsValue(CARD.form_id, "olcrate").value;
              let glcrate = this.props.form.getFormItemsValue(CARD.form_id, "glcrate").value;
              let gllcrate = this.props.form.getFormItemsValue(CARD.form_id, "gllcrate").value;
              if (Number(olcrate) === 1) {
                this.props.form.setFormItemsDisabled(CARD.form_id, {
                  olcrate: true
                });
              } else {
                this.props.form.setFormItemsDisabled(CARD.form_id, {
                  olcrate: false
                });
              }
              if (Number(glcrate) === 1) {
                this.props.form.setFormItemsDisabled(CARD.form_id, {
                  glcrate: true
                });
              } else {
                this.props.form.setFormItemsDisabled(CARD.form_id, {
                  glcrate: false
                });
              }
              if (Number(gllcrate) === 1) {
                this.props.form.setFormItemsDisabled(CARD.form_id, {
                  gllcrate: true
                });
              } else {
                this.props.form.setFormItemsDisabled(CARD.form_id, {
                  gllcrate: false
                });
              }
            } else {
              this.props.form.setAllFormValue({
                [CARD.form_id]: { rows: [] }
              });
            }
            buttonVisible.call(this, this.props);
          }
        });
      }
      buttonVisible.call(this, this.props);
    });
}

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() { }

  //根据场景加载相应initTemplate
  getInitTemplate = () => {
    let scene = this.props.getUrlParam("scene");
    if (scene === "linksce") {
      //联查场景
      return initTemplate1;
    } else if (scene === "approvesce") {
      //审批详情场景
      return initTemplate2;
    } else {
      return initTemplate;
    }
  };

  render() {
    //表头禁用字段
    // const headDisabledItems = [{
    // 	//币种为人民币时禁用组织本币汇率
    // 	key: 'olcrate',
    // 	rules: () => {
    // 		let pk_currtype = this.props.form.getFormItemsValue(CARD.form_id, 'pk_currtype');
    // 		return pk_currtype && pk_currtype.value === '1002Z0100000000001K1';
    // 	}
    // }];
    let multiLang = this.props.MutiInit.getIntl(module_id);
    return (
      <BaseCard
        constant={{
          // appcode: app_code,
          pageId: CARD.page_id,
          listPageCode: LIST.page_id,
          moduleId: module_id,
          formId: CARD.form_id,
          primaryId: CARD.primary_id, //主键ID
          billNo: CARD.billno, //单据编号
          tdataSource: REF21_CONST.Ref21DataSource, //转单页面的缓存key
          dataSource: DATA_SOURCE, //缓存key
          nodekey, //打印用
          API_URL, //接口地址
          billtype, //单据类型，联查审批详情需要
          disabledBtnsParam: DISABLE_BTN_PARAM, //根据选中数据判断对应按钮禁用状态
          // headDisabledItems,						//表头禁用字段
          pknotetype_bank: CARD.pknotetype_bank, // 银行承兑汇票
          pknotetype_busi: CARD.pknotetype_busi, // 商业承兑汇票
          pknotetype_ebank: CARD.pknotetype_ebank, // 电子银行承兑汇票
          pknotetype_ebusi: CARD.pknotetype_ebusi, // 电子商业承兑汇票
          cafalg: "true",
          encryptVOClassName:
            "nccloud.itf.fbm.discount.vo.DiscountEncryptVO4NCC",
          fullAggClassName: fullAggClassName, // aggvo全路径名
          disableReason: disableReason,
          billInfo: CARD.form_billinfo,
          modulecode: "3618",
          tableName
        }}
        _initTemplate={this.getInitTemplate.call(this)}
        _buttonVisible={buttonVisible}
        _afterEvent={afterEvent}
        _beforeEvent={beforeEvent}
        pageTitle={multiLang && multiLang.get("36180DT-000003")} //节点标题
        headBtnArea={CARD.head_btn_code} //表头按钮区域
        formParams={{
          expandArr: [
            CARD.form_id,
            CARD.form_clearinfo,
            // CARD.form_billinfo,
            CARD.form_ticket

          ]
        }} //表头form参数
        linkItems={["approveDetail", "ntb"]} //联查显示的组件
        cardDidMount={cardDidMount} //componentDidMount
        {...this.props}
      />
    );
  }
}

Card = createPage({
  billinfo: {
    billtype: "extcard",
    pagecode: CARD.page_id,
    headcode: CARD.form_id
  },
  mutiLangCode: module_id
})(Card);
export default Card;
// ReactDOM.render(<Card />, document.querySelector('#app'));

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/