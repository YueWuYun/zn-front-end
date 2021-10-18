/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/
//表头编辑后事件
import { promptBox } from "nc-lightapp-front";
import { baseReqUrl, javaUrl, card } from "../../cons/constant";
import {
    getAfterEventData,
    checkNegative,
    afterSetData,
    delTabData
} from "../../../public/cardEvent";
/**
 * 内贷还本-卡片编辑后事件
 */
export function afterEvent(props, moduleId, key, value, oldvalue) {
    //console.log(key, value);
    let eventData = props.createTabsAfterEventData(
        this.pageId,
        this.formId,
        tabRelation,
        moduleId,
        key,
        value
    );
    let meta = props.meta.getMeta();
    let tabRelation = meta.gridrelation[this.tabCode].tabRelation;
    //编辑后事件url
    const url = baseReqUrl + javaUrl.afterEvent;
    //需要调编辑后事件接口
    const eventKey = [
        "pk_org",
        "begindate",
        "glcrate",
        "olcrate",
        "gllcrate",
        "periodcount",
        "periodunit",
        "enddate",
        "pk_inheritprotocol",
        "pk_debitorg",
        "pk_currtype",
        "cdtlnamt"
    ];
    // 需要检查不能为负数
    const amountKey = [
        "cdtlnamt",
        "olcrate"
    ];
    if (amountKey.includes(key)) {
        if (!checkNegative.call(this, key, value)) {
            return;
        }
    }
    if (eventKey.includes(key)) {
        if (key == "pk_org") {
            if (!oldvalue || !oldvalue.value) {
                //处理组织编辑后事件
                getAfterEventDataFuc.call(
                    this,
                    props,
                    moduleId,
                    key,
                    value,
                    tabRelation
                );
            } else {
                promptBox({
                    color: "warning",
                    title: this.state.json["36360INCP-000000"],/* 国际化处理： 修改财务组织*/
                    content: this.state.json["36360INCP-000001"],/* 国际化处理： 确认修改财务组织, 这样会清空您录入的信息?*/
                    beSureBtnClick: getAfterEventDataFuc.bind(
                        this,
                        props,
                        moduleId,
                        key,
                        value,
                        tabRelation
                    ),
                    cancelBtnClick: () =>
                        props.form.setFormItemsValue(moduleId, {
                            pk_org: oldvalue
                        })
                });
            }
        }
        else {
            if (value.value) {
                getAfterEventDataFuc.call(
                    this,
                    props,
                    moduleId,
                    key,
                    value,
                    tabRelation
                );
            }
        }
    }
    if (key == "intrstoffbyprcplflag") {
        //利随本清
        //清空值
        props.form.setFormItemsValue(this.formId, {
            interestmny: { display: null, value: null },
            paytotalintstflag: { display: null, value: null }
        });
        if (value.value) {
            props.form.setFormItemsDisabled(this.formId, {
                interestmny: false, //利息金额
                paytotalintstflag: false //付累计利息
            });
            if (this.state.accountinter && this.state.accountinter == "Y") {
                props.form.setFormItemsDisabled(this.formId, {
                    interestmny: true //利息金额
                });
            }
        } else {
            props.form.setFormItemsDisabled(this.formId, {
                interestmny: true, //利息金额
                paytotalintstflag: true //付累计利息
            });
        }
    }
}
/**
 * 根据币种设置汇率编辑性 人民币时不可编辑
 *
 * @param {*} data - 整单数据
 */
