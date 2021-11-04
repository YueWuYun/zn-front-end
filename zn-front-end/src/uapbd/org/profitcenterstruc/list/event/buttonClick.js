//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS
import { createPage, ajax, base, toast, cardCache, getMultiLang, high, cacheTools, promptBox } from 'nc-lightapp-front';

let { addCache, getCacheById, updateCache, getCurrentLastId, getNextId, deleteCacheById } = cardCache;
let keys = ['pk_org','dataoriginflag','enablestate'];
/**
 *
 * @param props
 * @param tbnName 点击按钮的key值
 */
export default function handleButtonClick(props, id) {
    debugger
    switch (id) {

        case 'add':
            let rowcount = this.props.editTable.getNumberOfRows(this.tableId); //获取列表总行数
            let newrowindex = rowcount; //新增行的index等于table的总行数，因为index为行号-1

            this.setStatus(this.props, this.tableId, 'edit');
            setTimeout(() => {
                this.props.editTable.addRow(this.tableId, newrowindex, true);
            }, 0);
            break;
        case 'save':
            setTimeout(() => {
                this.props.editTable.filterEmptyRows(this.tableId, keys); //保存过滤空行

                let data = {
                    pageid: this.pageId,
                    model: {
                        areaType: "table",
                        pageinfo: null,
                        rows: [],
                        areacode: this.tableId
                    }
                };

                //验证公式应该是对页面所有数据进行验证
                let alldata = this.props.editTable.getAllRows(this.tableId);
                data.model.rows = alldata;


                let saveFunc = () => {
                    let tableData = this.props.editTable.getChangedRows(this.tableId, true);   //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
                    if (tableData === undefined || tableData.length == 0) {
                        this.props.editTable.cancelEdit(this.tableId, () => {
                            this.setStatus(this.props, this.tableId, 'browse');
                            this.updateButtonStatus()
                        });
                        toast({ title: this.state.json['10140BRDB-000006'], color: 'success' });
                        /* 国际化处理： 保存成功！*/
                        return
                    }

                    if (!this.props.editTable.checkRequired(this.tableId, this.props.editTable.getAllRows(this.tableId, true))) {
                        return
                    }

                    ajax({
                            url: this.urls['save'],
                            data,
                            success: function (res) {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                                let { success, data } = res;
                                if (success) {
                                    if (data) {
                                        let allD = this.props.editTable.getAllData(this.tableId);
                                        Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
                                        Utils.filterResult(allD, data[this.tableId].rows);//将保存后返回的数据重新放置到页面
                                        this.props.editTable.setTableData(this.tableId, allD);
                                        this.setStatus(this.props, this.tableId, 'browse');//设置表格状态为浏览态
                                        allTableData = allD;
                                    }

                                    toast({ title: this.state.json['10140BRDB-000006'], color: 'success' });
                                    /* 国际化处理： 保存成功！*/
                                }
                            }.bind(this)
                        });
                }
                props.validateToSave(data, saveFunc, { [this.tableId]: 'table' }, 'grid');
            }, 0);
            break;
        case 'refresh':
            this.refreshAction(props, () => {
                toast({ title: this.state.json['10140INCMG-000010'], color: "success" });/* 国际化处理： 刷新成功！*/
            });
            break;
        case 'delete':
            valid(props, null, () => {
                promptBox({
                    color: "warning",
                    title: this.state.json['10140INCMG-000012'],/* 国际化处理： 注意*/
                    hasCloseBtn: false,
                    content: this.state.json['10140INCMG-000013'],/* 国际化处理： 确认删除？*/
                    beSureBtnClick: this.deleteAction.bind(this)
                })
            })
            break;
        case 'printGrp':
            this.onPrint();
            break;
        case 'print':
            this.onPrint();
            break;
        case 'output':
            this.onOutput();
            break;
        default:
            break;
    }
}

//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS