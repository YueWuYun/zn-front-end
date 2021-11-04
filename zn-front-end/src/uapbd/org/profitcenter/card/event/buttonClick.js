//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS
import { createPage, ajax, base, toast, cardCache, getMultiLang, high, cacheTools, promptBox } from 'nc-lightapp-front';

let { addCache, getCacheById, updateCache, getCurrentLastId, getNextId, deleteCacheById } = cardCache;
/**
 *
 * @param props
 * @param tbnName 点击按钮的key值
 */
export default function handleButtonClick(props, id) {
    let dataSource = 'uapbd.reas.profitcenter.data';
    debugger
    switch (id) {
        case 'saveadd':
            debugger
            //form表单必输项校验
            if (!this.props.form.isCheckNow(this.config.formId)) {
                toast({ color: 'danger', content: this.state.json['10100RESA-000003'] });/* 国际化处理： 请输入必输项！*/
                return;
            }

            //保存时维护子表数据
            this.setState(this.state);
            let formData = this.props.form.getAllFormValue(this.config.formId);//获得表单信息
            if (formData.rows[0].values['pk_father'] != null && formData.rows[0].values['pk_father'].value == '~') {
                formData.rows[0].values['pk_father'].value = null;
            }

            let cardData = props.createExtCardData(this.config.pageCode, this.config.formId, [this.config.tableIds[0], this.config.tableIds[1], this.config.tableIds[2]]);

            //ajax请求
            let saveCallBack = () => ajax({
                url: this.config.urls['savePFCUrl'],
                data: cardData,
                success: (result) => {
                    if (result.success) {
                        toast({ color: 'success', title: this.state.json['10100RESA-000005'] });/* 国际化处理： 保存成功！*/
                        this.props.cardTable.setStatus(this.config.tableIds[0], 'edit', () => { });
                        this.props.cardTable.setStatus(this.config.tableIds[1], 'edit', () => { });
                        this.props.cardTable.setStatus(this.config.tableIds[2], 'edit', () => { });
                        addCache(result.data.head.profitcenter.rows[0].values.pk_profitcenter.value, result.data, this.config.formId, dataSource);//加载到缓存信息中
                        //新增时清空子表数据
                        this.props.cardTable.setTableData(this.config.tableIds[0], {
                            areacode: this.config.tableIds[0],
                            rows: []
                        }, false);
                        this.props.cardTable.setTableData(this.config.tableIds[1], {
                            areacode: this.config.tableIds[1],
                            rows: []
                        }, false);
                        this.props.cardTable.setTableData(this.config.tableIds[2], {
                            areacode: this.config.tableIds[2],
                            rows: []
                        }, false);
                        //更改按钮状态变量
                        //填充默认值
                        this.props.form.EmptyAllFormValue(this.config.formId);
                        this.props.form.setFormStatus(this.config.formId, 'add');
                        this.updateButtonStatus();
                        this.state.status = 'add';
                        this.setState(this.state);
                    }
                }
            });
            this.props.validateToSave(cardData, saveCallBack, { 'pk_group': 'form', 'audit': 'form', 'ccdepts': 'cardTable', 'ccworkcenters': 'cardTable' }, 'extcard');
            break;
        case 'enable':
            debugger
            break;
        case 'disable':
            debugger
            break;
        case 'add':
            //设置停启用开关不可编辑
            // this.props.form.setFormItemsDisabled(formId, { 'enablestate': true });
            //设置子表编辑状态
            this.props.cardTable.setStatus(this.config.tableIds[0], 'edit', () => { });
            this.props.cardTable.setStatus(this.config.tableIds[1], 'edit', () => { });
            this.props.cardTable.setStatus(this.config.tableIds[2], 'edit', () => { });
            //新增时清空子表数据
            this.props.cardTable.setTableData(this.config.tableIds[0], {
                areacode: this.config.tableIds[0],
                rows: []
            }, false);
            this.props.cardTable.setTableData(this.config.tableIds[1], {
                areacode: this.config.tableIds[1],
                rows: []
            }, false);
            this.props.cardTable.setTableData(this.config.tableIds[2], {
                areacode: this.config.tableIds[2],
                rows: []
            }, false);
            //更改按钮状态变量
            //填充默认值
            this.props.form.EmptyAllFormValue(this.config.formId);
            this.props.form.setFormStatus(this.config.formId, 'add');
            this.props.setUrlParam({
                pagecode: '10100PFC_profitcenter',
                status: 'add'
            })
            this.updateButtonStatus();
            this.state.status = 'add';
            this.setState(this.state);
            break;
        case 'edit':
            //设置子表编辑状态
            this.props.cardTable.setStatus(this.config.tableIds[0], 'edit', () => { });
            this.props.cardTable.setStatus(this.config.tableIds[1], 'edit', () => { });
            this.props.cardTable.setStatus(this.config.tableIds[2], 'edit', () => { });
            this.props.form.setFormStatus(this.config.formId, 'edit');
            this.updateButtonStatus();
            this.state.status = 'edit';
            this.setState(this.state);

            break;
        case 'cancel':
            debugger
            promptBox({
                color: 'warning',
                title: this.state.json['10100RESA-000009'],/* 国际化处理： 确认取消*/
                content: this.state.json['10100RESA-000010'],/* 国际化处理： 是否确认取消？*/
                beSureBtnClick: (() => {
                    //
                    if (this.props.getUrlParam('status') === 'add') {
                        //modified by tangcht 2019.2.27    
                        let pk = getCurrentLastId(dataSource);
                        if(!pk){
                            pk = this.state.selectedPK;
                        }
                        this.getDataForCache(pk, () => {
                            this.props.form.cancel(this.config.formId);
                            this.props.cardTable.resetTableData(this.config.tableIds[0]);
                            this.props.cardTable.resetTableData(this.config.tableIds[1]);
                            this.props.cardTable.resetTableData(this.config.tableIds[2]);
                            this.props.setUrlParam({
                                status: 'browse',
                                id: this.props.getUrlParam('id'),
                                pagecode: '10100PFC_profitcenter'
                            })
                        })
                    }
                    if ((this.props.getUrlParam('status') === 'edit')) {
                        this.props.form.cancel(this.config.formId);
                        this.props.cardTable.resetTableData(this.config.tableIds[0]);
                        this.props.cardTable.resetTableData(this.config.tableIds[1]);
                        this.props.cardTable.resetTableData(this.config.tableIds[2]);
                        this.props.setUrlParam({
                            pagecode: '10100PFC_profitcenter',
                            status: 'browse',
                            id: props.getUrlParam('id')
                        });
                    }
                    this.updateButtonStatus();
                })
            });
            break;
        case 'save':
            debugger
            //form表单必输项校验
            if (!this.props.form.isCheckNow(this.config.formId)) {
                toast({ color: 'danger', content: this.state.json['10100RESA-000003'] });/* 国际化处理： 请输入必输项！*/
                return;
            }

            //保存时维护子表数据
            this.setState(this.state);
            let pfformData = this.props.form.getAllFormValue(this.config.formId);//获得表单信息
            if (pfformData.rows[0].values['pk_father'] != null && pfformData.rows[0].values['pk_father'].value == '~') {
                pfformData.rows[0].values['pk_father'].value = null;
            }

            let pfcardData = props.createExtCardData(this.config.pageCode, this.config.formId, [this.config.tableIds[0], this.config.tableIds[1], this.config.tableIds[2]]);

            //ajax请求
            let pfsaveCallBack = () => ajax({
                url: this.config.urls['savePFCUrl'],
                data: pfcardData,
                success: (result) => {
                    if (result.success) {
                        //设置子表编辑状态
                        this.props.cardTable.setStatus(this.config.tableIds[0], 'browse', () => { });
                        this.props.cardTable.setStatus(this.config.tableIds[1], 'browse', () => { });
                        this.props.cardTable.setStatus(this.config.tableIds[2], 'browse', () => { });
                        toast({ color: 'success', title: this.state.json['10100RESA-000005'] });/* 国际化处理： 保存成功！*/
                        //设置表单浏览态
                        //将返回数据存储到缓存中
                        /*
                        * id：数据主键的值
                        * headAreacode: 卡片表头的区域编码
                        * dataSource: 缓存数据命名空间
                        */
                        debugger
                        addCache(result.data.head.profitcenter.rows[0].values.pk_profitcenter.value, result.data, this.config.formId, dataSource);

                        this.props.form.setFormStatus(this.config.formId, 'browse');
                        //表单数据
                        let headData = result.data.head[this.config.formId];
                        let fiorgData = result.data.bodys[this.config.tableIds[0]];
                        let pforgData = result.data.bodys[this.config.tableIds[1]];
                        let pfdeptData = result.data.bodys[this.config.tableIds[2]];

                        //清空表单
                        this.props.form.EmptyAllFormValue(this.config.formId);
                        //设置表单为所选树节点数据
                        this.props.form.setAllFormValue({ [this.config.formId]: headData });

                        this.props.cardTable.setTableData(this.config.tableIds[0], fiorgData, false);
                        this.props.cardTable.setTableData(this.config.tableIds[1], pforgData, false);
                        this.props.cardTable.setTableData(this.config.tableIds[2], pfdeptData, false);
                        this.updateButtonStatus();
                        this.state.status = 'browse';
                        this.setState(this.state);
                    }

                }
            });
            this.props.validateToSave(pfcardData, pfsaveCallBack, { 'pk_group': 'form', 'audit': 'form', 'ccdepts': 'cardTable', 'ccworkcenters': 'cardTable' }, 'extcard');
            break;
        case "delete":

            let message = this.state.json['10100RESA-000006']/* 国际化处理： 确认要删除所选数据吗？*/

            promptBox({
                color: 'warning',
                title: this.state.json['10100RESA-000007'],/* 国际化处理： 确认删除*/
                content: message,
                beSureBtnClick: () => {
                    let pk_profitcenter = this.props.form.getFormItemsValue(this.config.formId, 'pk_profitcenter');
                    let ts = this.props.form.getFormItemsValue(this.config.formId, 'ts');
                    ajax({
                        url: urls['delCostUrl'],
                        data: { pk_profitcenter: pk_profitcenter, ts: ts },
                        success: (result) => {
                            if (result.success) {
                                this.props.form.EmptyAllFormValue(this.config.formId);
                                this.props.cardTable.setTableData(this.config.tableIds[1], {
                                    areacode: this.config.tableIds[1],
                                    rows: []
                                }, false);
                                this.props.cardTable.setTableData(this.config.tableIds[0], {
                                    areacode: this.config.tableIds[0],
                                    rows: []
                                }, false);
                                this.props.cardTable.setTableData(this.config.tableIds[2], {
                                    areacode: this.config.tableIds[2],
                                    rows: []
                                }, false);

                                toast({ title: this.state.json['10100RESA-000008'], color: "success" });/* 国际化处理： 删除成功！*/
                            }

                        }
                    })
                }
            });
    }

}

//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS