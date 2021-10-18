/*0hfPh7RC56HIRVbsBd6OoS/BnUHkMlucP2r7uBYUH9t3Bxk7pi6xLlbEVVl49bPe*/
import { toast} from 'nc-lightapp-front';
import {loadMultiLang,saveCommit} from "../../../../../tmpub/pub/util/index";
import {addCacheData, updateCacheData} from '../../../../../tmpub/pub/util/cache';
import { baseReqUrl, javaUrl, card, assignTypecon} from '../../cons/constant.js';
import { getCardData } from './page';
/**
 * 卡片API
 */



export const  mysaveCommit = function (props, assign) {
    let extParam = {btncode:"savecommit",pagecode:"36340FDR_C01"};
    saveCommit(this.props, {
        pageCode: card.pageCode,//页面编码
        headCode: card.headCode, //表头区域编码
        bodyCode: "",//表体区域编码（多表体传数组，没有表体不传）
        url: `${baseReqUrl}${javaUrl.savecommit}.do`,//请求url
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
            saveUpdateView(this,props, res, () => {
                toast({ color: 'success', content: this.state.json["36340FDR-000040"]/* 国际化处理： 保存提交成功！*/ });
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
    props.form.setAllFormValue({ [card.headCode]: head[card.headCode] });
    //更新表体(兼顾差异化和非差异化)
    if (body) {
        body = updateBody(props, body);
        if (body) {
            data.body = body;
        }
    }
    let pk = head[card.headCode].rows[0].values[card.primaryId].value;
    //新增时，向缓存中追加数据
    if (status=="add") {
      addCacheData(
        props,
        card.primaryId,
        pk,
        data,
        card.headCode,
        card.cardCache,
        data.head[card.headCode].rows[0].values
      );
        // cardCache.addCache(pk, data, formId, FixedWithDrawConst.dataSource);
    }
    //其余更新缓存中的数据
    else {
      updateCacheData(
        props,
        card.primaryId,
        pk,
        data,
        card.headCode,
        card.cardCache,
        data.head[card.headCode].rows[0].values
      );
        // cardCache.updateCache(pkname, pk, data, formId, FixedWithDrawConst.dataSource);
    }
    //刷新界面
    props.setUrlParam({
      status: 'browse',
      id: pk
    });
    that.qryData(false);
    //getCardData.call(this, `${baseReqUrl}${javaUrl.card}`, props.getUrlParam('id'), true, true);
    //执行回调
    if (callback && (typeof callback == 'function')) {
        callback();
    } 
  }


/*0hfPh7RC56HIRVbsBd6OoS/BnUHkMlucP2r7uBYUH9t3Bxk7pi6xLlbEVVl49bPe*/