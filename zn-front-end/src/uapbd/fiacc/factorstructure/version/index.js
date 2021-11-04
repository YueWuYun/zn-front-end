//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import Utils from '../../../public/utils';
import { createPage, base, ajax, NCCreateSearch, toast, print, high, promptBox, createPageIcon, excelImportconfig } from 'nc-lightapp-front';
const { NCDiv } = base;

const { NCCheckbox, NCMessage: Message, NCModal, NCButton, NCRow, NCCol } = base;
const { Header, Body } = NCModal;
const pageCode = "10140ETS_factorstructure";
const tableid = 'version';

class Version extends Component {

    /**
     * 构造函数
     * @param props
     */
    constructor(props) {

        super(props)

        this.config = props.config

        this.initTemplate(this.props, this.getData.bind(this))
        this.updateButtonStatus()

    }

    initTemplate(props, callback) {

        props.createUIDom({
            pagecode: pageCode
        },
            (data) => {
                if (data.template) {
                    props.meta.setMeta(data.template);
                }
                if (data.button) {
                    props.button.setButtons(data.button);
                }
            });

        callback && callback()

    }

    getData() {
        let requestparam = this.config
        let that = this
        ajax({
            url: '/nccloud/uapbd/factorstructure/queryversion.do',
            data: requestparam,
            success: function (res) {
                let { success, data } = res;
                if (success) {
                    if (data) {
                        that.props.editTable.setTableData(tableid, data['factorstructure']);
                    } else {
                        that.props.editTable.setTableData(tableid, { rows: [] });
                    }
                    
                }
            }
        });

    }

    onButtonClick(props, id) {
        switch (id) {
            case 'TableAdd':
                props.editTable.setStatus(tableid, 'edit')
                this.addTableRow(true);
                break
            case 'TableSave':
                this.props.editTable.filterEmptyRows(tableid, ['islastversion']);
                let allTableRows = this.props.editTable.getAllRows(tableid, true);
                if (!this.props.editTable.checkRequired(tableid, allTableRows)) {
                    return;
                }
                let tableData = this.props.editTable.getChangedRows(tableid);
                if (!tableData || tableData.length === 0) {
                    this.props.editTable.cancelEdit(tableid, this.updateButtonStatus.bind(this));
                    toast({ title: this.props.MutiInit.getIntl("10140ETS") && this.props.MutiInit.getIntl("10140ETS").get('10140ETS-000009'), color: 'success' });/* 国际化处理： 保存成功！*/
                    return;
                }
                tableData = this.props.editTable.getAllRows(tableid);   //此处改成getAllRows获取表格所有数据传递给后台，为了返回正常的提示行号，垃圾的处理方式···················
                let data = {
                    pageid: pageCode,
                    model: {
                        areaType: "table",
                        areacode: tableid,
                        pageinfo: null,
                        rows: []
                    }
                };
                data.model.rows = tableData;
                let saveFunction = () => {
                    ajax({
                        url: '/nccloud/uapbd/factorstructure/saveversion.do',
                        data,
                        success: (res) => {
                            let { success, data } = res;
                            if (success) {
                                toast({ title: this.props.MutiInit.getIntl("10140ETS") && this.props.MutiInit.getIntl("10140ETS").get('10140ETS-000015'), color: 'success' });/* 国际化处理： 保存成功！*/
                                this.props.editTable.setStatus(tableid, 'browse');//设置表格状态为浏览态
                                this.updateButtonStatus()
                                if (data) {
                                    let allD = this.props.editTable.getAllData(tableid);
                                    Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
                                    Utils.filterResult(allD, data['factorstructure'].rows);//将保存后返回的数据重新放置到页面
                                    this.props.editTable.setTableData(tableid, allD);

                                }
                            }
                        }
                    });
                }
                this.props.validateToSave(data, saveFunction, { [tableid]: 'table' }, 'grid');
                break;
            case 'TableDelete':
                
                let deleteData = this.props.editTable.getCheckedRows(tableid)
                if (!deleteData || deleteData.length === 0) {
					toast({ title: this.props.MutiInit.getIntl("10140ETS") && this.props.MutiInit.getIntl("10140ETS").get('10140ETS-000021'), color: 'warning' });/* 国际化处理： 需选中数据进行版本化！*/
					return;
				}
				if (deleteData.length > 1) {
					toast({ title: this.props.MutiInit.getIntl("10140ETS") && this.props.MutiInit.getIntl("10140ETS").get('10140ETS-000022'), color: 'warning' });/* 国际化处理： 只能选中一条数据进行版本化！*/
					return;
                }
                
                let tabledatas = this.props.editTable.getAllRows(tableid)
                if(tabledatas.length == 1){
                    toast({ title: this.props.MutiInit.getIntl("10140ETS") && this.props.MutiInit.getIntl("10140ETS").get('10140ETS-000024'), color: 'warning' });/* 国际化处理： 版本数据不能全部删除！*/
					return;
                }

                let delpk = deleteData[0].data.values.pk_factorstructure.value

                let requestParam = {
                    delpk: delpk,
                    pk_original: this.config.pk_original
                }
                ajax({
                    url: '/nccloud/uapbd/factorstructure/deleteversion.do',
                    data: requestParam,
                    success: (res) => {
                        let { success, data } = res;
                        if (success) {
                            if (data) {
                                this.props.editTable.setTableData(tableid, data['factorstructure']);
                            } else {
                                this.props.editTable.setTableData(tableid, { rows: [] });
                            }
                            toast({ content: this.props.MutiInit.getIntl("10140ETS") && this.props.MutiInit.getIntl("10140ETS").get('10140ETS-000020'), color: 'success' });/* 国际化处理： 删除成功*/
                        }
                    }
                });

                break
            case 'TableEdit':
                props.editTable.setStatus(tableid, 'edit')
                this.updateButtonStatus()
                break
            case 'TableCancel':
                promptBox({
                    color: "warning",               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: this.props.MutiInit.getIntl("10140ETS") && this.props.MutiInit.getIntl("10140ETS").get('10140ETS-000005'),                /* 国际化处理： 确认取消*/
                    content: this.props.MutiInit.getIntl("10140ETS") && this.props.MutiInit.getIntl("10140ETS").get('10140ETS-000006'),              /* 国际化处理： 是否确认要取消？*/
                    noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                    noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                    beSureBtnName: this.props.MutiInit.getIntl("10140ETS") && this.props.MutiInit.getIntl("10140ETS").get('10140ETS-000007'),         /* 国际化处理： 确定*/
                    cancelBtnName: this.props.MutiInit.getIntl("10140ETS") && this.props.MutiInit.getIntl("10140ETS").get('10140ETS-000008'),         /* 国际化处理： 取消*/
                    beSureBtnClick: () => {
                        this.props.editTable.cancelEdit(tableid, this.updateButtonStatus.bind(this));
                    }
                });
                break;
        }

    }

