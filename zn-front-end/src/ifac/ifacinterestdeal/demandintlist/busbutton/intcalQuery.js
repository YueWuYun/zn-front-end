/*/kB59XIB1xUtC0CdCjRD6188n04oQyH5gf5umYT69CfRsm/Yp0kFR5oEUNfIab+m*/
import { createPage, ajax, base, toast,high,cardCache ,getMultiLang, createPageIcon} from 'nc-lightapp-front';
let { getCacheById, updateCache,addCache,deleteCacheById,getNextId } = cardCache;
import {processFormulamsg} from '../util/util.js';
import {  dataSourceTam ,card_table_id,card_from_id,list_table_id,list_page_id,card_page_id} from '../cons/constant.js';
import { showErrBtn} from "../../../../tmpub/pub/util/index";
import {requesturl} from '../cons/requesturl.js';
export const queryCard = function(props){
    let that = this;
    let status = this.props.getUrlParam('status');
	let flag = status === 'browse' ? false : true;
	this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag);

    let id = this.props.getUrlParam('id');
		//查询缓存数据
	let cardData = getCacheById(id, dataSourceTam);

    let type = this.props.getUrlParam('type');

    let pks = this.props.getUrlParam('pks');

    //let extParam = this.props.getUrlParam('extParam');

    let org = this.props.getUrlParam('org');
    

    let src = this.props.getUrlParam('src');

    let douclick = this.props.getUrlParam('douclick');

    if(!douclick&&type&&type==='interlist'){
        let data = {
            "pks": [pks],
            "pageCode": list_page_id,
            "extParam":{
                'org':org
            }
        };
        ajax({
            url: requesturl.linkquery,
            data: data,
            success: function (res) {
                props.table.setAllTableData(list_table_id, res.data[list_table_id]);
                 //适配跨服务错误信息
                 showErrBtn(props, {
                    headBtnCode: 'card_head',
                    headAreaCode: card_from_id,
                    fieldPK: 'pk_intlist',
                    datasource: dataSourceTam
               });
            } 
        });
    }

    if(!douclick&&type&&type==='intercard'){
        let data = {
            "pk": pks
        };
        ajax({
            url: requesturl.linkcard,
            data: data,
            success: function (res) {
                if (res.data[card_from_id]) {
                    props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });
                    let vbillno = res.data.head[card_from_id].rows[0].values.vbillno.value;
                    that.setState({
                        billno: vbillno
                    });
                }
                if (res.data.body) {
                    props.cardTable.setTableData(card_table_id, res.data.body[card_table_id]);
                }
                 //适配跨服务错误信息
                 showErrBtn(props, {
                    headBtnCode: 'card_head',
                    headAreaCode: card_from_id,
                    fieldPK: 'pk_intlist',
                    datasource: dataSourceTam
               });
            }
        });
    }


    if(!douclick&&type&&type==='tryinter'){
       
        let date = this.props.getUrlParam('startdate');
    
        let endDate = this.props.getUrlParam('enddate');
        
        let pk_intobj = this.props.getUrlParam('pk_intobj');

        let card = this.props.getUrlParam('card');

        let pkMapTs = {};
        let extParam = {};
        pkMapTs[pk_intobj] = 0;
        extParam[pks] = 0;

        ajax({
            url:requesturl.tryinter,
            data: {
                //主键pk与时间戳ts的映射
                pkMapTs, card_page_id, extParam,date,endDate
            },

            success: (res) => {
                
                if (res.data) {
                    
                    if(card){
                        if (res.data[card_from_id]) {
                            this.props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });
                        }
                        if (res.data.body) {
                            this.props.cardTable.setTableData(card_table_id, res.data.body[card_table_id]);
                        }
                    }else{
                        if(res.data[list_table_id]){
                            this.props.table.setAllTableData(list_table_id, res.data[list_table_id]);
                        }
                    }
                    //适配跨服务错误信息
                    showErrBtn(this.props, {
                        headBtnCode: 'card_head',
                        headAreaCode: card_from_id,
                        fieldPK: 'pk_intlist',
                        datasource: dataSourceTam
                    });                    
                } 
            }

        })
    }

    //判断返回箭头是否显示
    if (status == 'browse') {
        if(src=='fip'){
            this.setState({
                showNCbackBtn: true
            })
        }else{
            this.setState({
                showNCbackBtn: false
            })
        }
       
        this.props.cardTable.setStatus(this.tableId, status);

        let data = { pk: this.props.getUrlParam('id'), pageCode: this.pageId };

        if (cardData) {
            //this.props.form.setFormItemsValue(card_from_id, filedsNull);
            this.props.form.setAllFormValue({ "head": cardData.head[card_from_id] });
            let vbillno = cardData[card_from_id][card_from_id].rows[0].values.vbillno.value;
            this.setState({ billno: vbillno });
            if (cardData.body == null) {
                this.props.cardTable.setTableData(this.tableId, { rows: [] });
            } else {
                this.props.cardTable.setTableData(this.tableId, cardData.body[this.tableId]);
                 //适配跨服务错误信息
                 showErrBtn(this.props, {
                    headBtnCode: 'card_head',
                    headAreaCode: card_from_id,
                    fieldPK: 'pk_intlist',
                    datasource: dataSourceTam
               });
            }
            //buttonVisible(this.props);
        } else {
            if (!id) {
                this.props.form.EmptyAllFormValue(card_from_id);
                this.props.cardTable.setTableData(this.tableId, { rows: [] });
                this.setState({ billno: "" });
                //buttonVisible(this.props);
            } else {
                ajax({
                    url: requesturl.querycard,
                    data: data,
                    success: (res) => {
                        if (res.data) {
                            let pk_intlist = null;
                            if (res.data[card_from_id]) {
                                pk_intlist = res.data.head[card_from_id].rows[0].values.pk_intlist.value;
                               // this.props.form.setFormItemsValue(this.formId, filedsNull);
                                this.props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });
                                let vbillno = res.data.head[card_from_id].rows[0].values.vbillno.value;
                                this.setState({
                                    billno: vbillno
                                });
                            }
                            if (res.data.body) {
                                this.props.cardTable.setTableData(card_table_id, res.data.body[card_table_id]);
                            }
                            //适配跨服务错误信息
                            showErrBtn(this.props, {
                            	headBtnCode: 'card_head',
                            	headAreaCode: card_from_id,
                            	fieldPK: 'pk_intlist',
                            	datasource: dataSourceTam
                            });
                            //处理公式
                            processFormulamsg(this.props, res);
                            updateCache(card_table_id, id, card_from_id, dataSourceTam, res.data.head[card_from_id].rows[0].values);
                        } else {
                            this.props.form.EmptyAllFormValue(card_from_id);
                            this.props.cardTable.setTableData(card_from_id, { rows: [] });
                        }
                    }
                });
            }
        }

    } 
}
/*/kB59XIB1xUtC0CdCjRD6188n04oQyH5gf5umYT69CfRsm/Yp0kFR5oEUNfIab+m*/