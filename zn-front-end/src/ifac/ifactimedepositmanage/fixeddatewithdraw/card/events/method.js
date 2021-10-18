/*0hfPh7RC56HIRVbsBd6OoS/BnUHkMlucP2r7uBYUH9t3Bxk7pi6xLlbEVVl49bPe*/
import { toast} from 'nc-lightapp-front';
import * as CONSTANTS from '../../cons/constant';
import {loadMultiLang,saveCommit} from "../../../../../tmpub/pub/util/index";
import {addCacheData, updateCacheData} from '../../../../../tmpub/pub/util/cache';
let { FixedWithDrawConst, pageCodeCard, base_url, formId, pkname, assignTypecon } = CONSTANTS;
/**
 * 卡片API
 */



export const  mysaveCommit = function (props, assign) {
    let extParam={btncode:"SaveCommit",pagecode:"36340FDW_C01"};
    saveCommit(this.props, {
        pageCode: pageCodeCard,//页面编码
        headCode: formId, //表头区域编码
        bodyCode: "",//表体区域编码（多表体传数组，没有表体不传）
        url: base_url+'FDWDWSaveCommitAction.do',//请求url
        assign,//指派信息
        //展示指派框的逻辑
        showAssignFunc: (res) => {
            let { data } = res;
            let { workflow } = data;
            if (workflow && workflow == 'approveflow' || workflow == 'workflow') {
                this.setState({ assignData: data, assignShow: true, assignType: assignTypecon.savecommit });
            }
        }, 
        //更新界面数据的逻辑 
        updateViewFunc: (res) => {
            if(res.data.msg){
                props.form.setFormItemsValue(formId, { 'depositdate': { value: res.data.result.parent.valueIndex['depositdate'], display: null } });
                props.form.setFormItemsValue(formId, { 'enddate': { value: res.data.result.parent.valueIndex['enddate'], display: null } });
                toast({color: 'warning', content: res.data.msg});
                return;
            }
            saveUpdateView(this,props, res, () => {
                toast({ color: 'success', content: loadMultiLang(props, '36340FDW-000011')+loadMultiLang(props, '36340FDW-000022')/* 国际化处理： 提交成功！*/ });
            });
        },
        //保存的校验（无需考虑验证公式，本身包含）
        saveValidate: () => {
            return true;
        },
        extParam,
    });
}
/**保存动作更新界面数据 */
const saveUpdateView = function (that,props, res, callback) {
    //界面状态
    let status = props.getUrlParam('status');
    let { data } = res;
    let { head, body } = data;
    if (!head) {
        return;
    }
    //更新表头数据
    props.form.setAllFormValue({ [formId]: head[formId] });
    //更新表体(兼顾差异化和非差异化)
    if (body) {
        body = updateBody(props, body);
        if (body) {
            data.body = body;
        }
    }
    let pk = head[formId].rows[0].values[pkname].value;
    //新增时，向缓存中追加数据
    if (status=="add") {
      addCacheData(
        props,
        FixedWithDrawConst.pk_filed,
        pk,
        data,
        formId,
        FixedWithDrawConst.dataSource,
        data.head[formId].rows[0].values
      );
        // cardCache.addCache(pk, data, formId, FixedWithDrawConst.dataSource);
    }
    //其余更新缓存中的数据
    else {
      updateCacheData(
        props,
        FixedWithDrawConst.pk_filed,
        pk,
        data,
        formId,
        FixedWithDrawConst.dataSource,
        data.head[formId].rows[0].values
      );
        // cardCache.updateCache(pkname, pk, data, formId, FixedWithDrawConst.dataSource);
    }
    //刷新界面
    props.setUrlParam({
      status: 'browse',
      id: pk
    });
    that.qryData(false);
    //执行回调
    if (callback && (typeof callback == 'function')) {
        callback();
    } 
  }


/*0hfPh7RC56HIRVbsBd6OoS/BnUHkMlucP2r7uBYUH9t3Bxk7pi6xLlbEVVl49bPe*/