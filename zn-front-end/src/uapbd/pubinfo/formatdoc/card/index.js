//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, high, toast, cacheTools,promptBox } from 'nc-lightapp-front';
const { NCAffix, NCTabs, NCButton, NCCheckbox, NCRadio, NCRadioGroup, NCBackBtn, NCSelect, NCFormControl, } = base;
// 选项卡内组件
const NCOption = NCSelect.NCOption;
const datelist = [{ id: 1, formnums: "-123456", isPrime: false }, { id: 2, formnums: "- 123456", isPrime: false },
{ id: 3, formnums: "(123456)", isPrime: false }, { id: 4, formnums: "123456-", isPrime: false },
{ id: 5, formnums: "123456 -", isPrime: false }, { id: 6, formnums: "-123456", isPrime: true },
{ id: 7, formnums: "- 123456", isPrime: true }, { id: 8, formnums: "123456", isPrime: true },
{ id: 9, formnums: "123456-", isPrime: true }, { id: 10, formnums: "123456 -", isPrime: true }
];
const timelist = [{ id: 1, formtime: "15:30:25" }, { id: 2, formtime: "15:30" }, { id: 3, formtime: "3:30:25PM" },
{ id: 4, formtime: "3:30:25 PM" }, { id: 5, formtime: "3:30 PM" }, { id: 6, formtime: "3:30PM" },
{ id: 7, formtime: "15时30分"}, {id: 8, formtime: "15时30分25秒" }, { id: 9, formtime: "03:30:25" }/* 国际化处理： 15时30分,15时30分25秒*/
];

import './index.less';
import { func } from 'prop-types';

const formId = 'dataformat_card';                      //表头id
const tableId = 'paymentch';                  //子表id
const pageId = '10140LFOR_card';            //pagecode
//const searchId = 'search';                  //查询区id
const appId = '0001Z010000000001H74';        //按钮注册id
const queryCardUrl = '/nccloud/uapbd/formatdoc/carddataquery.do';   //卡片查询url
const saveUrl = '/nccloud/uapbd/formatdoc/formatdocsave.do';             //新增保存  
const pk_item = 'pk_formatdoc';               //单据主键--用于卡片查询刷新
const titleCode = 'code';           //单据编码--用于卡片表头显示
//const tableBtnAry = ['delline','detail','spread'];		//表格列操作按钮
const { NCTabPane } = NCTabs;

let tableBtnAry = (props) => {
    return props.getUrlParam('status') === 'browse'
        ? ['detail'] : ['DelLine', 'spread'];
}


function initTemplate(props) {
    const that = this;
    props.createUIDom(
        {
            pagecode: pageId,//页面id
            appid: appId//注册按钮的id
        },
        function (data) {
            if (data) {
                if (data.template) {
                    let meta = data.template;
                    modifierMeta(props, meta)
                    props.meta.setMeta(meta);
                }
                if (data.button) {
                    let button = data.button;
                    props.button.setButtons(button);
                    that.toggleShow(props);
                }
            }
        }
    )
}

function modifierMeta(props, meta) {
    let status = props.getUrlParam('status');
    meta[formId].status = status;
    return meta;
}

function tableButtonClick(props, id, text, record, index) {

    switch (id) {

        case "delline"://删除行
            props.cardTable.delRowsByIndex(tableId, index);
            break;
        case "detail"://更多
            props.cardTable.toggleRowView(tableId, record);
            break;
        case "spread"://展开
            props.cardTable.openModel(tableId, 'edit', record, index);
            break;
        default:
            console.log(id, index);
            break;
    }
}


//选择地址内容
function filtarea(condition,json) {
    let resultpart;
    switch (condition) {
        case "postcode":
            resultpart = "100094";
            break;
        case "country":
            resultpart = json['10140FORMATDOC-000003'];/* 国际化处理： 中国*/
            break;
        case "province":
            resultpart = json['10140FORMATDOC-000004']/* 国际化处理： 北京*/
            break;
        case "city":
            resultpart = json['10140FORMATDOC-000005']/* 国际化处理： 北京市*/
            break;
        case "conty":
            resultpart = json['10140FORMATDOC-000006']/* 国际化处理： 海淀区*/
            break;
        case "address":
            resultpart = json['10140FORMATDOC-000007']/* 国际化处理： 北清路68号用友软件园*/
            break;
        default:
            resultpart = " "
            break;
    }
    return resultpart;
}
//选择时间内容
function filtdate(condition, conditionobj) {
    let resultpart;
    switch (condition) {
        case "years":
            resultpart = conditionobj.yeartype === "long year" ? "2009" : "09";
            break;
        case "months":
            resultpart = conditionobj.monthtype === "long month" ? "09" : conditionobj.monthtype === "short month" ? "9" : conditionobj.monthtype === "long English month" ? "Sep" : "September";
            break;
        case "days":
            resultpart = conditionobj.daytype === "long day" ? "08" : "8";
            break;
        default:
            resultpart = " "
            break;
    }
    return resultpart;
}
function filtnums(data,milSymbol,useMil) {
    let result;
    switch (data) {
        case "(123456)":
            if(useMil){
                result = "(123"+milSymbol+"456)";
            }else{
                result = "(123456)";
            }
            break;
        case "123456-":
            if(useMil){
                result = "123"+milSymbol+"456-";
            }else{
                result = "123456-";
            }
            break;
        case "123456 -":
            if(useMil){
                result = "123"+milSymbol+"456 -";
            }else{
                result = "123456 -";
            }
            break;
        case "-123456":
            if(useMil){
                result = "-123"+milSymbol+"456"
            }else{
                result = "-123456"
            }
            break;
        case "- 123456":
            if(useMil){
                result = "- 123"+milSymbol+"456"
            }else{
                result = "- 123456"
            }
            break;
        case "123456":
            if(useMil){
                result = "123"+milSymbol+"456"
            }else{
                result = "123456"
            }
            break;
        default:
            if(useMil){
                result = "-123"+milSymbol+"456"
            }else{
                result = "-123456"
            }
            break;
    }
    return result;
}
//示例框
class TestExample extends Component {
    constructor(props) {
        super(props);
        this.state = {
            json: {},
            example: this.props.example,
            isPrime: "",
            formtype: this.props.formtype || "",
            milSymbol:""
        }
    }
    componentDidMount() {
        //super.componentDidMount();
        this.setState({ json: this.props.json })
    }
    handleEgContent = () => {
        let datatype = null;
        this.setState({ example: this.props.example, isPrime: false });
        let showData = this.props.example;
        // this.props.onReset(!this.props.isReset);
        if ("time" == this.props.formtype) {
            datatype = 'time';
            this.props.callShowBack({ showData, datatype });
        } else if ("number" == this.props.formtype) {
            datatype = 'number';
            this.props.callShowBack({ showData, datatype });
        } else if ("setarea" == this.props.formtype) {
            datatype = 'area';
            this.props.callShowBack({ showData, datatype });
        } else if ("select" == this.props.formtype) {
            datatype = 'date';
            this.props.callShowBack({ showData, datatype });
        }
        this.props.onReset(!this.props.isReset);
    }