    updateButtonStatus() {
        if (this.props.editTable.getStatus(tableid) === 'edit') {
            this.props.button.setButtonsVisible({
                TableAdd: false,
                TableSave: true,
                TableCancel: true,
                TableEdit: false,
                TableDelete: false
            });
        } else {//浏览态
            this.props.button.setButtonsVisible({
                TableAdd: true,
                TableEdit: true,
                TableSave: false,
                TableCancel: false,
                TableDelete: true
            });
        }

    }

    addTableRow(isFocus) {
        let num = this.props.editTable.getNumberOfRows(tableid);
        this.props.editTable.addRow(tableid, num, isFocus);
        for (var i = 0; i < num; i++) {
            this.props.editTable.setValByKeyAndIndex(tableid, i, 'islastversion', { value: false })
        }
        this.props.editTable.setValByKeyAndIndex(tableid, num, 'pk_original', { value: this.config.pk_original })
        this.props.editTable.setValByKeyAndIndex(tableid, num, 'code', { value: this.config.code })
        this.props.editTable.setValByKeyAndIndex(tableid, num, 'name', { value: this.config.name })
        this.props.editTable.setValByKeyAndIndex(tableid, num, 'pk_factorchart', { value: this.config.pk_factorchart })
        this.props.editTable.setValByKeyAndIndex(tableid, num, 'islastversion', { value: true })
        this.props.editTable.setValByKeyAndIndex(tableid, num, 'enablestate', { value: 2 })
        this.updateButtonStatus()
    }




    render() {

        const { editTable, button } = this.props

        const { createEditTable } = editTable

        const { createButtonApp } = button;

        return (
            <div className="nc-single-table">
                {/* 列表区 */}

                <div className="header-button-area">
                    {createButtonApp({
                        area: 'table_inner_head',
                        buttonLimit: 3,
                        onButtonClick: this.onButtonClick.bind(this),
                        popContainer: document.querySelector('.header-button-area')

                    })}
                </div>
                <div className='nc-singleTable-table-area"'>
                    {createEditTable('version', {
                        showIndex: true,
                        showCheck: true
                    })}


                </div>
            </div>

        )
    }
}

export default Version = createPage({
    mutiLangCode: '10140ETS'
})(Version)












//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65