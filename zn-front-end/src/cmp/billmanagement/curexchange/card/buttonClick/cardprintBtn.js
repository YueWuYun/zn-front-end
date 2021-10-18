/*jMHe2PRj85lfah981YkWl4IGNOo1jzwfBoNxl4tCj+kXfLgdIiDC8rv5vgGF7y6j*/
import { createPage, ajax, base, toast, cacheTools, print, cardCache } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
//缓存
let { setDefData, getDefData,
    getCurrentLastId, getCacheById,
    updateCache, addCache, getNextId,
    deleteCacheById } = cardCache;

/**
 * [外币兑换]-打印按钮
 * @param {*} props  
 */
export const cardprintBtn = function () {
    if (!this.props.form.getFormItemsValue(this.formId, 'pk_cruexchange').value) {
        toast(
            { color: 'warning', 
            content: this.props.MutiInit.getIntl("36070FCE") &&
             this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000011')
             });/* 国际化处理： 操作失败，无数据!*/
        return;
      }
      print(
        'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
        '/nccloud/cmp/curexchange/curexchangeprint.do',
        {
          // billtype: printcard_billtype,  //单据类型
          // funcode: printcard_funcode, //功能节点编码，即模板编码
          // printTemplateID: printcard_templetid,//输出打印模板id
          nodekey: Templatedata.printcard_nodekey,     //模板节点标识：单据模版初始化
          appcode: this.props.getSearchParam('c'),
          oids: [this.props.form.getFormItemsValue(this.formId, 'pk_cruexchange').value]

        }
      );
}

/*jMHe2PRj85lfah981YkWl4IGNOo1jzwfBoNxl4tCj+kXfLgdIiDC8rv5vgGF7y6j*/