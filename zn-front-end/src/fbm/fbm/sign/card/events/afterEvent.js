/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/
//表头编辑后事件
import { ajax, toast, promptBox } from "nc-lightapp-front";
import { cardEvent } from "../../../../public/container/index";
import { setHeadItemsDisabled } from "../../../../public/container/page";
import { setHeadItemProp } from "../../../../pub/utils/FBMAfterEditUtil.js";
export function afterEvent(props, moduleId, key, value, oldValue) {
  const eventDatas = this.props.createTabsAfterEventData(
    this.pageId,
    this.formId,
    this.tabOrder,
    moduleId,
    key,
    value
  ); //编辑后事件整单数据
  let eventData = {
    eventPosition: "head",
    eventType: "card",
    eventData: JSON.stringify(eventDatas)
  };
  const commonAfterEventArr = [
    "repprcact",
    "olcrate",
    "creditamount",
    "glcrate",
    "gllcrate"
  ]; //还本金额/本币汇率/释放授信额度
  if (key === "pk_org") {//财务组织
    this.props.resMetaAfterPkorgEdit();
    if (!oldValue || !oldValue.value) {
      //编辑后事件
      cardEvent.changeOrg
        .call(this, value, () => {})
        .then(() => {
          if (value.value) {
            cardEvent.getAfterEventData.call(this, eventData).then(res => {
              setAfterEditFormValue.call(this, this.props, res);
            });
          }
        });
      // 银承的时候 承兑类型、承兑人账号是否同行 不可编辑
      this.props.form.setFormItemsDisabled(this.formId, {
        acceptortype: true,
        acceptorisicbc: true
      });
    } else {
      promptBox({
        color: "warning",
        title:
          this.props.MutiInit.getIntl("36180BS") &&
          this.props.MutiInit.getIntl("36180BS").get(
            "36180BS-000000"
          ) /* 国际化处理： 修改财务组织*/,
        content:
          this.props.MutiInit.getIntl("36180BS") &&
          this.props.MutiInit.getIntl("36180BS").get(
            "36180BS-000001"
          ) /* 国际化处理： 确认修改财务组织, 这样会清空您录入的信息?*/,
        beSureBtnClick: () => {
          changeOrg.call(this, value, eventData);
        },
        cancelBtnClick: () => {
          props.form.setFormItemsValue(this.formId, { pk_org: oldValue });
        }
      });
    }
  } else if (key === "impawnmode") {//担保方式   
    props.cardTable.setTabData("guarantee", { rows: [] });
    //保证金
    if (value.value !== oldValue.value) {
      this.props.button.setButtonDisabled(["addRow", "delRow"], true); //恢复增行编辑性
      //票据池	根据担保方式决定 保证金和票据池的编辑性
      if (value.value === "BILLPOOL") {
        this.props.button.setButtonDisabled(["addRow", "delRow"], true); //恢复增行编辑性 ，并且必输
        this.props.form.setFormItemsDisabled(this.formId, {
          occucommoney: false,
          occusharemoney: false,
          downquotaflag: false,
          initpoolflag: false
        });
        // 设置单位额度，共享额度为必输项，目前需求又说不需要了，屏蔽掉，但是需要增加一个保存校验:单位额度，共享额度不可同时为空
        // this.props.form.setFormItemsRequired(this.formId, {
        // 	occucommoney: true,
        // 	occusharemoney: true,
        // });
      } else {
        if (value.value === "CREDIT") {
          this.props.button.setButtonDisabled(["addRow", "delRow"], true);
          this.props.form.setFormItemsDisabled(this.formId, {
            pk_insecurityacc: true,
            innersecurityrate: true,
            innersecurityamount: true
          });
        } else {
          this.props.button.setButtonDisabled(["addRow", "delRow"], false); //恢复增行编辑性
          this.props.form.setFormItemsDisabled(this.formId, {
            pk_insecurityacc: false,
            innersecurityrate: false,
            innersecurityamount: false
          });
        }

        this.props.form.setFormItemsDisabled(this.formId, {
          occucommoney: true,
          occusharemoney: true,
          olcoccucommoney: true,
          olcoccusharemoney: true,
          initpoolflag: true,
          downquotaflag: true
        });
        this.props.form.setFormItemsRequired(this.formId, {
          initpoolflag: false,
          occucommoney: false,
          occusharemoney: false,
          olcoccucommoney: false,
          olcoccusharemoney: false
        });
        //当担保方式为信用，保证时候，需要控制表体字段的必输
        this.props.form.setFormItemsValue(this.formId, {
          initpoolflag: {
            display: "",
            value: ""
          },

          occucommoney: {
            display: "",
            value: ""
          },
          occusharemoney: {
            display: "",
            value: ""
          },
          olcoccucommoney: {
            display: "",
            value: ""
          },
          olcoccusharemoney: {
            display: "",
            value: ""
          }
        });
      }
    }
  } else if (key === "ccno") {//授信协议   
    if (value.value !== oldValue.value && value.value) {
       //如果授信协议清空的时候，清空其带出的值啊
       this.props.form.setFormItemsValue(this.formId, {
        pk_cccurrtype: {
          display: "",
          value: ""
        },
        pk_cctype: {
          display: "",
          value: ""
        },
        usedccamount: {
          display: "",
          value: ""
        },
        olcccamount: {
          display: "",
          value: ""
        }
      });
      cardEvent.getAfterEventData.call(this, eventData).then(res => {
        // this.props.form.setAllFormValue({
        // 	[this.formId]: res.data.head && res.data.head[this.formId]
        // });
        setAfterEditFormValue.call(this, this.props, res);
        this.props.form.setFormItemsDisabled(this.formId, {
          //pk_cccurrtype: false,
          pk_cctype: false,
          usedccamount: false
          //olcccamount: false,
        });
      });
    } else {
      //如果授信协议清空的时候，清空其带出的值啊
      this.props.form.setFormItemsValue(this.formId, {
        pk_cccurrtype: {
          display: "",
          value: ""
        },
        pk_cctype: {
          display: "",
          value: ""
        },
        usedccamount: {
          display: "",
          value: ""
        },
        olcccamount: {
          display: "",
          value: ""
        }
      });
      this.props.form.setFormItemsDisabled(this.formId, {
        pk_cccurrtype: true,
        pk_cctype: true,
        usedccamount: true,
        olcccamount: true
      });
    }
  } else if (key === "pk_curr") {//币种   
    if (value.value !== oldValue.value && value.value) {
      cardEvent.getAfterEventData.call(this, eventData).then(res => {
        setAfterEditFormValue.call(this, this.props, res);
      });
    }
  } else if (
    key === "olcrate" ||
    key === "poundagemoney" ||
    key === "usedccamount" ||
    key === "money" ||
    key === "invoicedate" ||
    key === "occucommoney" ||
    key === "occusharemoney" ||
    key === "innerpoundageamount" ||
    key === "innersecurityamount"
  ) {
    if (value.value !== oldValue.value) {
      if (key === "securitymoney") {
        if (value.value <= 0) {
          toast({
            color: "warning",
            content:
              this.props.MutiInit.getIntl("36180BS") &&
              this.props.MutiInit.getIntl("36180BS").get("36180BS-000002")
          }); /* 国际化处理： 金额不能等于零*/
          return;
        }
      } else if (key === "innersecurityamount") {
        if (value.value > 0) {
          //设置必输
          this.props.form.setFormItemsRequired("signapplyinfo", {
            pk_insecurityacc: true
          });
        } else {
          this.props.form.setFormItemsRequired("signapplyinfo", {
            pk_insecurityacc: false
          });
        }
      }
      cardEvent.getAfterEventData.call(this, eventData).then(res => {
        let notuse = res.data.card.userjson;
        if (notuse) {
          toast({
            color: "warning",
            content:
              this.props.MutiInit.getIntl("36180BS") &&
              this.props.MutiInit.getIntl("36180BS").get("36180BS-000020")
          }); /* 国际化处理： 共享余额不足*/
        }
        setAfterEditFormValue.call(this, this.props, res);
      });
    }
  } else if (key === "securityrate") {//保证金比例  
    if (value.value !== oldValue.value && value.value) {
      if (value.value <= 0) {
        toast({
          color: "warning",
          content:
            this.props.MutiInit.getIntl("36180BS") &&
            this.props.MutiInit.getIntl("36180BS").get("36180BS-000017")
        }); /* 国际化处理： 保证金比例不能小于零*/
        this.props.form.setFormItemsValue(this.formId, {
          securityrate: { display: "", value: "" }
        });
        return;
      }
      let securityrate = value.value;
      if (Number(securityrate) > 100) {
        toast({
          color: "warning",
          content:
            this.props.MutiInit.getIntl("36180BS") &&
            this.props.MutiInit.getIntl("36180BS").get("36180BS-000019")
        }); /* 国际化处理： 保证金比例不能超过100*/
        this.props.form.setFormItemsValue(this.formId, {
          securityrate: { display: "", value: "" }
        });
        return;
      }
      cardEvent.getAfterEventData.call(this, eventData).then(res => {
        setAfterEditFormValue.call(this, this.props, res);
      });
    }
  } else if (key === "securitymoney") {//保证金
    if (value && value.value) {
      if (value.value <= 0) {
        toast({
          color: "warning",
          content:
            this.props.MutiInit.getIntl("36180BS") &&
            this.props.MutiInit.getIntl("36180BS").get("36180BS-000002")
        }); /* 国际化处理： 金额不能小于零*/
        this.props.form.setFormItemsValue(this.formId, {
          securitymoney: { display: "", value: "" }
        });
        return;
      }
      let securitymoney = value.value;
      let money =
        props.form.getFormItemsValue(this.formId, "money") &&
        props.form.getFormItemsValue(this.formId, "money").value;
      if (Number(securitymoney) > Number(money)) {
        toast({
          color: "warning",
          content:
            this.props.MutiInit.getIntl("36180BS") &&
            this.props.MutiInit.getIntl("36180BS").get("36180BS-000018")
        }); /* 国际化处理： 保证金额已超过票据金额*/
      }
      cardEvent.getAfterEventData.call(this, eventData).then(res => {
        setAfterEditFormValue.call(this, this.props, res);
      });
    }
  } else if (key === "pk_payacc") { // 出票人账号(参照)，需要给出票人开户行赋值
    if (!value || !value.refpk) {
      props.form.setFormItemsValue(this.formId, {
        pk_paybank: { value: "", display: "" }
      });
      return;
    }
    let accpk = value.refpk;
    let acccode = value.refcode;
    let bankpk = value.values && value.values["bd_bankdoc.pk_bankdoc"];
    let bankname = value.values && value.values["bd_bankdoc.name"].value;
    if (bankname) {
      bankpk["display"] = bankname;
    }
    // 给出票人开户行赋值
    props.form.setFormItemsValue(this.formId, { pk_paybank: bankpk });
   
    cardEvent.getAfterEventData
    .call(this, eventData)
    .then(res => {
      setAfterEditFormValue.call(this, this.props, res);
      let fbmbilltype = res.data.card.userjson;
      if (fbmbilltype === "isBank") {
         // 银行承兑汇票时  承兑人 = 承兑人开户行名 = 出票人开户行
        props.form.setFormItemsValue(this.formId, { signagrbank: bankpk });
        props.form.setFormItemsValue(this.formId, { acceptorbank: bankpk });
  
        props.form.setFormItemsVisible(this.formId, {
          pk_signagrbank: false,
          pk_acceptorbank: false,
          signagrbank: true,
          acceptorbank: true
        });
        props.form.setFormItemsValue(this.formId, {
          pk_acceptorbank: { value: null },
          pk_signagrbank: { value: null }
        });
        // 银承的时候 承兑类型不可编辑
        this.props.form.setFormItemsDisabled(this.formId, {
          acceptortype: true,
          acceptorisicbc: true
        });
        props.form.setFormItemsValue(this.formId, {
          //承兑人
          acceptorname: {
            value: props.form.getFormItemsValue(this.formId, "signagrbank")
              .display
          },
          //承兑人开户行名
          signagrbankname: {
            value:
              props.form.getFormItemsValue(this.formId, "acceptorbank").display ==
              " "
                ? props.form.getFormItemsValue(this.formId, "acceptorbank").value
                : props.form.getFormItemsValue(this.formId, "acceptorbank")
                    .display
          }
        });
      } else if (fbmbilltype === "isBus") {
        // 商承时 出票人 = 主组织 = 承兑人
        let pk_org = props.form.getFormItemsValue(this.formId, "pk_org");
        //props.form.setFormItemsValue(this.formId, { 'pk_signagrbank': pk_org });
        props.form.setFormItemsVisible(this.formId, {
          signagrbank: false,
          acceptorbank: false,
          pk_signagrbank: true,
          pk_acceptorbank: true
        });
        props.form.setFormItemsValue(this.formId, {
          signagrbank: { value: null },
          acceptorbank: { value: null }
        });
        // 商业汇票 承兑类型可编辑
        props.form.setFormItemsDisabled(this.formId, {
          acceptortype: false,
          acceptorisicbc: false
        });
        props.form.setFormItemsValue(this.formId, {
          //承兑人
          acceptorname: {
            value:
              props.form.getFormItemsValue(this.formId, "pk_signagrbank")
                .display == " "
                ? props.form.getFormItemsValue(this.formId, "pk_signagrbank")
                    .value
                : props.form.getFormItemsValue(this.formId, "pk_signagrbank")
                    .display
          },
          //承兑人开户行名
          signagrbankname: {
            value: props.form.getFormItemsValue(this.formId, "pk_acceptorbank")
              .display
          }
        });
      }
    })
  } else if (key === "hidereceivebankacc") {//收款银行账户修改后，清空收款人账号  
    if (value.value !== oldValue.value && value.value) {
      cardEvent.getAfterEventData.call(this, eventData).then(res => {
        setAfterEditFormValue.call(this, this.props, res);
      });
    } else {
      this.props.form.setFormItemsValue(this.formId, {
        hidereceivebank: {
          display: "",
          value: ""
        }
      });
    }
  } else if (key === "pk_paybank") {//出票人开户行(参照银行档案)  修改后，清空出票人账号
    if (value.value !== oldValue.value && value.value !== "") {
      cardEvent.getAfterEventData.call(this, eventData).then(res => {
        this.props.form.setFormItemsValue(this.formId, {
          pk_payacc: {
            display: "",
            value: ""
          }
        });
      });
    }
  } else if (key === "acceptorbank") {//承兑人开户行名(参照银行档案)
    if (value.value !== oldValue.value) {
      cardEvent.getAfterEventData
        .call(this, eventData)
        .then(res => {
          setAfterEditFormValue.call(this, this.props, res);
        })
        .then(() => {
          props.form.setFormItemsValue(this.formId, {
            signagrbankname: {
              value: props.form.getFormItemsValue(this.formId, "acceptorbank")
                .display
            }
          });
        });
    }
  } else if (key === "pk_acceptorbank") {//承兑人开户行名(参照客商档案)
    if (value.value !== oldValue.value) {
      cardEvent.getAfterEventData
        .call(this, eventData)
        .then(res => {
          setAfterEditFormValue.call(this, this.props, res);
        })
        .then(() => {
          props.form.setFormItemsValue(this.formId, {
            signagrbankname: {
              value: props.form.getFormItemsValue(
                this.formId,
                "pk_acceptorbank"
              ).display
            }
          });
        });
    }
  } else if (key === "hidereceivebank") {//收款银行修改后，清空收款人账号
    if (value.value !== oldValue.value && value.value) {
      cardEvent.getAfterEventData.call(this, eventData).then(res => {
        setAfterEditFormValue.call(this, this.props, res);
      });
    } else {
      this.props.form.setFormItemsValue(this.formId, {
        hidereceivebankacc: {
          display: "",
          value: ""
        }
      });
    }
  } else if (key === "issecurity") {//保证金 勾选的话  可编辑且必输
    if (value.value !== oldValue.value && value.value !== false) {
      cardEvent.getAfterEventData.call(this, eventData).then(res => {
        this.props.form.setFormItemsDisabled(this.formId, {
          securityaccount: false,
          securityrate: false,
          securitymoney: false,
          olcsecuritymoney: true
        });
        this.props.form.setFormItemsRequired(this.formId, {
          securityaccount: true,
          securityrate: true,
          securitymoney: true,
          olcsecuritymoney: true
        });
      });
    } else {
      cardEvent.getAfterEventData.call(this, eventData).then(res => {
        this.props.form.setFormItemsDisabled(this.formId, {
          securityaccount: true,
          securityrate: true,
          securitymoney: true,
          olcsecuritymoney: true
        });
        this.props.form.setFormItemsRequired(this.formId, {
          securityaccount: false,
          securityrate: false,
          securitymoney: false,
          olcsecuritymoney: false
        });
        this.props.form.setFormItemsValue(this.formId, {
          securityaccount: {
            display: "",
            value: ""
          },
          securityrate: {
            display: "",
            value: ""
          },
          securitymoney: {
            display: "",
            value: ""
          },
          olcsecuritymoney: {
            display: "",
            value: ""
          }
        });
      });
    }
  } else if (key === "fbmbillno") {
    if (value.value !== oldValue.value && value.value) {
      cardEvent.getAfterEventData.call(this, eventData).then(res => {
        setAfterEditFormValue.call(this, this.props, res);

        // 票据类型控制 承兑人、承兑人开户行名对应的显示字段
        let fbmbilltype = res.data.card.userjson;
        let pk_paybank = res.data.card.head.head.rows["0"].values.pk_paybank;
        // 银行汇票
        if (fbmbilltype === "isBank") {
          props.form.setFormItemsValue(this.formId, {
            signagrbank: pk_paybank
          });
          props.form.setFormItemsValue(this.formId, {
            acceptorbank: pk_paybank
          });
          props.form.setFormItemsVisible(this.formId, {
            pk_signagrbank: false,
            pk_acceptorbank: false,
            signagrbank: true,
            acceptorbank: true
          });
          props.form.setFormItemsValue(this.formId, {
            pk_acceptorbank: { value: null },
            pk_signagrbank: { value: null }
          });
          // 银承的时候 承兑类型不可编辑
          this.props.form.setFormItemsDisabled(this.formId, {
            acceptortype: true,
            acceptorisicbc: true
          });
        } // 商业汇票
        else if (fbmbilltype === "isBus") {
          // 商承时 出票人 = 主组织 = 承兑人
          let pk_org = props.form.getFormItemsValue(this.formId, "pk_org");
          //props.form.setFormItemsValue(this.formId, { 'pk_signagrbank': pk_org });
          props.form.setFormItemsVisible(this.formId, {
            signagrbank: false,
            acceptorbank: false,
            pk_signagrbank: true,
            pk_acceptorbank: true
          });
          props.form.setFormItemsValue(this.formId, {
            signagrbank: { value: null },
            acceptorbank: { value: null }
          });
          // 商业汇票 承兑类型可编辑
          props.form.setFormItemsDisabled(this.formId, {
            acceptortype: false,
            acceptorisicbc: false
          });
        }
      });
    }
  } else if (key === "fbmbilltype") {
    // 票据类型控制网银是否可编辑
    if (value.value !== oldValue.value && value.value) {
      cardEvent.getAfterEventData.call(this, eventData).then(res => {
        setAfterEditFormValue.call(this, this.props, res);
        let pk_paybank = res.data.card.head.head.rows["0"].values.pk_paybank;
        props.form.setFormItemsValue(this.formId, { signagrbank: pk_paybank });
        props.form.setFormItemsValue(this.formId, { acceptorbank: pk_paybank });
        let fbmbilltype = res.data.card.userjson;
        if (fbmbilltype === "isBank") {
          //银承
          props.form.setFormItemsVisible(this.formId, {
            pk_signagrbank: false,
            pk_acceptorbank: false,
            signagrbank: true,
            acceptorbank: true
          });
          props.form.setFormItemsValue(this.formId, {
            pk_acceptorbank: { value: null },
            pk_signagrbank: { value: null }
          });
          // 银承的时候 承兑类型不可编辑
          this.props.form.setFormItemsDisabled(this.formId, {
            acceptortype: true,
            acceptorisicbc: true
          });
          // 银承时，承兑人开户行号默认为0，商承兑为null
          // props.form.setFormItemsValue(this.formId, {
          // 	'acceptorbankaccount': { value: '0',display: '0' },
          // 	'signagrbanknum': { value: '0',display: '0' }
          // })
          
          props.form.setFormItemsValue(this.formId, {
            signagrbankname: {
              value: props.form.getFormItemsValue(this.formId, "signagrbank")
                .display
            },
            acceptorname: {
              value: props.form.getFormItemsValue(this.formId, "signagrbank")
                .display
            }
          });
        } else if (fbmbilltype === "isBus") {
          //商承
          props.form.setFormItemsVisible(this.formId, {
            signagrbank: false,
            acceptorbank: false,
            pk_signagrbank: true,
            pk_acceptorbank: true
          });
          props.form.setFormItemsValue(this.formId, {
            signagrbank: { value: null },
            acceptorbank: { value: null }
          });
          // 商业汇票 承兑类型可编辑
          props.form.setFormItemsDisabled(this.formId, {
            acceptortype: false,
            acceptorisicbc: false
          });
          props.form.setFormItemsValue(this.formId, {
            signagrbankname: {
              value: props.form.getFormItemsValue(this.formId, "pk_signagrbank")
                .display
            },
            acceptorname: {
              value:
                props.form.getFormItemsValue(this.formId, "pk_signagrbank")
                  .display == " "
                  ? props.form.getFormItemsValue(this.formId, "pk_signagrbank")
                      .value
                  : props.form.getFormItemsValue(this.formId, "pk_signagrbank")
                      .display
            }
          });
        }
      });
    } else {
      // 票据类型清空时，清空 出票人账号 、出票人开户银行 及承兑人  。因为其发生变更的时候，会决定承兑人显示
      props.form.setFormItemsValue(this.formId, {
        pk_payacc: { value: null, display: null },
        pk_paybank: { value: null, display: null },
        "signagrbank ": { value: null, display: null },
        pk_signagrbank: { value: null, display: null }
      });
    }
    // 商承时 出票人 = 主组织 = 承兑人 =承兑人开户行名
    // let pk_org = props.form.getFormItemsValue(this.formId, 'pk_org');
    // props.form.setFormItemsValue(this.formId, { 'pk_signagrbank': pk_org });
    // props.form.setFormItemsValue(this.formId, { 'pk_acceptorbank': pk_org });
    // props.form.setFormItemsValue(this.formId, { 'acceptorname': pk_org.display });
    // props.form.setFormItemsValue(this.formId, { 'signagrbankname': pk_org.display });
  } else if (key === "downquotaflag") {
    // 使用下拨额度
    if (value.value !== oldValue.value && value.value) {
      cardEvent.getAfterEventData
        .call(this, eventData)
        .then(res => {
          setAfterEditFormValue.call(this, this.props, res);
        })
        .catch(res => {
          // 后端返回异常的时候，清空其值
          props.form.setFormItemsValue(this.formId, {
            downquotaflag: { value: null }
          });
        });
    }
  } else if (key === "acceptorbankaccount") {//承兑人开户行号(参照人行联行信息)
    if (value.value !== oldValue.value) {
      cardEvent.getAfterEventData
        .call(this, eventData)
        .then(res => {
          setAfterEditFormValue.call(this, this.props, res);
        })
        .then(() => {
          props.form.setFormItemsValue(this.formId, {
            signagrbanknum: {
              // 给其赋值，用以报表显示
              value: props.form.getFormItemsValue(
                this.formId,
                "acceptorbankaccount"
              ).display
            }
          });
        });
    } else {
      props.form.setFormItemsValue(this.formId, {
        signagrbanknum: {
          // 给其赋值，用以报表显示
          value: null
        }
      });
    }
  } else if (key === "signagrbank") { //承兑人(参照银行档案)
    if (value.value !== oldValue.value) {
      cardEvent.getAfterEventData
        .call(this, eventData)
        .then(res => {
          setAfterEditFormValue.call(this, this.props, res);
        })
        .then(() => {
          props.form.setFormItemsValue(this.formId, {
            signagrbankname: {
              value: props.form.getFormItemsValue(this.formId, "signagrbank")
                .display
            },
            acceptorname: {
              value: props.form.getFormItemsValue(this.formId, "signagrbank")
                .display
            }
          });
        });
    }
  } else if (key === "pk_signagrbank") {//承兑人(参照客商档案)
    if (value.value !== oldValue.value) {
      cardEvent.getAfterEventData
        .call(this, eventData)
        .then(res => {
          setAfterEditFormValue.call(this, this.props, res);
        })
        .then(() => {
          props.form.setFormItemsValue(this.formId, {
            signagrbankname: {
              value: props.form.getFormItemsValue(this.formId, "pk_signagrbank")
                .display
            },
            acceptorname: {
              value:
                props.form.getFormItemsValue(this.formId, "pk_signagrbank")
                  .display == " "
                  ? props.form.getFormItemsValue(this.formId, "pk_signagrbank")
                      .value
                  : props.form.getFormItemsValue(this.formId, "pk_signagrbank")
                      .display
            }
          });
        });
    }
  } else if (key === "cyberbankflag") {//网银
    // 重量端校验的时候用的是onlinebankflag，但是页面也是cyberbankflag
    if (value.value !== oldValue.value && value.value) {
      props.form.setFormItemsValue(this.formId, { onlinebankflag: value });

      this.props.form.setFormItemsRequired(this.formId, {
        fbmbillno2: false, // 设置票据号码2非必输
        fbmbillno: false,
        pk_banktype: true, // 银行类别必输
        receiveaccount: true //电票签约账户必输
      });
      props.form.setFormItemsVisible(this.formId, {
        fbmbillno2: true,
        fbmbillno: false
      });
      cardEvent.getAfterEventData.call(this, eventData).then(res => {
        setAfterEditFormValue.call(this, this.props, res);
      });
    } else {
      props.form.setFormItemsValue(this.formId, { onlinebankflag: null });
      this.props.form.setFormItemsRequired(this.formId, {
        fbmbillno: true,
        fbmbillno2: true,
        pk_banktype: false,
        receiveaccount: false //电票签约账户必输
      });
      props.form.setFormItemsVisible(this.formId, {
        fbmbillno2: false,
        fbmbillno: true
      });
      props.form.setFormItemsValue(this.formId, { fbmbillno: null });
      props.form.setFormItemsValue(this.formId, { fbmbillno2: null });

      this.props.form.setFormItemsDisabled(this.formId, {
        fbmbillno: false
      });
    }
  } else if (key === "pk_payunit") {//出票人(参照财务组织) 
    if (value.value !== oldValue.value) {
      cardEvent.getAfterEventData
        .call(this, eventData)
        .then(res => {
          setAfterEditFormValue.call(this, this.props, res);
        })
        .then(() => {
          props.form.setFormItemsValue(this.formId, {
            payunit: {
              // 给其赋值，用以报表显示
              value: props.form.getFormItemsValue(this.formId, "pk_payunit")
                .display
            }
          });
        });
    } else {
      props.form.setFormItemsValue(this.formId, {
        payunit: {
          // 给其赋值，用以报表显示
          value: null
        }
      });
    }
  } else if (key === "pk_payacc") {//出票人账号 
    if (value.value !== oldValue.value) {
      cardEvent.getAfterEventData
        .call(this, eventData)
        .then(res => {
          setAfterEditFormValue.call(this, this.props, res);
        })
        .then(() => {
          props.form.setFormItemsValue(this.formId, {
            paybankacc: {
              // 给其赋值，用以报表显示
              value: props.form.getFormItemsValue(this.formId, "pk_payacc")
                .display
            }
          });
          props.form.setFormItemsValue(this.formId, {
            payunit: {
              // 给其赋值，用以报表显示
              value: props.form.getFormItemsValue(this.formId, "pk_payunit")
                .display
            }
          });
        });
    } else {
      props.form.setFormItemsValue(this.formId, {
        paybankacc: {
          // 给其赋值，用以报表显示
          value: null
        }
      });
      props.form.setFormItemsValue(this.formId, {
        payunit: {
          // 给其赋值，用以报表显示
          value: null
        }
      });
    }
  } else if (key === "pk_paybank") {//出票人开户银行
    if (value.value !== oldValue.value) {
      cardEvent.getAfterEventData
        .call(this, eventData)
        .then(res => {
          setAfterEditFormValue.call(this, this.props, res);
        })
        .then(() => {
          props.form.setFormItemsValue(this.formId, {
            paybank: {
              // 给其赋值，用以报表显示
              value: props.form.getFormItemsValue(this.formId, "pk_paybank")
                .display
            }
          });
        });
    } else {
      props.form.setFormItemsValue(this.formId, {
        paybank: {
          // 给其赋值，用以报表显示
          value: null
        }
      });
    } 
  } else if (key === 'receiveunit' ) {//收款人(文本)修改后，清空收款人账号

		if (value.value !== oldValue.value  && value.value) {
			if(value.value !== value.display){
				this.props.form.setFormItemsValue(this.formId, {
					'hidereceiveunit': {
						value: this.props.form.getFormItemsValue(this.formId, 'receiveunit').value
				},
				}); 
			}else{
				this.props.form.setFormItemsValue(this.formId, {
					'hidereceiveunit': {
						display: '',
						value: ''
					},
				});
			}
			this.props.form.setFormItemsValue(this.formId, {
				'receiveunit': {
					value: this.props.form.getFormItemsValue(this.formId, 'receiveunit').display,
					display: this.props.form.getFormItemsValue(this.formId, 'receiveunit').display
			},
			});
			this.props.form.setFormItemsValue(this.formId, {
				'receivebankacc': {
					value: "",
					display: ""
			},
			});
		}else{
			this.props.form.setFormItemsValue(this.formId, {
				'hidereceiveunit': {
					display: '',
					value: ''
				},
			});
		}

	} else if (key === "hidereceiveunit") {//收款人(参照客商档案)
    if (value.value !== oldValue.value) {
      cardEvent.getAfterEventData
        .call(this, eventData)
        .then(res => {
          setAfterEditFormValue.call(this, this.props, res);
        })
        .then(() => {
          props.form.setFormItemsValue(this.formId, {
            receiveunit: {
              // 给其赋值，用以报表显示
              value: props.form.getFormItemsValue(
                this.formId,
                "hidereceiveunit"
              ).display
            }
          });
        });
    } else {
      props.form.setFormItemsValue(this.formId, {
        receiveunit: {
          // 给其赋值，用以报表显示
          value: null
        }
      });
    }
  } else if (key === 'receivebankacc' ) {//收款人账户(文本)修改后，清空收款人账号
    if (value.value !== oldValue.value  && value.value) {
     let refcode=value.refcode;
     let refpk=value.value;
       if (value.value !== value.display) {
         cardEvent.getAfterEventData
           .call(this, eventData)
           .then(res => {
             setAfterEditFormValue.call(this, this.props, res); 
             this.props.form.setFormItemsValue(this.formId, {
              'receivebankacc': {
                value: refcode,
                display: refcode,
              },
            });
             let hidereceivebank = res.data.card.head.head.rows[0].values.hidereceivebank;
             this.props.form.setFormItemsValue(this.formId, {
               'receivebank': {
                 value: hidereceivebank.display,
                 display: hidereceivebank.display,
               },
               'hidereceivebank': {
                 value: hidereceivebank.value,
                 display: hidereceivebank.display,
               },
             }); 
           })
           .then(() => {
             this.props.form.setFormItemsValue(this.formId, {
               hidereceivebankacc: {
                 value: refpk
               }
             });
           });
       } else {
         this.props.form.setFormItemsValue(this.formId, {
           hidereceivebankacc: {
             display: "",
             value: ""
           }
         });
       }  
      
     }else{
       this.props.form.setFormItemsValue(this.formId, {
         'receivebank': {
           display: '',
           value: ''
         },
         'hidereceivebankacc': {
           display: '',
           value: ''
         },
       });
     }
 }  else if (key === "hidereceivebankacc") {//收款人账号(参照客商银行账户)
    if (value.value !== oldValue.value) {
      cardEvent.getAfterEventData
        .call(this, eventData)
        .then(res => {
          setAfterEditFormValue.call(this, this.props, res);
        })
        .then(() => {
          props.form.setFormItemsValue(this.formId, {
            receivebankacc: {
              // 给其赋值，用以报表显示
              value: props.form.getFormItemsValue(
                this.formId,
                "hidereceivebankacc"
              ).display
            }
          });
        });
    } else {
      props.form.setFormItemsValue(this.formId, {
        receivebankacc: {
          // 给其赋值，用以报表显示
          value: null
        }
      });
    }
  } else if (key === 'receivebank') {//收款银行修改后，清空收款人账号
    if (value.value !== oldValue.value && value.value) {
			if(value.value !== value.display){
				this.props.form.setFormItemsValue(this.formId, {
					'hidereceivebank': {
						value: this.props.form.getFormItemsValue(this.formId, 'receivebank').value
					},
				}); 
			}else{
				this.props.form.setFormItemsValue(this.formId, {
					'hidereceivebank': {
						display: '',
						value: ''
					},
				}); 
			}
			this.props.form.setFormItemsValue(this.formId, {
				'receivebank': {
					value: this.props.form.getFormItemsValue(this.formId, 'receivebank').display,
					display: this.props.form.getFormItemsValue(this.formId, 'receivebank').display
				},
			}); 
			// cardEvent.getAfterEventData.call(this, eventData).then(res => {
			// 	setAfterEditFormValue.call(this, this.props, res);
			// });
		}else{
			this.props.form.setFormItemsValue(this.formId, {
				'receivebankacc': {
					display: '',
					value: ''
				},
				'hidereceivebank': {
					display: '',
					value: ''
				},
			});
		}

	} else if (key === "hidereceivebank") {//收款人开户银行(参照银行档案 )
    if (value.value !== oldValue.value) {
      cardEvent.getAfterEventData
        .call(this, eventData)
        .then(res => {
          setAfterEditFormValue.call(this, this.props, res);
        })
        .then(() => {
          props.form.setFormItemsValue(this.formId, {
            receivebank: {
              // 给其赋值，用以报表显示
              value: props.form.getFormItemsValue(
                this.formId,
                "hidereceivebank"
              ).display
            }
          });
        });
    } else {
      props.form.setFormItemsValue(this.formId, {
        receivebank: {
          // 给其赋值，用以报表显示
          value: null
        }
      });
    }
  } else if (key === "applybillno") {
    if (value.value !== oldValue.value) {
      cardEvent.getAfterEventData
        .call(this, eventData)
        .then(res => {
          setAfterEditFormValue.call(this, this.props, res);
          let hidereceivebank = res.data.card.head.head.rows[0].values.hidereceivebank;
          let hidereceiveunit = res.data.card.head.head.rows[0].values.hidereceiveunit;
          let hidereceivebankacc = res.data.card.head.head.rows[0].values.hidereceivebankacc;
          this.props.form.setFormItemsValue(this.formId, {
            'receivebank': {
              value: hidereceivebank.display,
              display: hidereceivebank.display,
            },
            'receiveunit': {
              value: hidereceiveunit.display,
              display: hidereceiveunit.display,
            },
            'receivebankacc': {
              value: hidereceivebankacc.display,
              display: hidereceivebankacc.display,
            }
          }); 
        })
        .then(() => {});
    } else {
    }
  } else if (key === "isagent") {//代理开票
    props.form.openArea("signapplyinfo");
    if (value.value !== oldValue.value) {
      cardEvent.getAfterEventData
        .call(this, eventData)
        .then(res => {
          setAfterEditFormValue.call(this, this.props, res);
        })
        .then(() => {});
    } else {
    }
  } else if (key === "applybillnobyaccept") {
    props.form.openArea("signapplyinfo");
    if (value.value !== oldValue.value) {
      cardEvent.getAfterEventData
        .call(this, eventData)
        .then(res => {
          setAfterEditFormValue.call(this, this.props, res);
          let hidereceivebank = res.data.card.head.head.rows[0].values.hidereceivebank;
          let hidereceiveunit = res.data.card.head.head.rows[0].values.hidereceiveunit;
          let hidereceivebankacc = res.data.card.head.head.rows[0].values.hidereceivebankacc;
          this.props.form.setFormItemsValue(this.formId, {
            'receivebank': {
              value: hidereceivebank.display,
              display: hidereceivebank.display,
            },
            'hidereceivebank': {
              value: hidereceivebank.value,
              display: hidereceivebank.display,
            },
            'receiveunit': {
              value: hidereceiveunit.display,
              display: hidereceiveunit.display,
            },
            'hidereceiveunit': {
              value: hidereceiveunit.value,
              display: hidereceiveunit.display,
            },
            'receivebankacc': {
              value: hidereceivebankacc.display,
              display: hidereceivebankacc.display,
            },
            'hidereceivebankacc': {
              value: hidereceivebankacc.value,
              display: hidereceivebankacc.display,
            },
          }); 

          let olcrate = res.data.card.head.head.rows[0].values.olcrate;
          let glcrate = res.data.card.head.head.rows[0].values.glcrate;
          let gllcrate = res.data.card.head.head.rows[0].values.gllcrate;
          if (olcrate && Number(olcrate.value) === 1) {
            this.props.form.setFormItemsDisabled(this.formId, {
              olcrate: true
            });
          } else {
            this.props.form.setFormItemsDisabled(this.formId, {
              olcrate: false
            });
          }
          if (glcrate && Number(glcrate.value) === 1) {
            this.props.form.setFormItemsDisabled(this.formId, {
              glcrate: true
            });
          } else {
            this.props.form.setFormItemsDisabled(this.formId, {
              glcrate: false
            });
          }
          if (gllcrate && Number(gllcrate.value) === 1) {
            this.props.form.setFormItemsDisabled(this.formId, {
              gllcrate: true
            });
          } else {
            this.props.form.setFormItemsDisabled(this.formId, {
              gllcrate: false
            });
          }
        })
        .then(() => {});
    } else {
    }
  } else if (key === "pk_payfundorg") {
    if (value.value !== oldValue.value) {
      cardEvent.getAfterEventData
        .call(this, eventData)
        .then(res => {
          setAfterEditFormValue.call(this, this.props, res);
        })
        .then(() => {});
    } else {
    }
  } else if (key === "pk_outfundorg") {
    if (value.value !== oldValue.value) {
      cardEvent.getAfterEventData
        .call(this, eventData)
        .then(res => {
          setAfterEditFormValue.call(this, this.props, res);
        })
        .then(() => {});
    } else {
    }
  } else if (key === "innersecurityrate" || key === "innersecurityamount") {
    if (value.value !== oldValue.value) {
      cardEvent.getAfterEventData
        .call(this, eventData)
        .then(res => {
          setAfterEditFormValue.call(this, this.props, res);
        })
        .then(() => {});
    } else {
    }
  } else if (key === "pk_entrustorg") {
    if (value.value !== oldValue.value) {
      this.props.form.setFormItemsValue(this.formId, {
        dept: { value: null, display: null },
        psn: { value: null, display: null }
      });
    } else {
    }
  } else if (key === "dept") {
    if (value.value !== oldValue.value) {
      this.props.form.setFormItemsValue(this.formId, {
        psn: { value: null, display: null }
      });
    } else {
    }
  }
}
export function afterEventEdit(props, moduleId, key, value, async = false) {
  if (value.value) {
    if (key === "pk_org") {
      props.initMetaByPkorg();
      props.form.EmptyAllFormValue(this.formId);
      props.cardTable.setAllTabsData(null, this.tabOrder, null, []);
      //	props.button.setButtonDisabled(["addRow", "deleteRow"], true);
    }
  }
}

function setAfterEditFormValue(props, res) {
  let { success, data } = res;
  let { card, retExtParam, headProp, bodyItemProps, headItemProps } = data;
  let { head, bodys } = card;
  props.form.setAllFormValue({ [this.formId]: head[this.formId] });
  props.cardTable.setAllTabsData(bodys, this.tabOrder);
  setHeadItemProp(props, this.formId, headItemProps);
}

function changeOrg(value, eventData) {
  cardEvent.changeOrg.call(this, value).then(() => {
    if (value.value) {
      cardEvent.getAfterEventData
        .call(this, eventData)
        .then(res => {
          setAfterEditFormValue.call(this, this.props, res);
        })
        .then(() => {});
    }
  });
}

/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/