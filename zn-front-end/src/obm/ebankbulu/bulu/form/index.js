/*cI4u54VYZVPxnvGrX5EL6Bn0FYQMeXndHNWOLMieTb3OFXNCOIgdypfy8wL/yyNw*/
/**
 * 
 * 支付补录控件
 * 
 */

import React, { Component } from 'react';
import { createPage, ajax, base, toast ,getMultiLang,getBusinessInfo} from 'nc-lightapp-front';
import { initTemplate, afterEvent } from './events';
import './index.less';

const { NCModal, NCButton } = base;

class PayBuluForm extends Component {
    //建立props属性，定义需要用到的变量
    constructor(props) {
        super(props);
        this.props = props;
        this.moduleId = '3610BULU';
        this.formId = "form_bulu";
        this.tableid = "table_bulu";
        this.selrow = 0;
        this.needInit = true;
        this.banksize = 1;
        this.bankdata = {};
        this.bulusize = 0;
        this.buludata = {};
        this.state = {
            step: 1,
            title: "",
            needOpeanUI: false,
            currentLocale: 'zh-CN',
            json:{}
        };
    }

    //生命周期函数：用于首次加载
    componentDidMount() {
        // this.init(this.props) ;
    }
    componentWillMount() {
		this.initMultiLang();
	}

    initMultiLang = () => {
		let moduleid = this.moduleId;
		getMultiLang({
			moduleId: moduleid, 
			currentLocale: this.state.currentLocale,
			domainName: 'obm',
			callback:this.setMultiLang
        })
	}
	setMultiLang = (json) => {
		this.setState({
			json
		} ,() => {
			initTemplate.call(this,this.props);
		})
	}

    //生命周期函数：用于刷新控件
    componentWillReceiveProps(nextProps) {
     console.log("nextProps.showmodal" + nextProps.showmodal);
        console.log("this.state.step" + this.state.step);
        console.log("this.needInit" + this.needInit);
        if (nextProps.showmodal && this.state.step === 1 && this.needInit) {
            this.needInit = false;
            this.buluInit(this.props);
        }
       
    }

    //访问后台，获取补录模板和补录数据
    buluInit(props) {
        ajax({
            url: '/nccloud/obm/ebankbulu/buluget.do',
            data: {
                onLineData: this.props.onLineData,
                modelType: this.props.modelType,
                moduleType: this.props.moduleType
            },
            success: (res) => {
                if (res.success) {
                    if (res.data) {
                        let bulumaps = res.data;
                        this.banksize = res.data.banksize;
                        this.bankdata = res.data.bankdata;
                        this.bulusize = res.data.bulusize;
                        this.buludata = res.data.buludata;
                      
                        if (this.bulusize > 0) {
                            //依次弹出补录信息
                            this.init(this.props);
                        } else {
                            this.setState({
                                needOpeanUI:false
                            });
                            //无需补录，直接支付
                            this.payMoney(this.props);
                        }
                    }
                }

            },
            error: (res) => {
                this.needInit = true;
                this.props.onCloseClick && this.props.onCloseClick();
                this.setState(
                    {
                        step: 1,
                        title: this.state.json['3610BULU-000000'],/* 国际化处理： 网银补录信息*/
                        needOpeanUI: false
                    }
                );
                toast({ color: 'warning', content: res.message });
            }
        })
    }

    //根据补录模板和补录数据，初始化页面
    init(props) {
        let index = this.state.step - 1;
        let meta = this.buludata[index].bulumeta.templet;
        this.props.meta.setMeta(meta);
        let tabledata = this.buludata[index].bulumeta.value;
        this.props.table.setAllTableData("table_bulu", tabledata);
        //Form默认显示Table第一行的数据
        let values = tabledata.rows[0].values;
        this.props.form.setFormItemsValue(this.formId, values);
        this.selrow = 0;

        //设置补录标题、补录是否显示
        let buluindex = this.buludata[index].buluindex;
        let bankData = this.bankdata[buluindex];
        const { bankname,needOpeanUI } = bankData;
        const { bank, func } = bankData.elog.m_HeadVO.attributeValue;
        this.setState({
            title:  this.state.json['3610BULU-000000']+`(${bankname}${bank}_${func})`,/* 国际化处理： 网银补录信息*/
            needOpeanUI:needOpeanUI&&this.props.showmodal
        },() => {
            this.props.table.setAllTableData("table_bulu", tabledata);
        });
    }

