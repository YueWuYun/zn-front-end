/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/
import { print, promptBox } from 'nc-lightapp-front';
import { appcode, BTN, URL_INFO, PAGE_STATUS, card_page_id, card_form_id, card_table_id } from '../../cons/constant.js';
import { qryData, repaintView, getLang, save, getQueryData } from '../../util/index';
import { getChangeCards } from "./afterEvent";

export default function (props, btnId) {
    //财务组织
    switch (btnId) {
        //刷新
        case BTN.REFRESH:
            qryData.call(this, props, getQueryData.call(this, props, true), true, true);
            break;
        //保存
        case BTN.SAVE:
            let billdata = props.createMasterChildData(card_page_id, card_form_id, card_table_id);
            let saveObj = {};
            saveObj[card_table_id] = 'cardTable';
            props.validateToSave(billdata, save.bind(this, props, getChangeCards(props)), saveObj, '');
            break;
        //修改
        case BTN.EDIT:
            repaintView.call(this, props, PAGE_STATUS.EDIT);
            break;
        //取消
        case BTN.CANCEL:
            promptBox({
                color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                title: getLang(this.state.json, '000002'),
                content: getLang(this.state.json, '000003'),
                beSureBtnClick: () => {
                    this.setState({ isBrowse: true }, this.navChangeFun.bind(this, this.state.selectedGroup));
                    qryData.call(this, props, getQueryData.call(this, props, true), true, false);
                }
            });

            

            break;
        //打印
        case BTN.PRINT:
            print(
                'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                URL_INFO.PRINT, //url
                {
                    appcode: appcode,	//应用编码
                    oids: getPrintData.call(this, props)
                }
                // false
            );
            break;
        // 输出
        case BTN.OUTPUT:
            this.setState(
                {
                    outputData: {
                        appcode: appcode,	//应用编码
                        oids: getPrintData.call(this, props),
                        outputType: 'output'
                    }
                },
                () => {
                    this.refs.printOutput.open();
                }
            );
            break;
    }
}

/**
 * 构造打印的参数
 * @param {*} data 查询条件
 */
const getPrintData = function (props) {
    let data = getQueryData.call(this, props, true);
    let queryCon = data.queryCon;
    if (!data || !queryCon || !data.extraParam) {
        return;
    }
    let result = [];
    result.push('pk_intobj,' + queryCon.pk_intobj);
    result.push('pk_accinfo,' + queryCon.pk_accinfo);
    result.push('begdate,' + queryCon.begdate);
    result.push('enddate,' + queryCon.enddate);
    result.push('settlemode,' + queryCon.settlemode);
    result.push('islinkquery,' + data.extraParam.islinkquery);
    return result;
}
/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/