    componentWillReceiveProps(nextProps) {
        let datatype = null;
        if (this.state.formtype === 'time' || this.state.formtype === 'number') {
            const example = this.props.example; //默认值
            const formdata = nextProps.formdata;
            const showData = (formdata) ? formdata : example
            this.setState({ example: showData, isPrime: nextProps.isPrime })
            if (this.state.formtype === 'time') {//时间
                datatype = 'time';
                this.props.callShowBack({ showData, datatype });
            } else {//数字
                let result;
                let showData;
                let milSymbol =nextProps.milSymbol;
                let useMil = nextProps.useMil;
                //result = nextProps.useMil? filtnums(formdata,milSymbol,useMil) :formdata
                result = filtnums(formdata,milSymbol,useMil)
                showData = (result) ? result : example
                this.setState({ example: showData })
                datatype = 'number';
                this.props.callShowBack({ showData, datatype });
            }
        } else if (this.state.formtype === "setarea") {
            const example = this.props.example;
            const formdata = nextProps.formdata;
            let showData;
            let result;
            result = filtarea(formdata.first,this.state.json);
            result += formdata.firstsymbol;
            result += filtarea(formdata.second,this.state.json);
            result += formdata.secondsymbol;
            result += filtarea(formdata.third,this.state.json);
            result += formdata.thirdsymbol;
            result += filtarea(formdata.fourth,this.state.json);
            result += formdata.fourthsymbol;
            result += filtarea(formdata.fifth,this.state.json);
            result += formdata.fifthsymbol;
            result += filtarea(formdata.sixth,this.state.json);
            result += formdata.sixthsymbol;
            showData = (result) ? result : example;
            this.setState({ example: showData })
            datatype = 'area';
            this.props.callShowBack({ showData, datatype });
        } else if (this.state.formtype === "select") {
            const example = this.props.example;
            const formdata = nextProps.formdata;
            let showData;
            let result;
            result = filtdate(formdata.first, formdata)
            result += formdata.firstsymbol;
            result += filtdate(formdata.second, formdata)
            result += formdata.secondsymbol;
            result += filtdate(formdata.third, formdata)
            result += formdata.thirdsymbol;
            showData = (result) ? result : example;
            this.setState({ example: showData })
            datatype = 'date';
            this.props.callShowBack({ showData, datatype });
        }
    }
    render() {
        let status = this.props.status
        //console.log(this.state.formtype)
        return (
            <div className="example" style={{ width: this.props.dwidth }}>
                <div className="example-area">
                    <div className="egmodel-area">
                        <div className="egtips">{this.state.json['10140FORMATDOC-000018']}</div>{/* 国际化处理： 示例*/}
                        <span className="egcontetn"
                            style={{ width: this.props.twidth }}
                        >


                            {/* {(this.props.useMil) ?
                                ((this.state.isPrime) ?
                                    <span style={{ color: "red" }}>{filtnums(this.state.example)}</span> :
                                    <span>{filtnums(this.state.example)}</span>) :
                                ((this.state.isPrime) ?
                                    <span style={{ color: "red" }}>{this.state.example}</span> :
                                    <span>{this.state.example}</span>
                                )
                            } */}
                            {
                                this.state.isPrime ?
                                    <span style={{ color: "red" }}>{this.state.example}</span> :
                                    <span>{this.state.example}</span>
                            }
                        </span>
                    </div>
                    <div className="egbutton-area">
                        <NCButton className="egbutton" disabled={status} onClick={this.handleEgContent}>{this.state.json['10140FORMATDOC-000019']}</NCButton>{/* 国际化处理： 恢复默认值*/}
                    </div>
                </div>
            </div>
        )
    }
}
//数字控件
class NumberPart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            useMil: false,
            fordata: "",
            isPrime: false,
            json: {}
        }
    }
    componentDidMount() {
        //super.componentDidMount();
        this.setState({ json: this.props.json })
    }
    handleThousCheck = () => {
        const currentState = this.state.useMil;
        this.setState({ useMil: !currentState });
        this.props.onChangeDashNums(!currentState);
    }
    handleFormDate = (status, formdata, isPrime) => {
        if (status) {
            return ""
        } else {
            return (e) => {
                this.setState({ formdata: formdata, isPrime: isPrime })
                this.props.onChangeNums(this.state.useMil, formdata, isPrime);
            }
        }
    }
    handleChangeDecimalSymbol = (value) => {
        this.props.onChangeDecimalSymbol(value);
    }

    handleChangeMilSymbol = (value) => {
        this.props.onChangeMilSymbol(value);
    }

    render() {
        const minusFormat = this.props.datelist;
        const rows = [];
        let status = this.props.status;
        minusFormat.map((item) => {
            rows.push(<li key={item.id} onClick={this.handleFormDate(status, item.formnums, item.isPrime)}>
                {(item.isPrime) ? <span style={{ color: "red" }}>{item.formnums}</span> : <span>{item.formnums}</span>}</li>)
        });
        return (
            <div className="numberpart">
                <div className="nsymbol-area">
                    <div className="sym-thousands-part">
                        <NCCheckbox
                            className="check-thous"
                            checked={this.props.useMil}
                            onChange={this.handleThousCheck}
                            disabled={status}
                        >
                            
                        </NCCheckbox>
                        {this.state.json['10140FORMATDOC-000020']}：{/* 国际化处理： 使用千分位*/}
                            <NCFormControl
                                fieldid="NCFormControl_thoussym"
                                className="symbol-thous"
                                value ={this.props.milSymbol}
                                onChange={this.handleChangeMilSymbol}
                            />
                    </div>
                    <div className="sym-decimals-part">
                        {this.state.json['10140FORMATDOC-000021']}：{/* 国际化处理： 小数点分隔符*/}
                        <NCFormControl
                            fieldid="NCFormControl_decisym"
                            value={this.props.decimalSymbol}
                            onChange={this.handleChangeDecimalSymbol}
                            className="symbol-decimals"
                        />
                    </div>
                </div>
                <div className="m-minus-area">
                    <p>{this.state.json['10140FORMATDOC-000022']}：</p>{/* 国际化处理： 负数*/}
                    <div className="formate-part">
                        <ul>
                            {rows}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}
//日期控件
class DatePart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: {},
            json: {}
        }
    }
    componentDidMount() {
        //super.componentDidMount();
        this.setState({ date: this.state.date })
        this.setState({ json: this.props.json })
    }
    //设定select选择年月日
    handleChangeDate = (name) => {
        return (value) => {
            this.props.reset(false);
            let obj = this.props.date;
            obj[name] = value;
            this.props.onChangeDate(obj)
        }
    }
    render() {
        //console.log("this.props.date",this.props.date)
        const status = this.props.status
        return (
            <div className="setdate-area">
                <p>{this.state.json['10140FORMATDOC-000023']}</p>{/* 国际化处理： 设置日期显示格式,包括年月日的顺序和分隔符*/}
                <div className="set-part">
                    <NCSelect
                        fieldid="date_select"
                        className="select-date select-years"
                        value={this.props.date.first}
                        onChange={this.handleChangeDate("first")}
                        size="sm"
                        disabled={status}
                    >
                        <NCOption value="years">{this.state.json['10140FORMATDOC-000008']}</NCOption>{/* 国际化处理： 年*/}
                        <NCOption value="months">{this.state.json['10140FORMATDOC-000009']}</NCOption>{/* 国际化处理： 月*/}
                        <NCOption value="days">{this.state.json['10140FORMATDOC-000010']}</NCOption>{/* 国际化处理： 日*/}
                        <NCOption value="empty"></NCOption>
                    </NCSelect>
                    <NCFormControl
                        fieldid="NCFormControl_year"
                        name="sym-year"
                        className="symbols sym-year"
                        autocomplete="off"
                        value={this.props.date.firstsymbol}
                        onChange={this.handleChangeDate("firstsymbol")}
                        disabled={status}
                    />
                    <NCSelect
                        fieldid="date_select"
                        className="select-date select-months"
                        value={this.props.date.second}
                        onChange={this.handleChangeDate("second")}
                        size="sm"
                        disabled={status}
                    >
                        <NCOption value="months">{this.state.json['10140FORMATDOC-000009']}</NCOption>{/* 国际化处理： 月*/}
                        <NCOption value="days">{this.state.json['10140FORMATDOC-000010']}</NCOption>{/* 国际化处理： 日*/}
                        <NCOption value="years">{this.state.json['10140FORMATDOC-000008']}</NCOption>{/* 国际化处理： 年*/}
                        <NCOption value="empty"></NCOption>
                    </NCSelect>
                    <NCFormControl
                        fieldid="NCFormControl_month"
                        name="sym-month"
                        className="symbols sym-month"
                        autocomplete="off"
                        value={this.props.date.secondsymbol}
                        onChange={this.handleChangeDate("secondsymbol")}
                        disabled={status}
                    />
                    <NCSelect
                        fieldid="date_select"
                        className="select-date select-days"
                        value={this.props.date.third}
                        onChange={this.handleChangeDate("third")}
                        size="sm"
                        disabled={status}
                    >
                        <NCOption value="days">{this.state.json['10140FORMATDOC-000010']}</NCOption>{/* 国际化处理： 日*/}
                        <NCOption value="years">{this.state.json['10140FORMATDOC-000008']}</NCOption>{/* 国际化处理： 年*/}
                        <NCOption value="months">{this.state.json['10140FORMATDOC-000009']}</NCOption>{/* 国际化处理： 月*/}
                        <NCOption value="empty"></NCOption>
                    </NCSelect>
                    <NCFormControl
                        fieldid="NCFormControl_day"
                        name="sym-day"
                        className="symbols sym-day"
                        autocomplete="off"
                        value={this.props.date.thirdsymbol}
                        onChange={this.handleChangeDate("thirdsymbol")}
                        disabled={status}
                    />
                    <NCRadio.NCRadioGroup name="show" name="show" onChange={this.handleChangeDate()}>
                        <NCRadio value="show" disabled={status}>{this.state.json['10140FORMATDOC-000025']}</NCRadio>{/* 国际化处理： 显示时间*/}
                    </NCRadio.NCRadioGroup>
                </div>
                <div className="select-part">
                    <div className="group-r sel-year">
                        <NCRadio.NCRadioGroup name="showyear"
                            selectedValue={this.props.date.yeartype}
                            onChange={this.handleChangeDate("yeartype")}
                        >
                            <NCRadio value="long year" disabled={status}>{this.state.json['10140FORMATDOC-000026']}</NCRadio>{/* 国际化处理： 长年份*/}
                            <NCRadio value="short year" disabled={status}>{this.state.json['10140FORMATDOC-000027']}</NCRadio>{/* 国际化处理： 短年份*/}
                        </NCRadio.NCRadioGroup>
                    </div>
                    <div className="group-r sel-month">
                        <NCRadio.NCRadioGroup
                            name="showmonth"
                            selectedValue={this.props.date.monthtype}
                            onChange={this.handleChangeDate("monthtype")}
                        >
                            <NCRadio value="long month" disabled={status}>{this.state.json['10140FORMATDOC-000028']}</NCRadio>{/* 国际化处理： 长月份*/}
                            <NCRadio value="short month" disabled={status}>{this.state.json['10140FORMATDOC-000029']}</NCRadio>{/* 国际化处理： 短月份*/}
                            <NCRadio value="long English month" disabled={status}>{this.state.json['10140FORMATDOC-000030']}</NCRadio>{/* 国际化处理： 缩写英文月份*/}
                            <NCRadio value="short English month" disabled={status}>{this.state.json['10140FORMATDOC-000031']}</NCRadio>{/* 国际化处理： 英文月份*/}
                        </NCRadio.NCRadioGroup>
                    </div>
                    <div className="group-r sel-day">
                        <NCRadio.NCRadioGroup name="showday"
                            selectedValue={this.props.date.daytype}
                            onChange={this.handleChangeDate("daytype")}
                        >
                            <NCRadio value="long day" disabled={status}>{this.state.json['10140FORMATDOC-000032']}</NCRadio>{/* 国际化处理： 长天份*/}
                            <NCRadio value="short day" disabled={status}>{this.state.json['10140FORMATDOC-000033']}</NCRadio>{/* 国际化处理： 短天份*/}
                        </NCRadio.NCRadioGroup>
                    </div>
                </div>
            </div>
        )
    }
}
//时间控件
class TimePart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            json: {}
        }
    }
    componentDidMount() {
        //super.componentDidMount();
        this.setState({ json: this.props.json })
    }
    handleFormTime = (id, formtime) => {
        if (this.props.status) {
            return ""
        } else {
            return (e) => {
                this.props.onChangeTimes(formtime)
            }
        }
    }
    render() {
        let status = this.props.status;
        const rows = []
        const timeFormate = this.props.timelist;
        timeFormate.map((item) => { rows.push(<li id={item.id} key={item.id} onClick={this.handleFormTime(item.id, item.formtime)}>{item.formtime}</li>) })
        return (
            <div className="time-area">
                <p>{this.state.json['10140FORMATDOC-000034']}:</p>                {/* 国际化处理： 时间显示格式*/}
                <div className="formateTime-part">
                    <ul>
                        {rows}
                    </ul>
                </div>
            </div>
        )
    }
}
//地址控件
class AreaPart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            json: {}
        }
    }
    componentDidMount() {
        //super.componentDidMount();
        this.setState({ json: this.props.json })
    }
    handleChange = (name) => {
        return (value) => {
            this.props.reset(false);
            let obj = this.props.area;
            obj[name] = value;
            this.props.onChangeArea(obj);
        }
    }
    render() {
        const status = this.props.status;

        return (
            <div className="area-area">
                <p>{this.state.json['10140FORMATDOC-000035']}，{this.state.json['10140FORMATDOC-000036']}：</p>{/* 国际化处理： 设置地址的显示格式,包括地址各要素的顺序和分隔符*/}
                <div className="area-set-container">
                    {/* First-part */}
                    <div className="area-set first-part">
                        <NCSelect
                            fieldid="date_select"
                            className="select-area select-first"
                            value={this.props.area.first}
                            onChange={this.handleChange("first")}
                            size="sm"
                            disabled={status}
                        >
                            <NCOption value="postcode">{this.state.json['10140FORMATDOC-000037']}</NCOption>{/* 国际化处理： 邮编*/}
                            <NCOption value="country">{this.state.json['10140FORMATDOC-000038']}</NCOption>{/* 国际化处理： 国家*/}
                            <NCOption value="province">{this.state.json['10140FORMATDOC-000039']}</NCOption>{/* 国际化处理： 省*/}
                            <NCOption value="city">{this.state.json['10140FORMATDOC-000040']}</NCOption>{/* 国际化处理： 城市*/}
                            <NCOption value="conty">{this.state.json['10140FORMATDOC-000041']}</NCOption>{/* 国际化处理： 区县*/}
                            <NCOption value="address">{this.state.json['10140FORMATDOC-000042']}</NCOption>{/* 国际化处理： 地址详情*/}
                            <NCOption value="empty"></NCOption>
                        </NCSelect>
                        <NCFormControl
                            fieldid="NCFormControl_first"
                            name="sym-first"
                            className="symbols sym-first"
                            autocomplete="off"
                            value={this.props.area.firstsymbol}
                            onChange={this.handleChange("firstsymbol")}
                            disabled={status}
                        />
                    </div>
                    {/* Second-part */}
                    <div className="area-set second-part">
                        <NCSelect
                            fieldid="date_select"
                            className="select-area select-second"
                            value={this.props.area.second}
                            onChange={this.handleChange("second")}
                            size="sm"
                            disabled={status}
                        >
                            <NCOption value="postcode">{this.state.json['10140FORMATDOC-000037']}</NCOption>{/* 国际化处理： 邮编*/}
                            <NCOption value="country">{this.state.json['10140FORMATDOC-000038']}</NCOption>{/* 国际化处理： 国家*/}
                            <NCOption value="province">{this.state.json['10140FORMATDOC-000039']}</NCOption>{/* 国际化处理： 省*/}
                            <NCOption value="city">{this.state.json['10140FORMATDOC-000040']}</NCOption>{/* 国际化处理： 城市*/}
                            <NCOption value="conty">{this.state.json['10140FORMATDOC-000041']}</NCOption>{/* 国际化处理： 区县*/}
                            <NCOption value="address">{this.state.json['10140FORMATDOC-000042']}</NCOption>{/* 国际化处理： 地址详情*/}
                            <NCOption value="empty"></NCOption>
                        </NCSelect>
                        <NCFormControl
                            fieldid="NCFormControl_second"
                            name="sym-second"
                            className="symbols sym-second"
                            autocomplete="off"
                            value={this.props.area.secondsymbol}
                            onChange={this.handleChange("secondsymbol")}
                            disabled={status}
                        />
                    </div>
                    {/* Third-part */}
                    <div className="area-set third-part">
                        <NCSelect
                            fieldid="date_select"
                            className="select-area select-third"
                            value={this.props.area.third}
                            onChange={this.handleChange("third")}
                            size="sm"
                            disabled={status}
                        >
                            <NCOption value="postcode">{this.state.json['10140FORMATDOC-000037']}</NCOption>{/* 国际化处理： 邮编*/}
                            <NCOption value="country">{this.state.json['10140FORMATDOC-000038']}</NCOption>{/* 国际化处理： 国家*/}
                            <NCOption value="province">{this.state.json['10140FORMATDOC-000039']}</NCOption>{/* 国际化处理： 省*/}
                            <NCOption value="city">{this.state.json['10140FORMATDOC-000040']}</NCOption>{/* 国际化处理： 城市*/}
                            <NCOption value="conty">{this.state.json['10140FORMATDOC-000041']}</NCOption>{/* 国际化处理： 区县*/}
                            <NCOption value="address">{this.state.json['10140FORMATDOC-000042']}</NCOption>{/* 国际化处理： 地址详情*/}
                            <NCOption value="empty"></NCOption>
                        </NCSelect>
                        <NCFormControl
                            fieldid="NCFormControl_third"
                            name="sym-third"
                            className="symbols sym-third"
                            autocomplete="off"
                            value={this.props.area.thirdsymbol}
                            onChange={this.handleChange("thirdsymbol")}
                            disabled={status}
                        />
                    </div>
                    {/* Fourth-part */}
                    <div className="area-set fourth-part">
                        <NCSelect
                            fieldid="date_select"
                            className="select-area select-fourth"
                            value={this.props.area.fourth}
                            onChange={this.handleChange("fourth")}
                            size="sm"
                            disabled={status}
                        >
                            <NCOption value="postcode">{this.state.json['10140FORMATDOC-000037']}</NCOption>{/* 国际化处理： 邮编*/}
                            <NCOption value="country">{this.state.json['10140FORMATDOC-000038']}</NCOption>{/* 国际化处理： 国家*/}
                            <NCOption value="province">{this.state.json['10140FORMATDOC-000039']}</NCOption>{/* 国际化处理： 省*/}
                            <NCOption value="city">{this.state.json['10140FORMATDOC-000040']}</NCOption>{/* 国际化处理： 城市*/}
                            <NCOption value="conty">{this.state.json['10140FORMATDOC-000041']}</NCOption>{/* 国际化处理： 区县*/}
                            <NCOption value="address">{this.state.json['10140FORMATDOC-000042']}</NCOption>{/* 国际化处理： 地址详情*/}
                            <NCOption value="empty"></NCOption>
                        </NCSelect>
                        <NCFormControl
                            fieldid="NCFormControl_fourth"
                            name="sym-fourth"
                            className="symbols sym-fourth"
                            autocomplete="off"
                            value={this.props.area.fourthsymbol}
                            onChange={this.handleChange("fourthsymbol")}
                            disabled={status}
                        />
                    </div>
                    {/* Fifth-part */}
                    <div className="area-set fifth-part">
                        <NCSelect
                            fieldid="date_select"
                            className="select-area select-fifth"
                            value={this.props.area.fifth}
                            onChange={this.handleChange("fifth")}
                            size="sm"
                            disabled={status}
                        >
                            <NCOption value="postcode">{this.state.json['10140FORMATDOC-000037']}</NCOption>{/* 国际化处理： 邮编*/}
                            <NCOption value="country">{this.state.json['10140FORMATDOC-000038']}</NCOption>{/* 国际化处理： 国家*/}
                            <NCOption value="province">{this.state.json['10140FORMATDOC-000039']}</NCOption>{/* 国际化处理： 省*/}
                            <NCOption value="city">{this.state.json['10140FORMATDOC-000040']}</NCOption>{/* 国际化处理： 城市*/}
                            <NCOption value="conty">{this.state.json['10140FORMATDOC-000041']}</NCOption>{/* 国际化处理： 区县*/}
                            <NCOption value="address">{this.state.json['10140FORMATDOC-000042']}</NCOption>{/* 国际化处理： 地址详情*/}
                            <NCOption value="empty"></NCOption>
                        </NCSelect>
                        <NCFormControl
                            fieldid="NCFormControl_fifth"
                            name="sym-fifth"
                            className="symbols sym-fifth"
                            autocomplete="off"
                            value={this.props.area.fifthsymbol}
                            onChange={this.handleChange("fifthsymbol")}
                            disabled={status}
                        />
                    </div>
                    {/* Sixth-part */}
                    <div className="area-set sixth-part">
                        <NCSelect
                            fieldid="date_select"
                            className="select-area select-sixth"
                            value={this.props.area.sixth}
                            onChange={this.handleChange("sixth")}
                            size="sm"
                            disabled={status}
                        >
                            <NCOption value="postcode">{this.state.json['10140FORMATDOC-000037']}</NCOption>{/* 国际化处理： 邮编*/}
                            <NCOption value="country">{this.state.json['10140FORMATDOC-000038']}</NCOption>{/* 国际化处理： 国家*/}
                            <NCOption value="province">{this.state.json['10140FORMATDOC-000039']}</NCOption>{/* 国际化处理： 省*/}
                            <NCOption value="city">{this.state.json['10140FORMATDOC-000040']}</NCOption>{/* 国际化处理： 城市*/}
                            <NCOption value="conty">{this.state.json['10140FORMATDOC-000041']}</NCOption>{/* 国际化处理： 区县*/}
                            <NCOption value="address">{this.state.json['10140FORMATDOC-000042']}</NCOption>{/* 国际化处理： 地址详情*/}
                            <NCOption value="empty"></NCOption>
                        </NCSelect>
                        <NCFormControl
                            fieldid="NCFormControl_sixth"
                            name="sym-sixth"
                            className="symbols sym-sixth"
                            autocomplete="off"
                            value={this.props.area.sixthsymbol}
                            onChange={this.handleChange("sixthsymbol")}
                            disabled={status}
                        />
                    </div>
                </div>
            </div>
        )
    }
}
class Card extends Component {
    constructor(props) {
        super(props);
        this.formId = formId;
        //this.searchId = searchId;
        // this.tableId = tableId;
        this.state = {
            temppk:'',
            json: {},
            numsExample: '',
            dateExample: '',
            timeExample: '',
            areaExample: '',
            status: "",
            title_code: '',
            totalcount: 0,
            applycount: 0,
            //选项卡内state数据
            isChoose: false,
            formNums: '',
            useMil: false,
            isPrime: false,
            formTimes: '',
            decimalSymbol:".", //小数点分隔符
            milSymbol:",",  //千分符
            date: {
                first: "years",
                firstsymbol: "",/* 国际化处理： 年*/
                second: "months",
                secondsymbol: "",/* 国际化处理： 月*/
                third: "days",
                thirdsymbol: "",/* 国际化处理： 日*/
                yeartype: "long year",
                monthtype: "long month",
                daytype: "long day"
            },
            area: {
                first: "postcode",
                firstsymbol: " ",
                second: "country",
                secondsymbol: " ",
                third: "province",
                thirdsymbol: " ",
                fourth: "city",
                fourthsymbol: " ",
                fifth: "conty",
                fifthsymbol: "",
                sixth: "address",
                sixthsymbol: " ",
            },
            onReset: false,
            onResetArea: false,
        }
        initTemplate.call(this, this.props);
    }
    componentDidMount() {
        // toggleShow(this.props);
        const {json = {}} = this.state;
        let status = this.props.getUrlParam('status');
        window.addEventListener("beforeunload", function (e) {
            var  n  =  window.event.screenX  -  window.screenLeft; 
                  var  b  =  n  >  document.documentElement.scrollWidth-20; 
            if(b  &&  window.event.clientY  <  0  ||  window.event.altKey) {//关闭
            //不是所有浏览器都支持提示信息的修改
            var confirmationMessage = json["10140FORMATDOC-000062"];//"请先保存您编辑的内容,否则您修改的信息会丢失。";
            e.returnValue = confirmationMessage;
            return confirmationMessage;
            }else {
            //不是所有浏览器都支持提示信息的修改
            var confirmationMessage = json["10140FORMATDOC-000062"];
            e.returnValue = confirmationMessage;
            return confirmationMessage;
            }
            });
            
        if (status != "add") {
            let pk = this.props.getUrlParam('id');
            if (pk && pk != 'undefined') {
                this.getdata(pk);
            }
        }
        else {
            this.setDefaultValue();
        }

    }