    //把补录号的数据传递到后台，校验和存储补录信息
    payMoney = async (props) => { 
        let signStr= '';
        signStr +=  '{bankData:[';
        let index1 = 0;
        for (let item of this.bankdata) {
            if (index1>0){
                signStr +=  ',';
            }
            let onLineDatas = item['requestvos']; 
            signStr +=  '{onlineData:[';
            let index2 = 0;
            for (let onlineData of onLineDatas) {
                if (index2>0){
                    signStr +=  ',';
                }
                signStr +=  '{'
                signStr +=  'dbtacc:' + onlineData['dbtacc'] + ',' ;
                signStr +=  'crtacc:' + onlineData['crtacc'] + ',' ;
                signStr +=  'trsamt:' + this.number_format(onlineData['trsamt'],8,'.','','round') ;
                signStr +=  '}';
                index2 = index2 + 1;
            } 
            signStr +=  ']}';
            index1 = index1 + 1;
        }
        signStr +=  ']}';  
        let businessInfo = getBusinessInfo();
        if (!businessInfo|| !businessInfo.userCode) {
            toast({color: 'warning', content: this.state.json['3610BULU-000000']}); /* 国际化处理： 无法获取当前登录用户信息, 请重新登录*/
            return { 
            };
        }
        let isca= await this.getIsca();
        let signBefore = signStr;
        let signResult = superSign(signStr,businessInfo.userCode,false,isca);
        if(signResult.status==1){
            toast({color: 'error', content: signResult.msg});
            return {};
        }
        
        let signAfter = signResult.signStr;
        let sn = signResult.sn;
        ajax({
            url: '/nccloud/obm/ebankbulu/buluset.do',
            data: {
                retvo: this.bankdata,
                // signBefore:signBefore,
                signData:signAfter, 
                sn:sn,
                modelType: this.props.modelType,
                moduleType: this.props.moduleType
            },
            success: (res) => {
                if (res.success) {
                    if (res.data) {
                        //调用父页面的回调函数，进行支付并关闭页面
                        this.needInit = true;
                        this.props.onSureClick && this.props.onSureClick(res.data);
                        this.setState(
                            {
                                step: 1,
                                title: this.state.json['3610BULU-000000'],/* 国际化处理： 网银补录信息*/
                                needOpeanUI: false
                            }
                        );
                        // toast({color: 'success', content: this.state.json['3610BULU-000016']}); /* 国际化处理： 无法获取当前登录用户信息, 请重新登录*/
                    }
                }
            }
        }) 
        
    }

    //双击表格，编辑选中行数据
    doubleClick = (record, index) => {
        let values = this.props.table.getAllTableData(this.tableid).rows[index].values;
        this.props.form.setFormItemsValue(this.formId, values);
        this.selrow = index;
    }

    //单击表格，编辑选中行数据
    rowClick = (props, moduleId, record, index) => {
        let values = this.props.table.getAllTableData(this.tableid).rows[index].values;
        this.props.form.setFormItemsValue(this.formId, values);
        this.selrow = index;
    }

    //点击确定按钮，存储补录数据，并判断是否有下一条，有的话，弹出下一条的补录界面
    OkClick = () => {

        //补录校验
        let busnarItem = this.props.form.getFormItemsValue(this.formId, 'busnar');
        let busnar;
        if (busnarItem) {
            busnar = busnarItem.value;
        }
        let sqlchar = ["%", "/", "\\", "'", "%", "&", "<", "<", ">", "\n", "\""];
        if (busnar) {
            for (let sql of sqlchar) {
                if (busnar.includes(sql)) {
                    toast({ content: this.state.json['3610BULU-000000']+`[${sql}]`, color: "warning" });/* 国际化处理： 摘要包含特殊字符,摘要包含特殊字符*/
                    return;
                }
            }
        }
        this.check();
    }

    //补录校验
    check = () => {
        let index = this.state.step - 1;
        let buluindex = this.buludata[index].buluindex;
        let oldret = this.bankdata[buluindex];
        let func = oldret.elog.m_HeadVO.attributeValue['func'];
        let str;

        if ((this.props.modelType !== undefined && this.props.modelTyp !== null && this.props.modelType !== 4) && (func && func !== 'query')) {
            //检查补录项目
            this.checkItemLength();
        } else {
            this.buluOk();
        }
    }