export function afterFinancepay(data) {
    let headData = data.head
        ? data.head && data.head[this.formId].rows[0].values
        : data.rows[0].values;
    if (
        headData["pk_currtype"] &&
        headData["pk_currtype"].value === "1002Z0100000000001K1"
    ) {
        this.props.form.setFormItemsDisabled(this.formId, { olcrate: true });
        this.props.form.setFormItemsValue(this.formId, {
            olcrate: { display: null, value: "1.00" }
        });
    } else {
        this.props.form.setFormItemsDisabled(this.formId, { olcrate: false });
    }
}
// 编辑后事件
function getAfterEventDataFuc(props, moduleId, key, value, tabRelation) {
    if (value.value) {
        if (key == "pk_org") {
            props.resMetaAfterPkorgEdit();//释放其他编辑字段编辑性
            let data = {};
            props.form.EmptyAllFormValue(this.formId);
            for (let item of this.tabOrder) {
                data[item] = { rows: [] };
            }
            props.cardTable.setAllTabsData(null, this.tabOrder, null, []);
            props.form.setFormItemsValue(this.formId, {
                pk_org: value,
                pk_org_v: value
            });
            this.billNo = "";
            props.button.setButtonDisabled(card.disabled_btn, false);//表体肩部按钮都能点击
        }
        //编辑后事件url
        const url = baseReqUrl + javaUrl.afterEvent;
        let eventData = props.createTabsAfterEventData(
            this.pageId,
            this.formId,
            tabRelation,
            moduleId,
            key,
            value
        );
        getAfterEventData.call(this, eventData, url).then(res => {
            let resDataHead = res.data.head;
            let resDataBody = res.data.bodys;
            let userjson = resDataHead.userjson;
            if (userjson && JSON.stringify(userjson) !== "{}") {
                let enablekey = JSON.parse(userjson).enablekey; //启用key
                let disablekey = JSON.parse(userjson).disablekey; //禁用key
                for (let item in enablekey) {
                    props.form.setFormItemsDisabled(this.formId, {
                        [item]: false
                    });
                }
                for (let item in disablekey) {
                    props.form.setFormItemsDisabled(this.formId, {
                        [item]: true
                    });
                }
            }
            props.form.setAllFormValue({
                [this.formId]: resDataHead && resDataHead[this.formId]
            });
            if(res.data.userjson){
                let userjson = JSON.parse(res.data.userjson);
                let {columnPrecisions,retExtParam} =userjson;
                //设置组织本币列编辑性
                processHeadOlcRateEditable.call(this, props, retExtParam);       
                //设置列精度         
                // props.cardTable.setColScale(columnPrecisions);
            }
           
            let pk_currtype =
                res.data.head[this.formId].rows[0].values.pk_currtype;
            if (pk_currtype && pk_currtype.value) {
                this.setState({
                    initPk_currtype: pk_currtype.value
                });
            }
          
            if (resDataBody && JSON.stringify(resDataBody) !== "{}") {
                // 编辑后事件返回的表头数据
                // 根据是否提前还款 设置子表 还款编号字段 参照是否可以多选
                this.props.cardTable.setAllTabsData(
                    res.data.bodys,
                    this.tabOrder,
                    afterSetData.bind(
                        this,
                        this.props,
                        Object.keys(res.data.bodys)
                    ),
                    tabRelation == Object(res.data.bodys)
                        ? tabRelation
                        : tabRelation.concat(Object.keys(res.data.bodys))
                );
            } else {
                this.props.cardTable.setAllTabsData(
                    null,
                    this.tabOrder,
                    null,
                    this.tabShow
                );
            }
        });
    } else if (key == "pk_org") {
        props.initMetaByPkorg();//限制其他字段的编辑性
        props.form.EmptyAllFormValue(this.formId);
        props.cardTable.setAllTabsData(null, this.tabOrder, null, []);
        this.billNo = "";
    }
}

/**
 * 设置表头组织本币汇率得编辑性
 * @param {*} props 
 */
function processHeadOlcRateEditable(props, extParam) {
    
    if (extParam.hasOwnProperty('headOlcRateEditable')) {
       //设置列得编辑性，flag=true是不可编辑，false是可编辑
       let flag = extParam['headOlcRateEditable'] == 'Y' ? false : true;
       props.form.setFormItemsDisabled(this.formId, {   olcrate: flag });
   }
   if (extParam.hasOwnProperty('headGlcRateEditable')) {
       //设置列得编辑性，flag=true是不可编辑，false是可编辑
       let flag = extParam['headGlcRateEditable'] == 'Y' ? false : true;
       props.form.setFormItemsDisabled(this.formId, {   glcrate: flag });
   }
   if (extParam.hasOwnProperty('headGllcRateEditable')) {
       //设置列得编辑性，flag=true是不可编辑，false是可编辑
       let flag = extParam['headGllcRateEditable'] == 'Y' ? false : true;
       props.form.setFormItemsDisabled(this.formId, {   gllcrate: flag });
   }
}
/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/