    componentWillMount() {
        let _this10 =this;
        let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            if (status) {
                _this10.setState({ json, inlt });// 保存json和inlt到页面state中并刷新页面
                _this10.setState({
                    date: {
                        first: "years",
                        firstsymbol:  json['10140FORMATDOC-000008'],/* 国际化处理： 年*/
                        second: "months",
                        secondsymbol: json['10140FORMATDOC-000009'],/* 国际化处理： 月*/
                        third: "days",
                        thirdsymbol: json['10140FORMATDOC-000010'],/* 国际化处理： 日*/
                        yeartype: "long year",
                        monthtype: "long month",
                        daytype: "long day"
                    }
                })
            } else {
                console.log('未加载到多语资源');   // 未请求到多语资源的后续操作
            }
        }
        this.props.MultiInit.getMultiLang({ 'moduleId': '10140Farmat', 'domainName': 'uapbd', callback });
    }

    componentWillReceiveProps() { }

    //切换页面状态
    toggleShow = (props) => {
        let status = props.getUrlParam('status');
        let flag = status === 'browse' ? false : true;
        this.setState({ status: status });
        //console.log("11111",this.state.status);
        //按钮的显示状态
        if (status == 'add') {
            props.button.setButtonVisible(['add', 'back', 'del', 'edit','copy','refresh','setdefault'], false);
            props.button.setButtonVisible(['save', 'cancel'], true);
            props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);

        } else if (status == 'edit') {
            props.button.setButtonVisible(['add', 'back', 'del', 'edit','copy','refresh','setdefault'], false);
            props.button.setButtonVisible(['save', 'cancel'], true);
            props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
        } else {
            props.button.setButtonVisible(['save', 'cancel'], false);
            props.button.setButtonVisible(['add', 'edit', 'del','copy','refresh','setdefault'], true);
            props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
        }
        props.form.setFormStatus(formId, status);
    };
    setDefaultValue = () => {
        //this.props.form.setFormItemsValue(this.formId,{'pk_org':{value: this.props.CacheTools.get("pk_org"),display:'自由态'}});
    }

    buttonClick(props, id) {

        let _this = this;
        switch (id) {
            case 'add':
                props.form.EmptyAllFormValue(this.formId)
                //props.cardTable.setTableData(this.tableId, { rows: [] })
                props.pushTo('/card', {
                    pagecode: '10140LFOR_card',
                    appcode: '10140LFOR',
                    status: 'add'
                })
                this.toggleShow(this.props);
                break
            
            case 'copy':
                
                this.setState({ temppk: this.props.form.getFormItemsValue("dataformat_card", "pk_formatdoc").value});
                this.props.form.setFormStatus(this.formId, "add")
                this.props.form.setFormItemsValue(this.formId,{pk_formatdoc:{value:'',display:''}});
                this.props.button.setButtonVisible(['add', 'back', 'del', 'edit','copy','refresh','setdefault'], false);
                this.props.button.setButtonVisible(['save', 'cancel'], true);
                this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false); 
                break
            case 'edit':
                props.pushTo('/card', {
                    pagecode: '10140LFOR_card',
                    appcode: '10140LFOR',
                    status: 'edit',
                    pk: props.form.getFormItemsValue("dataformat_card", "pk_formatdoc")
                })
                this.toggleShow(this.props);
                break;
            
            case 'del':
                this.props.modal.show('del');
                break;
            case 'save':
                this.saveClick();
                this.setState({ temppk:''});
                break;
            case 'Reback':
                props.pushTo('/list', {
                    appcode: '10140LFOR',
                    pagecode :"10140LFOR_dataformat"
                })
                break;
            case 'cancel':

                promptBox({
					color:"warning",               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.state.json['10140FORMATDOC-000057'],                // 提示标题,  国际化处理： 确认取消*/
					content: this.state.json['10140FORMATDOC-000058'],             // 提示内容,非必输/* 国际化处理： 是否确认要取消？*/
					noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
					noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
					beSureBtnName: this.state.json['10140FORMATDOC-000059'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
					cancelBtnName: this.state.json['10140FORMATDOC-000060'],           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
					beSureBtnClick: () => {
						if (props.getUrlParam('status') === 'add') {
                            props.form.cancel(this.formId);
                            props.pushTo('/card', {
                                id: props.getUrlParam('id'),
                                status: 'browse'
                            })
        
                        }
                        let temppk=this.state.temppk;
                        this.props.form.setFormItemsValue(this.formId,{pk_formatdoc:{value:temppk,display:temppk}});
                        this.setState({ temppk:''});
                        if ((props.getUrlParam('status') === 'edit')) {
                            props.form.cancel(this.formId);
                            //props.cardTable.resetTableData(this.tableId);
                            props.pushTo('/card', {
                                status: 'browse',
                                id: props.getUrlParam('id')
                            })
                        }
                        this.toggleShow(this.props);
					}
				});


                
                break
            case 'setdefault':
            let data = {
				pageid:'10140LFOR_card',
				id: props.form.getFormItemsValue("dataformat_card", "pk_formatdoc").value,
				model : {
					areaType: "table",
					pageinfo: null,
					rows: []
				}
			};
			//data.model.rows = tableData;
			ajax({
				url: '/nccloud/uapbd/formatdoc/formatdocdefault.do',
				data:data,
				success: (res) => {
                    _this.getdata (props.form.getFormItemsValue("dataformat_card", "pk_formatdoc").value)
					toast({color:"success",content:_this.state.json['10140FORMATDOC-000052']});/* 国际化处理： 成功*/
					//this.refreshAction(props);
				}
			});
            break;
            case 'refresh':
                // props.pushTo('/card', {
                //     pagecode: '10140LFOR_card',
                //     appcode: '10140LFOR',
                //     status: props.getUrlParam('status'),
                //     id: props.form.getFormItemsValue("dataformat_card", "pk_formatdoc").value
                // })
                this.getdata (props.form.getFormItemsValue("dataformat_card", "pk_formatdoc").value)
                this.toggleShow(this.props);
                toast({ content: this.state.json['10140FORMATDOC-000011'], color: 'success' });/* 国际化处理： 刷新成功*/
                break
            default:
                break
        }
    }

    pageInfoClick = (props, pk) => {

        let data = {
            //'pk_org':cacheTools.get('pk_org'),
            'pk': pk,
            'pageid': pageId
        };
        ajax({
            url: queryCardUrl,
            data: data,
            success: (res) => {
                if (res.data.head) {

                    props.form.setAllFormValue({ [formId]: res.data.head[formId] });
                    props.setUrlParam(pk)//动态修改地址栏中的id的值
                }
            }
        });
    }


    afterEvent = (props, moduleId, key, value, changedrows, i, s, g) => { }

    //通过单据id查询单据信息
    getdata = (pk) => {
        let data = {
            pk
        };
        ajax({
            url: queryCardUrl,
            data,
            success: (res) => {
                if (res.data.head) {
                    this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                    //时间
                    this.setState({ numsExample: res.data.head['dataformat_card'].rows[0].values.exp_number.value });
                    this.setState({formNums:res.data.head['dataformat_card'].rows[0].values.exp_number.value });
                    this.setState({useMil:res.data.head['dataformat_card'].rows[0].values.fm.value.nfm.useMil});
                    this.setState({decimalSymbol:res.data.head['dataformat_card'].rows[0].values.fm.value.nfm.decimalSymbol});
                    this.setState({milSymbol:res.data.head['dataformat_card'].rows[0].values.fm.value.nfm.milSymbol})
                    //日期
                    this.setState({ dateExample: res.data.head['dataformat_card'].rows[0].values.exp_date.value });
                    let date ={
                            first: res.data.head['dataformat_card'].rows[0].values.fm.value.dfm.dateUnit1.name==="年"?"years":(res.data.head['dataformat_card'].rows[0].values.fm.value.dfm.dateUnit1.name==="月"?"months":"days"),
                            firstsymbol: res.data.head['dataformat_card'].rows[0].values.fm.value.dfm.delimit1,
                            second: res.data.head['dataformat_card'].rows[0].values.fm.value.dfm.dateUnit2.name==="年"?"years":(res.data.head['dataformat_card'].rows[0].values.fm.value.dfm.dateUnit2.name==="月"?"months":"days"),
                            secondsymbol: res.data.head['dataformat_card'].rows[0].values.fm.value.dfm.delimit2,
                            third: res.data.head['dataformat_card'].rows[0].values.fm.value.dfm.dateUnit3.name==="年"?"years":(res.data.head['dataformat_card'].rows[0].values.fm.value.dfm.dateUnit3.name==="月"?"months":"days"),
                            thirdsymbol: res.data.head['dataformat_card'].rows[0].values.fm.value.dfm.delimit3,
                            yeartype: res.data.head['dataformat_card'].rows[0].values.fm.value.dfm.yearType.code,
                            monthtype: res.data.head['dataformat_card'].rows[0].values.fm.value.dfm.monthType.code,
                            daytype: res.data.head['dataformat_card'].rows[0].values.fm.value.dfm.dayType.code
                    };
                    this.setState({date:date});
                    //时间
                    this.setState({ timeExample: res.data.head['dataformat_card'].rows[0].values.exp_time.value });
                    //地址
                    this.setState({ areaExample: res.data.head['dataformat_card'].rows[0].values.exp_address.value });
                    let postcode= res.data.head['dataformat_card'].rows[0].values.fm.value.afm.addrUnit1.code;
                    let country= res.data.head['dataformat_card'].rows[0].values.fm.value.afm.addrUnit2.code;
                    let province= res.data.head['dataformat_card'].rows[0].values.fm.value.afm.addrUnit3.code;
                    let city= res.data.head['dataformat_card'].rows[0].values.fm.value.afm.addrUnit4.code;
                    let conty= res.data.head['dataformat_card'].rows[0].values.fm.value.afm.addrUnit45.code;
                    let address= res.data.head['dataformat_card'].rows[0].values.fm.value.afm.addrUnit5.code;
                    let area = {
                        first: postcode==='P'?'postcode':postcode==='C'?'country':postcode==='S'?'province':postcode==='T'?'city':postcode==='D'?'conty':'address',
                        firstsymbol: res.data.head['dataformat_card'].rows[0].values.fm.value.afm.delimit1,
                        second: country==='P'?'postcode':country==='C'?'country':country==='S'?'province':country==='T'?'city':country==='D'?'conty':'address',
                        secondsymbol: res.data.head['dataformat_card'].rows[0].values.fm.value.afm.delimit1,
                        third: province==='P'?'postcode':province==='C'?'country':province==='S'?'province':province==='T'?'city':province==='D'?'conty':'address',
                        thirdsymbol: res.data.head['dataformat_card'].rows[0].values.fm.value.afm.delimit1,
                        fourth: city==='P'?'postcode':city==='C'?'country':city==='S'?'province':city==='T'?'city':city==='D'?'conty':'address',
                        fourthsymbol: res.data.head['dataformat_card'].rows[0].values.fm.value.afm.delimit1,
                        fifth: conty==='P'?'postcode':conty==='C'?'country':conty==='S'?'province':conty==='T'?'city':conty==='D'?'conty':'address',
                        fifthsymbol: res.data.head['dataformat_card'].rows[0].values.fm.value.afm.delimit1,
                        sixth: address==='P'?'postcode':address==='C'?'country':address==='S'?'province':address==='T'?'city':address==='D'?'conty':'address',
                        sixthsymbol: res.data.head['dataformat_card'].rows[0].values.fm.value.afm.delimit1,
                    }
                    this.setState({area:area});
                    let title_code = res.data.head[this.formId].rows[0].values[titleCode].value;
                    this.setState({ title_code });
                }

            }
        });
    }

    //保存单据
    saveClick = () => {
        let check = this.props.form.isCheckNow("dataformat_card");
        if(!check) return;
        let _this = this;
        let CardData = this.props.createMasterChildData(pageId, this.formId, this.tableId);
        let area = this.state.area;
        let useMil = this.state.useMil;
        let date = this.state.date;
        let isPrime = this.state.isPrime;
        let decimalSymbol  =this.state.decimalSymbol;
        let  milSymbol =this.state.milSymbol;
        let exp_number = this.props.form.getFormItemsValue("dataformat_card", "exp_number").value;
        let exp_time = this.props.form.getFormItemsValue("dataformat_card", "exp_time").value?this.props.form.getFormItemsValue("dataformat_card", "exp_time").value:"15:30:25";
        //console.log(CardData);
        CardData['head']['dataformat_card']['rows'][0]['values']['fm'] = {};
        let url = saveUrl;//新增保存
        ajax({
            url: url,
            data: {
                milSymbol:milSymbol,
                decimalSymbol:decimalSymbol,
                carddata: CardData,
                area: area,
                date: date,
                useMil: useMil,
                isPrime: isPrime,
                exp_number: exp_number,
                exp_time: exp_time
            },
            success: (res) => {
                let pk_value = null
                if (res.success) {
                    if (res.data) {
                        if (res.data.head && res.data.head[_this.formId]) {
                            _this.props.form.setAllFormValue({ [_this.formId]: res.data.head[_this.formId] });
                            pk_value = res.data.head[_this.formId].rows[0].values[pk_item].value
                        }
                    }
                    toast({ content: _this.state.json['10140FORMATDOC-000012'], color: 'success' });/* 国际化处理： 保存成功*/
                    _this.getdata(pk_value);
                    _this.props.pushTo('/card', {
                        status: 'browse',
                        id: pk_value
                    })
                    this.toggleShow(_this.props)
                }
            }
        })
    }

    //删除单据
    delConfirm = () => {
        ajax({
            url: '/nccloud/uapbd/formatdoc/formatdocdelete.do',
            data: {
                pk_org: cacheTools.get('pk_org'),

                pk_formatdoc: this.props.getUrlParam('id'),
                ts: this.props.form.getFormItemsValue(this.formId, 'ts').value
            },
            success: (res) => {
                if (res) {
                    this.props.pushTo('/card', {
                        status: 'browse',
                        pagecode: '10140LFOR_card'
                    });
                }
                this.props.form.setFormItemsValue(this.formId,{code:{value:'',display:''}});
                this.props.form.setFormItemsValue(this.formId,{name:{value:'',display:''}});
                this.props.form.setFormItemsValue(this.formId,{description:{value:'',display:''}});
                this.props.form.setFormItemsValue(this.formId,{pk_formatdoc:{value:'',display:''}});
                this.props.form.setFormItemsValue(this.formId,{is_default:{value:false,display:false}});
                this.toggleShow(this.props);
                toast({ content: this.state.json['10140FORMATDOC-000011'], color: 'success' });/* 国际化处理： 删除成功*/
            }
        });
    };

    modelSave = (props) => {
        props.cardTable.closeModel(this.tableId);
        this.saveClick();
    }

    getButtonNames = (codeId) => {
        if (codeId === 'edit' || codeId === 'add' || codeId === 'save') {
            return 'main-button'
        } else {
            return 'secondary - button'
        }
    };

    //获取列表肩部信息
    getTableHead = () => {
        let { button } = this.props;
        let { createButtonApp } = button;
        let buttons = this.props.button.getButtons();
        let status = this.props.getUrlParam("status");
        return (
            <div className="shoulder-definition-area">
                <div className='definition-search'>
                    {status == 'browse' ? <div><span className="definition-search-title">{this.state.json['10140FORMATDOC-000043'] | this.state.json['10140FORMATDOC-000044']}：</span>/* 国际化处理： 详细信息,总计*/
                        <span className='count'>{this.state.totalcount}</span><span>{this.state.json['10140FORMATDOC-000045']}</span>{/* 国际化处理： 条*/}
                        {/* <span>		申请数量 ：</span> */}
                        {/* <span className='count'>{this.state.applycount}</span><span>个</span> */}
                    </div> : <span className="definition-search-title"></span>
                    }
                </div>
                <div className="definition-icons">
                    {createButtonApp({
                        area: 'definition-icons',//按钮注册中的按钮区域
                        //buttonLimit: 5, 
                        onButtonClick: this.buttonClick.bind(this)
                        //popContainer: document.querySelector('.header-button-area')
                    })}
                    {this.props.cardTable.createBrowseIcons(this.tableId, {
                        iconArr: ['close', 'open', 'max', 'setCol'],
                        maxDestAreaId: 'nc-bill-card'
                    })}
                    {/* {createButton("deleteline", {
						name: '删行',
						onButtonClick: buttonClick.bind(this)
					})} */}
                </div>
            </div>
        )
    }
    //选项卡控件动作内容
    handleDashNums = (isForm) => {
        if (isForm) {
            this.setState({ isChoose: true })
            this.setState({useMil:true});
        } else {
            this.setState({ isChoose: false })
            this.setState({useMil:false});
        }
    }
    handleChangeNums = (useMil, formdata, isPrime) => {
        this.setState({ useMil: useMil, formNums: formdata, isPrime: isPrime })
    }
    handleDecimalSymbol = (value) => {
        this.setState({decimalSymbol:value})
    }
    handleMilSymbol = (value) => {
        this.setState({milSymbol:value})
    }
    handleChangeTimes = (formdata) => {
        this.setState({ formTimes: formdata })
    }
    handleChangeDate = (data) => {
        this.setState({ date: data });
    }
    handleChangeArea = (data) => {
        this.setState({ area: data });
    }
    handleResetNums = (value)=> {
        this.setState({ onReset: value, decimalSymbol:".",milSymbol:",",useMil:false,isPrime:false,useMil:false })
    }
    handleResetall = (value) => {
        let obj = {
            first: "years",
            firstsymbol: this.state.json['10140FORMATDOC-000008'],/* 国际化处理： 年*/
            second: "months",
            secondsymbol: this.state.json['10140FORMATDOC-000009'],/* 国际化处理： 月*/
            third: "days",
            thirdsymbol: this.state.json['10140FORMATDOC-000010'],/* 国际化处理： 日*/
            yeartype: "long year",
            monthtype: "long month",
            daytype: "long day",
        }
        this.setState({ onReset: value, date: obj })
    }
    handleResetArea = (value) => {
        let area = {
            first: "postcode",
            firstsymbol: " ",
            second: "country",
            secondsymbol: " ",
            third: "province",
            thirdsymbol: " ",
            fourth: "city",
            fourthsymbol: " ",
            fifth: "conty",
            fifthsymbol: "",
            sixth: "address",
            sixthsymbol: " ",
        }
        this.setState({ onResetArea: value, area: area })
    }
    gerShowData = (vo = {}) => {
        if ("number" == vo.datatype) {
            this.props.form.setFormItemsValue('dataformat_card', { 'exp_number': { display: vo["showData"], value: vo["showData"] } });
        } else if ("time" == vo.datatype) {
            this.props.form.setFormItemsValue('dataformat_card', { 'exp_time': { display: vo["showData"], value: vo["showData"] } });
        } else if ("date" == vo.datatype) {
            this.props.form.setFormItemsValue('dataformat_card', { 'exp_date': { display: vo["showData"], value: vo["showData"] } });
        } else if ("area" == vo.datatype) {
            this.props.form.setFormItemsValue('dataformat_card', { 'exp_address': { display: vo["showData"], value: vo["showData"] } });
        }
    }
    render() {
        let { cardTable, form, button, modal, cardPagination, BillHeadInfo } = this.props;
        const { createBillHeadInfo } = BillHeadInfo;
        const { createCardPagination } = cardPagination;
        let buttons = this.props.button.getButtons();
        buttons = buttons.sort((a, b) => {
            return b.btnorder - a.btnorder;
        });
        let { createForm } = form;
        let { createCardTable } = cardTable;
        let { createButtonApp } = button;
        let { createModal } = modal;
        //let status = this.props.getUrlParam('status');
        let status = this.state.status;
        //console.log("22222222",status)
        // let isEdit = status==="add"?false:status==="edit"?false:true
        let isEdit = status === "add" || status === "edit" ? false : true
        // let isEdit = (status) => {
        //     console.log("233333333333333",status)
        //     if(status==="add"||status==="edit"){
        //         return false;
        //     }else{
        //         return true;
        //     }
        // }
        // status=status=""?""
        //示例默认值
        // const numsExample = this.state.numsExample||"-123456"
        // const dateExample = this.state.dateExample||"2009年09月08";
        // const timeExample = this.state.timeExample||"15:30:25"
        // const areaExample = this.state.areaExample||"100094 中国 北京 北京市 海淀区北清路68号用友软件园"

        const numsExample = "-123456"
        const dateExample = this.state.json['10140FORMATDOC-000014'];/* 国际化处理： 2009年09月08*/
        const timeExample = "15:30:25"
        const areaExample = this.state.json['10140FORMATDOC-000015']/* 国际化处理： 100094 中国 北京 北京市 海淀区北清路68号用友软件园*/
        
        return (
            <div id='nc-bill-card'>
                <div className="nc-bill-card">
                    <NCAffix>
                        <div className='nc-bill-header-area'>
                            <div className='header-title-search-area'>{
                                createBillHeadInfo(
                                    {
                                        backBtnClick: () => { this.buttonClick(this.props, 'Reback') },
                                        //backBtnClick: onCardButtonClick.bind(this,this.props,'Card_Return'),
                                        title: this.state.json['10140FORMATDOC-000002']/* 国际化处理： 数据格式*/             //标题

                                    }
                                )
                            }
                            </div>
                            <div className="header-button-area">
                                {createButtonApp({
                                    area: 'header-button-area',//按钮注册中的按钮区域
                                    //buttonLimit: 5, 
                                    onButtonClick: this.buttonClick.bind(this)
                                    //popContainer: document.querySelector('.header-button-area')
                                })}
                                {/* {createCardPagination({
										handlePageInfoChange: this.pageInfoClick.bind(this)
									})} */}
                            </div>
                        </div>
                    </NCAffix>
                    <div className="nc-bill-form-area">
                        {createForm(this.formId, {
                            onAfterEvent: this.afterEvent.bind(this)
                        })}
                    </div>
                    <NCTabs defaultActiveKey="1">
                        <NCTabPane tab={<span>{this.state.json['10140FORMATDOC-000046']}</span>} key="1">{/* 国际化处理： 数字*/}
                            {/* 数字格式化 */}
                            <TestExample dwidth="600px" twidth="150px" formdata={this.state.formNums} status={isEdit} 
                            isReset={this.state.onReset} onReset={this.handleResetNums}
                            json={this.state.json} isPrime={this.state.isPrime} useMil={this.state.useMil}  milSymbol={this.state.milSymbol}
                            example={numsExample} callShowBack={this.gerShowData} formtype="number" />

                            <NumberPart datelist={datelist} status={isEdit}  useMil={this.state.useMil}
                                decimalSymbol = {this.state.decimalSymbol} milSymbol={this.state.milSymbol}
                                onChangeNums={this.handleChangeNums} onChangeDecimalSymbol={this.handleDecimalSymbol}  onChangeMilSymbol={this.handleMilSymbol}
                                json={this.state.json} onChangeDashNums={this.handleDashNums} />
                        </NCTabPane>
                        <NCTabPane tab={<span>{this.state.json['10140FORMATDOC-000047']}</span>} key="2" >{/* 国际化处理： 日期*/}
                            {/* 日期格式化 */}
                            <TestExample dwidth="800px" twidth="385px" formdata={this.state.date} json={this.state.json} status={isEdit} example={dateExample} isReset={this.state.onReset} onReset={this.handleResetall} callShowBack={this.gerShowData} formtype="select" />
                            <DatePart reset={this.handleResetall} status={isEdit} date={this.state.date} json={this.state.json} onChangeDate={this.handleChangeDate} isReset={this.state.onReset} />
                        </NCTabPane>
                        <NCTabPane tab={<span>{this.state.json['10140FORMATDOC-000048']}</span>} key="3">{/* 国际化处理： 时间*/}
                            {/* 时间格式化 */}
                            <TestExample dwidth="400px" twidth="220px" formdata={this.state.formTimes} json={this.state.json} status={isEdit} example={timeExample} callShowBack={this.gerShowData} formtype="time" />
                            <TimePart timelist={timelist} status={isEdit} json={this.state.json} onChangeTimes={this.handleChangeTimes} />
                        </NCTabPane>
                        <NCTabPane tab={<span>{this.state.json['10140FORMATDOC-000049']}</span>} key="4">{/* 国际化处理： 地址*/}
                            {/* 地址格式化 */}
                            <TestExample dwidth="1100px" twidth="920px" formdata={this.state.area} json={this.state.json} status={isEdit} example={areaExample} isReset={this.state.onResetArea} onReset={this.handleResetArea} callShowBack={this.gerShowData} formtype="setarea" />
                            <AreaPart reset={this.handleResetArea} status={isEdit} json={this.state.json} area={this.state.area} onChangeArea={this.handleChangeArea} isReset={this.state.onResetArea} />
                        </NCTabPane>
                    </NCTabs>

                    {createModal('del', {
                        title: this.state.json['10140FORMATDOC-000016'],/* 国际化处理： 注意*/
                        content: this.state.json['10140FORMATDOC-000017'],/* 国际化处理： 确认删除？*/
                        beSureBtnClick: this.delConfirm
                    })}
                </div>
            </div>

        );
    }
}

Card = createPage({
    // initTemplate: initTemplate
})(Card);


// ajav({

// 	success: function(temp){
// 		var temp0 = temp;
// 		Card = createPage({
// 			initTemplate: function(){
// 				return temp0;
// 			}
// 		})(Card);
// 	}
// })

ReactDOM.render(<Card />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65