    //检查补录项目
    checkItemLength = () => {
        let str = '';
        let meta = this.props.meta.getMeta();
        let item = meta['table_bulu'].items;
        let tableData = this.props.table.getAllTableData(this.tableid);
        let rowCount = tableData.rows.length;
        let data = tableData.rows;
        let itemCount = item == null ? 0 : item.length;
        let obj = null;
        const allToast = {};
        for (let i = 0; i < rowCount; i++) {
            const rowToast = [];
            for (let j = 0; j < itemCount; j++) {
                const { maxlength, label, itemtype, attrcode } = item[j];
                if (itemtype === 'input') {
                    obj = data[i].values[attrcode].value;
                    if (obj && obj.length > maxlength) {
                        str = `${label}`+this.state.json['3610BULU-000004']+`${maxlength}`;/* 国际化处理： 长度大于*/
                        rowToast.push(str);
                    }
                }
            }
            if (rowToast.length > 0) {
                allToast[i] = rowToast;
            }

        }

        if (Object.keys(allToast).length > 0) {

            let finalContent = ""; //最后展示的content
            Object.keys(allToast).forEach(item => {
                //对输出的校验内容进行格式转化
                finalContent += this.state.json['3610BULU-000002']+`${+item + 1}`+this.state.json['3610BULU-000009']+`${allToast[item].join(/* 国际化处理： 第,行*/
                    "，"
                )}；`;
            });

            this.props.modal.show('MessageDlg', {
                title: this.state.json['3610BULU-000003'],/* 国际化处理： 截位处理*/
                content: this.state.json['3610BULU-000005']+`？\n` +/* 国际化处理： 是否对下述超长字段自动进行截位处理*/
                    finalContent.slice(0, finalContent.length - 1) +
                    "。",
                beSureBtnClick: this.beSureBtnClick.bind(this, str),
                cancelBtnClick: this.cancelBtnClick.bind(this, finalContent)
            }, );

           
        } else {
            //非空校验
            if (this.checknull()) {
                this.buluOk();
            }
        }
    }


    //补录校验提示框确定处理
    beSureBtnClick = (msg) => {
        //截位处理
        this.cutItemByLength();
        //非空校验
        if (this.checknull()) {
            this.buluOk();
        }
    }

    //补录校验提示框取消处理
    cancelBtnClick = (msg) => {
        //非空校验
        if (this.checknull()) {
            this.buluOk();
        }
    }

