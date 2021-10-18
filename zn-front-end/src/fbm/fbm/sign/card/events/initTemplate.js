/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { ajax } from "nc-lightapp-front";
import { CARD } from "../../cons/constant";
import { bodyButtonClick } from "./bodyButtonClick";
import { buttonVisible } from "./buttonVisible";
import { afterEvent } from "./index";
export default function(props, templateCallback) {
  let app_code = props.getSearchParam("c");
  props.createUIDom(
    {
      pagecode: CARD.page_id, //页面id
      appcode: app_code
    },
    data => {
      if (data) {
        if (data.template) {
          let meta = data.template;
          meta = modifierMeta.call(this, meta);
          props.meta.renderTabs(meta, CARD.tab_order, CARD.tab_order);
          // props.meta.setMeta(meta);
          console.log("meta", meta);
        }
        if (data.button) {
          let button = data.button;
          props.button.setButtons(button);
          buttonVisible.call(this, props, button);
        }
       // orgVersionView(props, this.formId, "pk_signorg", "pk_signorg_v");
       // orgVersionView(props, this.formId, "pk_payfundorg", "pk_payfundorg_v");
       // orgVersionView(props, this.formId, "pk_usebillorg", "pk_usebillorg_v");
        props.form.openArea("register");
        templateCallback && templateCallback();
        if (data.context) {
          let context = data.context;
          if (props.getUrlParam("status") === "add") {
            let pk_signaccept = this.props.getUrlParam("id");
            if(pk_signaccept){
              return;
            }
            //设置默认组织
            let { pk_org, org_Name, pk_org_v, org_v_Name } = context;
            if (pk_org) {
              props.form.setFormItemsValue(this.formId, {
                pk_org: { value: pk_org, display: org_Name },
                pk_org_v: { value: pk_org_v, display: org_v_Name }
              });
              afterEvent.call(
                this,
                props,
                this.formId,
                "pk_org",
                { display: org_Name, value: pk_org },
                { value: null }
              );
            }
          }
        }
      }
    }
  );
}

function modifierMeta(meta) {
  //表头
  meta[this.formId].items.map(item => {
    if (item.attrcode === "pk_org") {
      //组织
      item.queryCondition = () => {
        return {
          funcode: this.props.getSearchParam("c"), //appcode获取
          TreeRefActionExt:
            "nccloud.web.tmpub.filter.FinanceOrgPermissionFilter"
        };
      };
    }
    if (item.attrcode === "pk_costcenter") {//成本中心
      item.queryCondition = p => {
        let pk_org = this.props.form.getFormItemsValue(this.formId, "pk_org")
          .value;
        let pk_group = this.props.form.getFormItemsValue(
          this.formId,
          "pk_group"
        ).value;
        return {
          pk_org: pk_org,
          pk_group: pk_group
        };
      };
    }
    if (item.attrcode.indexOf("def") > -1) {
      //自定义档案按照组织或者集团过滤
      item.queryCondition = p => {
        let pk_org = this.props.form.getFormItemsValue(this.formId, "pk_org")
          .value;
        let pk_group = this.props.form.getFormItemsValue(
          this.formId,
          "pk_group"
        ).value;
        return {
          pk_org: pk_org,
          pk_group: pk_group
        };
      };
    }

    if (item.attrcode === "dept") {
      //部门过滤
      item.showHistory = true;
      item.queryCondition = () => {
        let pk_org =
          this.props.form.getFormItemsValue(this.formId, "pk_entrustorg")
            .value == ""
            ? this.props.form.getFormItemsValue(this.formId, "pk_org").value
            : this.props.form.getFormItemsValue(this.formId, "pk_entrustorg")
                .value;
        return {
          pk_org: pk_org
        };
      };
    }
    if (item.attrcode === "invstfincvartyid") {
      //融资品种过滤
      item.queryCondition = () => {
        return {};
      };
    }
    //业务组织过滤
    // if (item.attrcode == 'pk_entrustorg') {
    // 	// item.showHistory = false;
    // 	item.queryCondition = () => {
    // 		let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org') && this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
    // 		return {
    // 			pk_org: pk_org,
    // 			TreeRefActionExt: 'nccloud.web.fbm.fbm.sign.filter.SignOrgRelationDataRefModelFilter'
    // 		};
    // 	};
    // }
    //业务组织过滤 上面的是自己写的不好使，先用下面这个收票登记的
    if (item.attrcode == "pk_entrustorg") {
      // item.showHistory = false;
      item.queryCondition = () => {
        let pk_org = this.props.form.getFormItemsValue(this.formId, "pk_org");
        return {
          pkorg: pk_org && pk_org.value,
          TreeRefActionExt:
            "nccloud.web.fbm.fbm.gather.filter.GatherOrgRelationDataRefModelFilter4NCC"
        };
      };
    }
    // 业务人员
    // if (item.attrcode == 'psn') {
    // 	item.render = function (text, record, index) {
    //
    // 		return (
    // 			PsnDocTreeGridRef({
    // 				queryCondition: () => {
    //
    // 					return {
    // 						pk_org: this.props.form.getFormItemsValue(this.formId, 'pk_org') && this.props.form.getFormItemsValue(this.formId, 'pk_org').value,
    // 						 GridRefActionExt: 'nccloud.web.cmp.apply.apply.filter.DecidedeptRefbyFinanceorgFilter'//自定义参照过滤条件
    // 					};
    // 				}
    // 			})
    // 		);
    // 	}
    // }

    if (item.attrcode == "psn") {
      item.showHistory = true;
      item.queryCondition = () => {
        let pk_dept =
          this.props.form.getFormItemsValue(this.formId, "dept") &&
          this.props.form.getFormItemsValue(this.formId, "dept").value;
        let pk_org =
          this.props.form.getFormItemsValue(this.formId, "pk_entrustorg")
            .value == ""
            ? this.props.form.getFormItemsValue(this.formId, "pk_org").value
            : this.props.form.getFormItemsValue(this.formId, "pk_entrustorg")
                .value;
        return {
          pk_dept: pk_dept,
          pk_org: pk_org
        };
      };
    }
    if (item.attrcode == "chargeplanitem") {
      // 资金计划项目为支出类的计划项目，支出项目
      return (item.queryCondition = () => {
        let pk_org =
          this.props.form.getFormItemsValue(this.formId, "pk_org") &&
          this.props.form.getFormItemsValue(this.formId, "pk_org").value;
        return {
          pk_org: pk_org // 组织
          //TreeRefActionExt: 'nccloud.web.fbm.fbm.sign.filter.DefaultOutFundplanRefModelFilter'
        };
      });
    }
    if (item.attrcode == "invoiceplanitem") {
      // 资金计划项目为支出类的计划项目，支出项目
      return (item.queryCondition = () => {
        let pk_org =
          this.props.form.getFormItemsValue(this.formId, "pk_org") &&
          this.props.form.getFormItemsValue(this.formId, "pk_org").value;
        return {
          pk_org: pk_org
        };
      });
    }
    // 开票申请编号参照过滤
    if (item.attrcode == "applybillno") {
      return (item.queryCondition = () => {
        let pk_org =
          this.props.form.getFormItemsValue(this.formId, "pk_org") &&
          this.props.form.getFormItemsValue(this.formId, "pk_org").value;
        let isagent =
          this.props.form.getFormItemsValue(this.formId, "isagent") &&
          this.props.form.getFormItemsValue(this.formId, "isagent").value; //是否代理开票啊
        return {
          pk_org: pk_org,
          isagent: isagent,
          pk_billtype: "36H2"
        };
      });
    }
  });
  meta["register"].items.map(item => {
    if (item.attrcode === "pk_payacc") {//出票人账号
      item.checkStrictly = false;
      item.showHistory = true;
      item.queryCondition = () => {
        return {
          refnodename:
            this.props.MutiInit.getIntl("36180BS") &&
            this.props.MutiInit.getIntl("36180BS").get(
              "36180BS-000003"
            ) /* 国际化处理： 使用权参照*/,
          pk_org: this.props.form.getFormItemsValue(this.formId, "pk_org")
            .value,
          pk_curr:
            this.props.form.getFormItemsValue(this.formId, "pk_curr") &&
            this.props.form.getFormItemsValue(this.formId, "pk_curr").value,
          GridRefActionExt:
            "nccloud.web.fbm.fbm.sign.filter.SignPkcurrFilter,nccloud.web.fbm.fbm.sign.filter.NotSecurityPayAccRefModelFilter,nccloud.web.fbm.fbm.sign.filter.PayBankAccRefModelFilter"
        };
      };
    }
    if (item.attrcode === "pk_paybank") {//出票银行
      item.checkStrictly = false;
      item.showHistory = true;
	}
	if (item.attrcode === 'pk_payunit') { //出票人
		item.showHistory = true;
		item.queryCondition = () => {
			return {
				funcode: this.props.getSearchParam('c'),//appcode获取
				TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
			};
		};
	}
    if (item.attrcode === "hidereceiveunit") {//收款人
      item.checkStrictly = false;
      item.showHistory = true;
      item.queryCondition = () => {
        let pk_org =
          this.props.form.getFormItemsValue(this.formId, "pk_org") &&
          this.props.form.getFormItemsValue(this.formId, "pk_org").value;
        let pk_group =
          this.props.form.getFormItemsValue(this.formId, "pk_group") &&
          this.props.form.getFormItemsValue(this.formId, "pk_group").value;
        return {
          pk_org: pk_org,
          pk_group: pk_group
          //GridRefActionExt: "nccloud.web.fbm.fbm.sign.filter.ReceiveCustRefModelFilter"
        };
      };
    }
    if (item.attrcode === "receiveunit") { //收款人(文本)
      item.checkStrictly = false;
      item.showHistory = true;
      item.fieldDisplayed = "refname";
      item.itemtype = "refer";
      item.refcode = "uapbd/refer/supplier/CustSupplierFlexGridTreeRef/index";
      item.queryCondition = () => {
        let pk_org =
          this.props.form.getFormItemsValue(this.formId, "pk_org") &&
          this.props.form.getFormItemsValue(this.formId, "pk_org").value;
        let pk_group =
          this.props.form.getFormItemsValue(this.formId, "pk_group") &&
          this.props.form.getFormItemsValue(this.formId, "pk_group").value;
        return {
          pk_org: pk_org,
          pk_group: pk_group
          //GridRefActionExt: "nccloud.web.fbm.fbm.sign.filter.ReceiveCustRefModelFilter"
        };
      };
    }
    if (item.attrcode == "hidereceivebankacc") {//收款人账号
      item.checkStrictly = false;
      item.showHistory = true;
      item.queryCondition = () => {
        let hidereceiveunit = this.props.form.getFormItemsValue(
          this.formId,
          "hidereceiveunit"
        );
        let pk_curr = this.props.form.getFormItemsValue(this.formId, "pk_curr");
        return {
          pk_cust: hidereceiveunit && hidereceiveunit.value,
          pk_curr: pk_curr && pk_curr.value,
          GridRefActionExt:
            "nccloud.web.fbm.fbm.gather.filter.GatherBankAccFilter2Cust4NCC"
        };
      };
	}
	if (item.attrcode == 'receivebankacc' ) {//收款人账号(文本)
		item.checkStrictly = false;
		item.showHistory = true;
		//item.fieldDisplayed ='refname';
		item.itemtype = 'refer';
	    item.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index';
		item.queryCondition = () => {
			let hidereceiveunit = this.props.form.getFormItemsValue(this.formId,'hidereceiveunit')
			let pk_curr = this.props.form.getFormItemsValue(this.formId,'pk_curr')
			return {
				pk_cust: hidereceiveunit && hidereceiveunit.value,
				pk_curr:pk_curr && pk_curr.value,	
				GridRefActionExt:"nccloud.web.fbm.fbm.gather.filter.GatherBankAccFilter2Cust4NCC"				
			};
		};
	}
    if (item.attrcode === "hidereceivebank") {//收款银行
      item.checkStrictly = false;
      item.showHistory = true;
    }
    if (item.attrcode === "receivebank") {//收款银行(文本)
      item.checkStrictly = false;
      item.showHistory = true;
      item.fieldDisplayed = "refname";
      item.itemtype = "refer";
      item.refcode = "uapbd/refer/bankacc/BankDocDefaultGridTreeRef/index";
    }
    if (item.attrcode === "pk_acceptor") {//承兑人{银行档案}
      item.checkStrictly = false;
      item.showHistory = true;
    }
    if (item.attrcode === "pk_signagrbank") {//承兑人{客商档案}
      item.checkStrictly = false;
      item.showHistory = true;
      item.queryCondition = () => {
        let pk_org =
          this.props.form.getFormItemsValue(this.formId, "pk_org") &&
          this.props.form.getFormItemsValue(this.formId, "pk_org").value;
        let pk_group =
          this.props.form.getFormItemsValue(this.formId, "pk_group") &&
          this.props.form.getFormItemsValue(this.formId, "pk_group").value;
        return {
          pk_org: pk_org,
          pk_group: pk_group
        };
      };
    } 
    if (item.attrcode === "acceptunit") {//承兑人{客商档案}
      item.checkStrictly = false;
      item.queryCondition = () => {
        let pk_org =
          this.props.form.getFormItemsValue(this.formId, "pk_org") &&
          this.props.form.getFormItemsValue(this.formId, "pk_org").value;
        let pk_group =
          this.props.form.getFormItemsValue(this.formId, "pk_group") &&
          this.props.form.getFormItemsValue(this.formId, "pk_group").value;
        return {
          pk_org: pk_org,
          pk_group: pk_group
        };
      };
    }
    if (item.attrcode === "pk_acceptorbank") {//承兑人开户行名
      item.checkStrictly = false;
      item.queryCondition = () => {
        let pk_org =
          this.props.form.getFormItemsValue(this.formId, "pk_org") &&
          this.props.form.getFormItemsValue(this.formId, "pk_org").value;
        let pk_group =
          this.props.form.getFormItemsValue(this.formId, "pk_group") &&
          this.props.form.getFormItemsValue(this.formId, "pk_group").value;
        return {
          pk_org: pk_org,
          pk_group: pk_group
        };
      }
    }
    if (item.attrcode === "hideacceptbankacc") {//承兑人账号
      item.showHistory = true;
      item.queryCondition = () => {
        return {
          accclass: "1",
          pk_cust: this.props.form.getFormItemsValue(this.formId, "pk_acceptor")
            .value
        };
      };
    }
    if (item.attrcode == "fbmbilltype") { 
		item.queryCondition = () => {
        return {
          GridRefActionExt:
            "nccloud.web.fbm.fbm.sign.filter.GatherFbmbilltypeRefModelFilter"
        };
      };
    }
  });
  //授信信息
  meta["credit"].items.map(item => {
    if (item.attrcode === "ccno") {
      //授信协议添加过滤
      item.queryCondition = () => {
        return {
          //orgunit: this.props.form.getFormItemsValue(this.formId, 'pk_org').value, //组织
          //pk_group: this.props.form.getFormItemsValue(this.formId, 'pk_group').value, //集团
          //bankdoc: this.props.form.getFormItemsValue(this.formId, 'ccbank').value, //授信银行
          protocolstatus: 'NOEXECUTE,EXECUTING',
          orgunit: this.props.form.getFormItemsValue(this.formId, "pk_org")
            .value, //组织
          pk_group: this.props.form.getFormItemsValue(this.formId, "pk_group")
            .value, //集团
          begindate: this.props.form.getFormItemsValue(
            this.formId,
            "invoicedate"
          ).value, //开始日期
          bankdoc: this.props.form.getFormItemsValue(this.formId, "ccbank")
            .value //授信银行
        };
      };
    }
    if (item.attrcode === "pk_cctype") {
      //授信类别根据授信协议过滤
      item.queryCondition = () => {
        let pk_protocol = this.props.form.getFormItemsValue(this.formId, "ccno")
          .value;
        let pk_cctype;
        if (pk_protocol) {
          ajax({
            url: "/nccloud/ccc/bankprotocol/CCTypeGridRef.do",
            async: false,
            data: { pk: pk_protocol },
            success: res => {
              if (res.data) {
                pk_cctype = res.data.join();
              }
            }
          });
        }
        return { pk_cctype: pk_cctype || "null" };
      };
    }
  });
  //保证金
  meta["issecurity"].items.map(item => {
    if (item.attrcode === "securityaccount") {
      //保证金账户过滤
      item.checkStrictly = false;
      item.queryCondition = () => {
        return {
          pk_org: this.props.form.getFormItemsValue(this.formId, "pk_org")
            .value, //组织
          pk_curr:
            this.props.form.getFormItemsValue(this.formId, "pk_curr") &&
            this.props.form.getFormItemsValue(this.formId, "pk_curr").value,
          GridRefActionExt:
            "nccloud.web.fbm.fbm.sign.filter.SecurityAccRefModelFilter,nccloud.web.fbm.fbm.sign.filter.SignPkcurrFilter"
        };
      };
    }
  });
  // 网银信息
  meta["netinfo"].items.map(item => {
    if (item.attrcode === "receiveaccount") {
      //电票签约账户
      item.showHistory = true;
      item.queryCondition = () => {
        let data = this.props.form.getFormItemsValue(this.formId, "pk_org")
          .value;
        return {
          isenableelecbill: "Y",
          pk_org: data,
          pk_curr:
            this.props.form.getFormItemsValue(this.formId, "pk_curr") &&
            this.props.form.getFormItemsValue(this.formId, "pk_curr").value,
          GridRefActionExt:
            "nccloud.web.fbm.ref.filter.BankAccDefaultGridRefFilter,nccloud.web.fbm.fbm.sign.filter.SignPkcurrFilter"
        };
      };
    }
  });
  meta["accept"].items.map(item => {
    if (
      item.attrcode === "signagrbank" ||
      item.attrcode === "pk_signagrbank" ||
      item.attrcode === "acceptorbank" ||
      item.attrcode === "pk_acceptorbank"
    ) {
      // 设置 承兑人、承兑人开户行名对应的参照为录入+参照
      item.checkStrictly = false;
    }
  });
  meta["signapplyinfo"].items.map(item => {
    //内部保证金账户
    if (item.attrcode === "pk_insecurityacc") {
      item.fieldDisplayed = "refcode";
      item.queryCondition = () => {
        let pk_usebillorg =
          this.props.form.getFormItemsValue(this.formId, "pk_usebillorg") &&
          this.props.form.getFormItemsValue(this.formId, "pk_usebillorg").value;
        let pk_curr =
          this.props.form.getFormItemsValue(this.formId, "pk_curr") &&
          this.props.form.getFormItemsValue(this.formId, "pk_curr").value;
        let pk_payfundorg =
          this.props.form.getFormItemsValue(this.formId, "pk_payfundorg") &&
          this.props.form.getFormItemsValue(this.formId, "pk_payfundorg").value;
        return {
          pk_usebillorg: pk_usebillorg,
          pk_curr: pk_curr,
          pk_payfundorg: pk_payfundorg,
          GridRefActionExt:
            "nccloud.web.fbm.fbm.sign.filter.InnerSecurityAccRefModelFilter,nccloud.web.fbm.fbm.sign.filter.SignCurr2InnerAccRefModelFilter"
        };
      };
    }
    //内部结算账户
    if (item.attrcode === "pk_inbalaacc") {
      item.fieldDisplayed = "refcode";
      item.queryCondition = () => {
        let pk_usebillorg =
          this.props.form.getFormItemsValue(this.formId, "pk_usebillorg") &&
          this.props.form.getFormItemsValue(this.formId, "pk_usebillorg").value;
        let pk_curr =
          this.props.form.getFormItemsValue(this.formId, "pk_curr") &&
          this.props.form.getFormItemsValue(this.formId, "pk_curr").value;
        let pk_payfundorg =
          this.props.form.getFormItemsValue(this.formId, "pk_payfundorg") &&
          this.props.form.getFormItemsValue(this.formId, "pk_payfundorg").value;
        return {
          pk_usebillorg: pk_usebillorg,
          pk_curr: pk_curr,
          pk_payfundorg: pk_payfundorg,
          GridRefActionExt:
            "nccloud.web.fbm.fbm.sign.filter.InbalaAccRefModelFilter,nccloud.web.fbm.fbm.sign.filter.SignCurr2InnerAccRefModelFilter"
        };
      };
    }
   
    //用票组织过滤
    if (item.attrcode === "pk_usebillorg") {
      item.queryCondition = () => {
        let pk_payfundorg =
          this.props.form.getFormItemsValue(this.formId, "pk_payfundorg") &&
          this.props.form.getFormItemsValue(this.formId, "pk_payfundorg").value;
        return {
          pk_payfundorg: pk_payfundorg,
          TreeRefActionExt:
            "nccloud.web.fbm.fbm.sign.filter.UseBillOrgRefModelFilter"
        };
      };
    }
    //pk_outfundorg  传出资金组织
    if (item.attrcode === "pk_outfundorg") {
      item.queryCondition = () => {
        let pk_payfundorg =
          this.props.form.getFormItemsValue(this.formId, "pk_org") &&
          this.props.form.getFormItemsValue(this.formId, "pk_org").value;
        return {
          pk_payfundorg: pk_payfundorg,
          TreeRefActionExt:
            "nccloud.web.fbm.fbm.sign.filter.PayFundOrgRefModelFilter"
        };
      };
    }
    // pk_outreckonacc 传出内部清算账户
    if (item.attrcode === "pk_outreckonacc") {
      item.queryCondition = () => {
        let pk_org = this.props.form.getFormItemsValue(this.formId, "pk_org")
          .value; //组织
        let pk_curr =
          this.props.form.getFormItemsValue(this.formId, "pk_curr") &&
          this.props.form.getFormItemsValue(this.formId, "pk_curr").value;
        let pk_outfundorg =
          this.props.form.getFormItemsValue(this.formId, "pk_outfundorg") &&
          this.props.form.getFormItemsValue(this.formId, "pk_outfundorg")
            .value;

        return {
          pk_orgi: pk_org,
          pk_curr:pk_curr,
          pk_outfundorg: pk_outfundorg,
          GridRefActionExt:
            "nccloud.web.fbm.fbm.sign.filter.InnerReckonAccRefModelFilter,nccloud.web.fbm.fbm.sign.filter.SignCurr2InnerAccRefModelFilter"
        };
      };
    }
    //开票计划项目
    // 		if(item.attrcode === 'invoiceplanitem'){
    // 			item.queryCondition = () => {
    // 				let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org') && this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
    // 				let pk_currtype = this.props.form.getFormItemsValue(this.formId, 'pk_currtype') && this.props.form.getFormItemsValue(this.formId, 'pk_currtype').value;

    //                 return {
    // 					pk_org: pk_org,
    // 					pk_currtype: pk_currtype,
    // 					GridRefActionExt:'nccloud.web.fbm.cfbm.signapply.filter.DefaultOutFundplanRefModelFilter'
    //                 };
    //             };
    // 		}
  });
  //担保信息 表体和侧拉编辑框
  ["guarantee", "guarantee_childform2"].forEach(area => {
    meta[area].items.map(item => {
      if (item.attrcode === "pk_guarantee") {
        //担保合同添加过滤
        item.queryCondition = () => {
          let guaranteetype = this.props.form.getFormItemsValue(
            this.formId,
            "impawnmode"
          ).value; //担保方式
          let guatype = null;
          if (guaranteetype == "CREDIT") {
            guatype = "4";
          } else if (guaranteetype == "ASSURE") {
            guatype = "1";
          } else if (guaranteetype == "IMPAWN") {
            guatype = "3";
          } else if (guaranteetype == "PLEDGE") {
            guatype = "2";
          } else if (guaranteetype == "MIXED") {
            guatype = "4";
          }
          return {
            isFbm: "1",
            pk_debtor: this.props.form.getFormItemsValue(this.formId, "pk_org")
              .value, //债务人
            guatype: guatype, //担保方式
            guastartdate: this.props.form.getFormItemsValue(
              this.formId,
              "invoicedate"
            ).value, //开始日期
            guaenddate: this.props.form.getFormItemsValue(
              this.formId,
              "enddate"
            ).value, //开始日期，没写错，就是传开始时间
            pk_currtype: this.props.form.getFormItemsValue(
              this.formId,
              "pk_curr"
            ).value //合同类型为担保合同
          };
        };
      }
    });
  });

  for (let item of Object.keys(meta.gridrelation)) {
    meta[item].items.push({
      attrcode: "opr",
      label:
        this.props.MutiInit.getIntl("36180BS") &&
        this.props.MutiInit.getIntl("36180BS").get(
          "36180BS-000004"
        ) /* 国际化处理： 操作*/,
      itemtype: "customer",
      fixed: "right",
      className: "table-opr",
      visible: true,
      width: 200,
      render: (text, record, index) => {
        let buttonAry = [];
        if (this.props.getUrlParam("status") === "browse") {
          //浏览态
          buttonAry = [record.expandRowStatus ? "fold" : "unfold"];
        } else {
          buttonAry = ["expand", "insertRow", "delRow"];
        }
        return this.props.button.createOprationButton(buttonAry, {
          area: CARD.body_btn_code,
          onButtonClick: (props, key) =>
            bodyButtonClick.call(this, props, key, text, record, index)
        });
      }
    });
  }

  return meta;
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/