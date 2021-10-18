/*QB6Cta54YZYj18ukkNSw6s6w/5HHI50S1xG3XVdcs5/3IcD+ZCFqsh0TiFDHeGL+*/
/* 
    卡片页编辑后事件公共函数
    Created by:liyaoh 2018-09-12
*/
import { ajax, toast } from 'nc-lightapp-front';
import { clearAll, setHeadItemsDisabled } from './page';
import { linkCMP } from "src/tmpub/pub/util/linkCMP";
import moment from 'moment';
const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';
const dateFormat = 'YYYY-MM-DD';

/**
 * 获取编辑后事件接口数据
 *
 * @param {*} data - 必传。整单数据
 */
export function getAfterEventData(data) {
    return new Promise((resolve, reject) => {
        ajax({
            url: this.API_URL.afterEvent,
            async: false,
            data,
            success: (res) => {
                resolve(res);
            },
            error: (res) => {
                toast({ color: 'danger', content: res.message });
                reject(res);
            }
        });
    });
}
/**
 * 获取编辑前事件接口
 *
 * @param {*} data - 必传。
 */
export function getBeforeEventCurrtype(data) {
    return new Promise((resolve, reject) => {
        ajax({
            url: '/nccloud/bond/common/currtype.do', 
            async: false,
            data,
            success: (res) => {
                resolve(res);
            },
            error: (res) => {
                toast({ color: 'danger', content: res.message });
                reject(res);
            }
        });
    });
}

/**
 * 获取参照编辑事件接口
 *
 * @param {*} data - 必传。
 */
export function getBeforeEventModule(data) {
    return new Promise((resolve, reject) => {
		 linkCMP.call(this, {
            data,
            success: (res) => {
                resolve(res);
            },
            error: (res) => {
                reject(res);
            }
		});
    });
}
/**
 * 设置表头编辑后事件字段值
 *
 * @param {*} eventData - 整单数据
 * @param {*} args - 要设置的key
 */
export function setFormAfterEventItem(eventData, ...args) {
    return new Promise (resolve => {
        getAfterEventData.call(this, eventData).then(res => {
            let obj = {};
            let headData = res.data && res.data.head && res.data.head[this.formId].rows[0].values;
            if (headData) {
                args.forEach(key => {
                    obj[key] = headData[key]
                });
                this.props.form.setFormItemsValue(this.formId, obj);
                resolve(res.data);
            }
        });
    });
}

/**
 * 设置子表编辑后事件数据
 *
 * @param {*} eventData - 整单数据
 */
export function setBodyAfterEventData(eventData){
    return new Promise(resolve => {
        getAfterEventData.call(this, eventData).then(res => {
            this.props.cardTable.setAllTabsData(res.data.bodys, this.tabOrder);
            resolve(res);
        });
    });
}

/**
 * 切换财务组织
 *
 * @param {*} value - 财务组织的value
 * @param {*} callback - 选择财务组织后的回调函数
 */
export function changeOrg(value, callback) {
    return new Promise (resolve => {
        if(typeof callback === 'function'){
            callback();
        }else{
            this.props.resMetaAfterPkorgEdit(); //选择主组织以后，恢复其他字段的编辑性
            this.props.button.setButtonDisabled('addRow', false);//恢复增行编辑性
        }
        if (!value.value) {
            clearAll.call(this);
            this.props.initMetaByPkorg();
            this.props.button.setButtonDisabled('addRow', true);//禁用增行
        }
        resolve();
    });
}
/**
 * 根据期间获取结束日期
 *
 * @param {*} begin - 开始日期
 * @param {*} period - 期间
 * @param {*} periodUnit - 期间单位
 */
export function getEndDate(begin, period, periodUnit) {
    if (!begin || !period || !periodUnit) return;
    const transUnit = {
        1: "d", //日
        2: "M", //月
        3: "Q", //季
        4: "y"  //年
    }
    return moment(begin).add(+period, transUnit[periodUnit]).format(dateTimeFormat);
}

/**
 * 根据开始结束日期计算发债期间
 *
 * @param {*} begin
 * @param {*} end
 * @returns
 */
export function getBondPeriod(begin, end) {
    if(!begin || !end) return;
    begin = moment(begin).format(dateFormat);
    end = moment(end).format(dateFormat);
    let result;
    let periodloan = moment(end).diff(moment(begin), 'years', true);
    if (periodloan >= 0 && periodloan <= 1) { //短期
        result = '1';
    } else if (periodloan >= 1 && periodloan <= 5) { //中期
        result = '2';
    } else { //长期
        result = '3';
    }
    return {value: result};
}



/**
 * 根据来源金额计算目标金额与比例
 *
 * @param {*} type - 输入的数据类型 amount：金额 proportion：比例
 * @param {*} source - 来源金额
 * @param {*} current - 输入的数据 金额/比例
 * @returns
 */
export function getAmountAndPercent(type, source, current) {
    if (!source || !current) return {};
    let result = {
        amount: current,
        proportion: current
    }
    if(type === 'amount'){ //金额
        result.proportion = current / source * 100;
    } else if (type === 'proportion'){ //比例
        result.amount = source * current / 100;
    }
    return result;
}

//走编辑后事件接口所以不需要前端计算了，先留着，万一有用 by:liyaoh
// /**
//  * 供销商子表编辑后事件，需要使用call调用
//  *
//  * @param {*} current - 当前操作字段对象，与cardTable的编辑后事件参数一致
//  * @param {*} registmny - 注册金额，需要传进来是因为其他节点字段名可能不同
//  * @param {*} keys - 承销商对应的字段名
//  */
// export function underwriterAfterEvent(current, registmny, { 
//     agreeRatio,     //约定承销比例
//     agreeAmount,    //约定承销金额
//     olcAgreeAmount, //约定承销本币金额
//     actualRatio,    //实际承销比例
//     actualAmount,   //实际承销金额
//     olcActualAmount //实际承销本币金额
// }) {
//     if(!registmny) return;
//     const olcrate = this.props.form.getFormItemsValue(this.formId, 'olcrate').value;//组织本币汇率
//     const eventData = this.props.createTabsBodyAfterEventData(this.pageId, this.formId, this.tabOrder, current.moduleId, current.key, current.value);//编辑后事件整单数据
//     if (current.key === agreeRatio) {
//         //约定承销比例
//         let aggredissuancemny = getAmountAndPercent('proportion', registmny, current.value).amount;
//         this.props.cardTable.setValByKeyAndIndex(current.moduleId, current.index, agreeAmount, { value: aggredissuancemny });
//         this.props.cardTable.setValByKeyAndIndex(current.moduleId, current.index, olcAgreeAmount, { value: aggredissuancemny * +olcrate });//计算约定承销本币金额
//         // getAfterEventData.call(this, eventData).then(res => {
//         //     this.props.cardTable.setAllTabsData(res.data.bodys, this.tabOrder);
//         // });
//     } else if (current.key === agreeAmount) {
//         //约定承销金额
//         let aggredratio = getAmountAndPercent('amount', registmny, current.value).proportion;
//         this.props.cardTable.setValByKeyAndIndex(current.moduleId, current.index, agreeRatio, { value: aggredratio });
//         this.props.cardTable.setValByKeyAndIndex(current.moduleId, current.index, olcAgreeAmount, { value: aggredissuancemny * +olcrate });//计算约定承销本币金额
//         getAfterEventData.call(this, eventData).then(res => {
//             console.log(res.data)
//             // let bodyData = res.data.bodys && res.data.bodys.rows[current.index].values;
//             // this.props.cardTable.setValByKeyAndIndex(current.moduleId, current.index, olcAgreeAmount, { value: bodyData[olcAgreeAmount] });//计算约定承销本币金额
//             this.props.cardTable.setAllTabsData(res.data.bodys, this.tabOrder);
//         });
//     } else if (current.key === actualRatio) {
//         //实际承销比例
//         let issuancemny = getAmountAndPercent('proportion', registmny, current.value).amount;
//         this.props.cardTable.setValByKeyAndIndex(current.moduleId, current.index, actualAmount, { value: issuancemny });
//         this.props.cardTable.setValByKeyAndIndex(current.moduleId, current.index, olcActualAmount, { value: issuancemny * +olcrate });//计算约定承销本币金额

//     } else if (current.key === actualAmount) {
//         //实际承销金额
//         let ratio = getAmountAndPercent('amount', registmny, current.value).proportion;
//         this.props.cardTable.setValByKeyAndIndex(current.moduleId, current.index, actualRatio, { value: ratio });
//         this.props.cardTable.setValByKeyAndIndex(current.moduleId, current.index, olcActualAmount, { value: current.value * +olcrate });//计算约定承销本币金额
//     }

// }

/**
 * 担保信息编辑后事件，需要使用call调用
 *
 * @param {*} current - 当前操作字段对象，与cardTable的编辑后事件参数一致
 * @param {*} keys - 对应的字段名
 * @param {*} eventData - 编辑后整单数据
 */
export function guaranteeAfterEvent(current, { 
    oAmount, //注册金额
}){
    const registmny = this.props.form.getFormItemsValue(this.formId, oAmount).value;//注册金额
    const olcrate = this.props.form.getFormItemsValue(this.formId, 'olcrate').value;//组织本币汇率
    let referVals = current.value.values;
    const guatypeMap = {
        '0': this.state.json['fbmpublic-000022'],/* 国际化处理： 信用*//* 国际化处理： 信用*/
        '1': this.state.json['fbmpublic-000023'],/* 国际化处理： 保证*//* 国际化处理： 保证*/
        '2': this.state.json['fbmpublic-000024'],/* 国际化处理： 抵押*//* 国际化处理： 抵押*/
        '3': this.state.json['fbmpublic-000025'],/* 国际化处理： 质押*//* 国际化处理： 质押*/
        '4': this.state.json['fbmpublic-000026']/* 国际化处理： 混合*//* 国际化处理： 混合*/
    }
    if (current.key === 'guaranteeid'){ //担保合同
        this.props.cardTable.setValByKeyAndIndex(current.moduleId, current.index, 'guaranteetype', { 
            display: guatypeMap[referVals.guatype.value],
            value: referVals ? referVals.guatype.value : ''
        }); //担保方式
        this.props.cardTable.setValByKeyAndIndex(current.moduleId, current.index, 'pk_currtype', {
            display: referVals ? referVals.currname.value : '',
            value: referVals ? referVals.pk_currtype.value : ''
        }); //币种
        this.props.cardTable.setValByKeyAndIndex(current.moduleId, current.index, 'contractbegindate', {
            value: referVals ? referVals.guastartdate.value : ''
        }); //开始日期
        this.props.cardTable.setValByKeyAndIndex(current.moduleId, current.index, 'contractenddate', {
            value: referVals ? referVals.guaenddate.value : ''
        }); //结束日期
    } else if (current.key === 'guaranteeproportion'){ //担保比例
		let occupymny = getAmountAndPercent('proportion', registmny, current.value).amount;
		this.props.cardTable.setValByKeyAndIndex(current.moduleId, current.index, 'occupymny', { value: occupymny});
		this.props.cardTable.setValByKeyAndIndex(current.moduleId, current.index, 'localoccupymny', { value: occupymny * +olcrate });//计算占用担保本币金额
	} else if (current.key === 'occupymny') {
		//占用担保金额
		let guaranteeproportion = getAmountAndPercent('amount', registmny, current.value).proportion;
		this.props.cardTable.setValByKeyAndIndex(current.moduleId, current.index, 'guaranteeproportion', { value: guaranteeproportion });
		this.props.cardTable.setValByKeyAndIndex(current.moduleId, current.index, 'localoccupymny', { value: current.value * +olcrate });//计算占用担保本币金额
	}
}

/**
 * 授信信息编辑后事件，需要使用call调用
 *
 * @param {*} current - 当前操作字段对象，与cardTable的编辑后事件参数一致
 * @param {*} keys - 对应的字段名
 */
export function creditAfterEvent(current, {
    creditNo = 'creditagreementid',//授信协议编号
    creditBank, //授信银行
    creditCurrency, //授信币种
    creditOccupy, //授信占用额度 
    creditOlcOccupy, //授信占用额度
    creditType = 'credittype' //授信类别
}){
    const eventData = this.tabOrder ? this.props.createTabsAfterEventData(this.pageId, this.formId, '', current.moduleId, current.key, current.value)
                    : this.props.createHeadAfterEventData(this.pageId, this.formId, '', current.moduleId, current.key, current.value);
    if(current.key === creditNo){ 
		//授信协议编号
		let creditRefVal = current.value.values;
		this.props.form.setFormItemsValue(this.formId, { 
			[creditBank]: { 
                display: creditRefVal ? creditRefVal.bankdocname.value : '',
				value: creditRefVal ? creditRefVal.pk_creditbank.value : ''
			}, //授信银行
			[creditCurrency]: {
				display: creditRefVal ? creditRefVal.currname.value : '',
				value: creditRefVal ? creditRefVal.pk_currtype.value : ''
            }, //授信币种
            [creditType]: { display: '', value: '' }, //授信类别
        });
        
        //清空授信协议时清空占用额度
        if (!creditRefVal) {
            this.props.form.setFormItemsValue(this.formId, {
                [creditOccupy]: { display: '', value: '' }, //授信占用额度
                [creditOlcOccupy]: { display: '', value: '' }, //授信占用本币额度
            });
        }
        setHeadItemsDisabled.call(this, creditType);
	} else if (current.key === creditOccupy) { 
		//授信占用额度
        setFormAfterEventItem.call(this, eventData, creditOccupy, creditOlcOccupy);
    }
}

//获取随机字符串 用于rowid
export function getRandom() {
    return String(new Date().getTime()).slice(-5) + Math.random().toString(12);
}

/*QB6Cta54YZYj18ukkNSw6s6w/5HHI50S1xG3XVdcs5/3IcD+ZCFqsh0TiFDHeGL+*/