    //非空校验
    checknull = () => {

        //TODO 需要验证此种方法是否可行
        let tableData = this.props.table.getAllTableData(this.tableid);
        return this.checkRequired.call(this, this.tableid,tableData.rows);
    }
    //获取必输项字段名 
    checkRequired = (tableId, rows) => {
        let state = this.state;
        let meta = this.props.meta.getMeta();
        if (!!!meta['table_bulu']) {
            toast({
                content: `${this.state.json['3610BULU-000011']}${tableId}${this.state.json['3610BULU-000012']}`,
                color: "warning"
            });
            return false;
        }
        if (Array.isArray(rows)) {
            const allToast = {}; //保存所有检验提示信息
            meta['table_bulu'].items.filter(e => e.visible).forEach(item => {
            //将数据中没有的列附上空对象，保证校验的准确性
            const { attrcode, children } = item;
            if (!this.isUndefined.call(this,children)) {
                //判断和并列的情况
                children.forEach(child => {
                const { attrcode } = child;
                rows.forEach(row => {
                    if (row.status !== "3") {
                    if (this.isUndefined.call(this,row.values[attrcode])) {
                        row.values[attrcode] = {};
                    }
                    }
                });
                });
            } else {
                rows.forEach(row => {
                if (row.status !== "3") {
                    if (this.isUndefined.call(this,row.values[attrcode])) {
                    row.values[attrcode] = {};
                    }
                }
                });
            }
            });
            rows.forEach((val, index) => {
            const rowToast = []; //保存每行的检验提示信息
            //便利校验是否没有输入必输项
            if (val.status !== "3") {
                Object.keys(val.values).forEach(eve => {
                const value = val.values[eve].value;
                if (value === "" || value === null || value === undefined) {
                    meta['table_bulu'].items
                    .filter(e => e.visible)
                    .forEach(item => {
                        const { attrcode, required, children, label } = item;
                        if (!this.isUndefined.call(this,children)) {
                        //判断和并列的情况
                        children.forEach(child => {
                            const { attrcode, required, label } = child;
                            if (required && attrcode === eve) {
                            rowToast.push(label);
                            }
                        });
                        } else {
                        if (required && attrcode === eve) {
                            rowToast.push(label);
                        }
                        }
                    });
                }
                });
            }
            if (rowToast.length > 0) {
                allToast[index] = rowToast;
            }
            });
        
            if (Object.keys(allToast).length > 0) {
            //如果检验到了，有必输项没有输入
            Object.keys(allToast).forEach(item => {
                //对收集的检验信息进行对比排序
                let finalRequied = [];
                meta['table_bulu'].items
                .filter(e => e.visible)
                .forEach(metaItem => {
                    allToast[item].forEach(toast => {
                    const { children, label } = metaItem;
                    if (!this.isUndefined.call(this,children)) {
                        //判断和并列的情况
                        children.forEach(child => {
                        const { label } = child;
                        if (toast === label) {
                            finalRequied.push(`[${label}]`);
                        }
                        });
                    } else {
                        if (toast === label) {
                        finalRequied.push(`[${label}]`);
                        }
                    }
                    });
                });
                allToast[item] = finalRequied;
            });
        
            let finalContent = ""; //最后展示的content
            Object.keys(allToast).forEach(item => {
                //对输出的校验内容进行格式转化
                finalContent += `${this.state.json['3610BULU-000002']} 
                            ${+item + 1} ${this.state.json['3610BULU-000009']} ${allToast[item].join("，")}；`;
            });
            toast({
                content:
                `${this.state.json['3610BULU-000010']}` +
                finalContent.slice(0, finalContent.length - 1) +
                "。",
                color: "danger"
            });
            return false;
            } else {
                return true;
            }
        } else {
            toast({
                content: `${this.state.json['3610BULU-000013']}`,
                color: "warning"
            });
            return false;
        }
    }
    isUndefined = (origin) =>{
        return typeof origin === 'undefined' || origin === void 0;
    }
    cutItemByLength = () => {
        let meta = this.props.meta.getMeta();
        let item = meta['table_bulu'].items;
        let tableData = this.props.table.getAllTableData(this.tableid);
        let rowCount = tableData.rows.length;
        let data = tableData.rows;
        let itemCount = item == null ? 0 : item.length;
        let obj = null;
        let objValue = null;

        let checkRow = this.props.table.getCheckedRows(this.tableid);

        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < itemCount; j++) {
                const { maxlength, label, itemtype, attrcode } = item[j];
                if (itemtype === 'input') {
                    obj = data[i].values[attrcode];
                    objValue = obj.value;
                    if (objValue && objValue.length > maxlength) {
                        objValue = objValue.substring(0, maxlength);
                        obj.value = objValue;
                        obj.display = obj.display.substring(0, maxlength);
                        this.props.table.setValByKeyAndIndex(this.tableid, i, attrcode, obj);
                        if (i === this.selrow) {
                            this.props.form.setFormItemsValue(this.formId, { [attrcode]: obj });
                        }
                    }
                }

            }
        }



    }

    //点击关闭按钮，调用父页面的回调函数，关闭页面
    CloseClick = () => {
        //处理数据
        let index = this.state.step - 1;
        let buluindex = this.buludata[index].buluindex;
        //弹出下一页面
        if (this.state.step < this.bulusize) {
            this.setState(
                {
                    step: this.state.step + 1
                }, () => {
                    this.init(this.props);
                }
            );

        } else {
            this.needInit = true;
            this.props.onCloseClick && this.props.onCloseClick();
            this.setState(
                {
                    step: 1,
                    title: this.state.json['3610BULU-000000'],/* 国际化处理： 网银补录信息*/
                    needOpeanUI: false
                }
            );
        }

    }

    //补录成功
    buluOk = () => {
        //处理数据
        let index = this.state.step - 1;
        let buluindex = this.buludata[index].buluindex;
        let tablevalue = this.props.table.getAllTableData(this.tableid);
        let oldret = this.bankdata[buluindex];
        let rows = tablevalue.rows.length;
        let keys = Object.keys(tablevalue.rows[0].values);
        let cols = keys.length;
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                let value = tablevalue.rows[i].values[keys[j]].value;
                oldret.elog.m_ItemVOs[i].logvo[keys[j]] = value;
                if(oldret.elog.m_ItemVOs[i].attributeValue[keys[j]]){
                    oldret.elog.m_ItemVOs[i].attributeValue[keys[j]] = value;
                }
            }
        }
        //弹出下一页面
        if (this.state.step < this.bulusize) {
            this.setState(
                {
                    step: this.state.step + 1
                }, () => {
                    this.init(this.props);
                }
            );

        } else {
            //补录完毕，进行支付
            this.payMoney(this.props);
        }
    }

    //复制补录
    copyBulu = () => {
        let meta = this.props.meta.getMeta();
        let headItems = meta['form_bulu'].items;
        let bodyItems = meta['table_bulu'].items;
        let tableData = this.props.table.getAllTableData(this.tableid);
        let rows = tableData.rows;
        let rowCount = tableData.rows.length;
        let isCopy = false;
        if (this.selrow < 0 || this.selrow >= rowCount) {
            return;
        }
        headItems.filter(e => e.visible).forEach(item => {
            const { attrcode, bulu, disabled } = item;
            const value = this.props.form.getFormItemsValue(this.formId, attrcode);
            if (bulu === 'Y' && !disabled) {
                rows.forEach((row) => {
                    // rows[index].values[attrcode] = value;
                    row.values[attrcode] = value;
                });
                isCopy = true;
            }
        });
        if (isCopy) {
            this.props.table.setAllTableData("table_bulu", tableData);
        }

    }

    number_format (number, decimals, dec_point, thousands_sep,roundtag) { 
        /*
        * 参数说明：
        * number：要格式化的数字
        * decimals：保留几位小数
        * dec_point：小数点符号
        * thousands_sep：千分位符号
        * roundtag:舍入参数，默认 "ceil" 向上取,"floor"向下取,"round" 四舍五入
        * */
        number = (number + '').replace(/[^0-9+-Ee.]/g, '');
        roundtag = roundtag || "ceil"; //"ceil","floor","round"
        var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function (n, prec) {
     
                var k = Math.pow(10, prec);
                console.log();
     
                return '' + parseFloat(Math[roundtag](parseFloat((n * k).toFixed(prec*2))).toFixed(prec*2)) / k;
            };
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        var re = /(-?\d+)(\d{3})/;
        // while (re.test(s[0])) {
        //     s[0] = s[0].replace(re, "$1" + sep + "$2");
        // }
     
        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
    } 

    getIsca () {
        return new Promise(resolve => ajax({
            type: 'post',
            url: '/nccloud/tmpub/pub/iscauser.do', 
            loading: false,
            async: false,
            success: res => {
                if (res.success) {
                    resolve(res.data);
                }
            },
            error: res => {
                resolve(false);
            },
        }));
    }

    // 界面渲染
    render() {

        // 获取创建表单API
        let { modal, ncmodal } = this.props;
        let { createModal } = modal;
        let { createForm } = this.props.form;
        let { createSimpleTable } = this.props.table;
        let createNCModal = ncmodal.createModal;
        const { createEditTable } = this.props.editTable;
         //是否浏览态
        let isEditStatus = this.props.modelType == '1' ? true : false;
        // let { button} = this.props;
        // let { createButtonApp } = this.props.button; 

        return (
            <div className="form-wrapper">

                <NCModal show={this.state.needOpeanUI} style={{ width: '1380px', height:'585px' }} onHide={this.CloseClick}>
                    <NCModal.Header closeButton={true}>
                        <NCModal.Title style={{ height: '20px' }}>{this.state.title}</NCModal.Title>
                    </NCModal.Header>

                    <NCModal.Body >
                        <div >
                            {
                                createForm(this.formId,
                                    {
                                        //编辑后事件
                                        onAfterEvent: afterEvent.bind(this)
                                    }
                                )
                            }
                            <div style={{ height: '20px' }}></div>
                            <div style={{ height: '200px' }}>
                                {
                                    createSimpleTable(this.tableid,
                                        {
                                            onRowClick: this.rowClick,
                                            onRowDoubleClick: this.doubleClick,
                                            showIndex: true
                                        }
                                    )
                                }
                            </div>
                        </div>
                    </NCModal.Body>

                     {isEditStatus ? ( 
                          <NCModal.Footer>
                             <NCButton onClick={this.CloseClick}>{this.state.json['3610BULU-000014']}</NCButton>
                          </NCModal.Footer>             
                       ) : (
                          <NCModal.Footer>
                             <NCButton onClick={this.copyBulu}>{this.state.json['3610BULU-000006']}</NCButton>
                             <NCButton className="button-primary" onClick={this.OkClick}>{this.state.json['3610BULU-000007']}</NCButton>
                             <NCButton onClick={this.CloseClick}>{this.state.json['3610BULU-000008']}</NCButton>
                          </NCModal.Footer>
                        )}


                </NCModal>

                {/* 截位处理模态框 */}
                {createNCModal('MessageDlg', {
                    title: this.state.json['3610BULU-000003'],/* 国际化处理： 截位处理*/
                })}

            </div>
        );
    }
}

export default createPage({
    //initTemplate: initTemplate,   // initTemPlateFn为初始化模板的方法
    //mutiLangCode: '3610BULU'
})(PayBuluForm);

/*cI4u54VYZVPxnvGrX5EL6Bn0FYQMeXndHNWOLMieTb3OFXNCOIgdypfy8wL/yyNw*/