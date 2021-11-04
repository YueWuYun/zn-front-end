//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage,ajax,toast,createPageIcon, getMultiLang } from 'nc-lightapp-front';

import FactoryGridRef from '../../../refer/org/FactoryGridRef/index'

import AssignModal from '../excomponents/AssignModal';

const tableId1 = 'actlist'      //上：作业档案区域
const tableId2 = 'wclist'       //下：工作中心区域
const cactivityid = 'cactivityid'          //作业档案主键
const cwkid = 'cwkid'                       //工作中心主键
const cassignid = 'cassignid'               //作业分配主键
const appcode = '10140AASSIGN'  //节点编码
const pageId = '10140AASSIGN_list'  //作业分配列表页面pageid
const dataSource = 'mmbd.aassign.aassign.data'

const queryListUrl = '/nccloud/mmbd/aassign/queryactivity.do'     //根据pk_group、pk_org查询作业档案
const queryaassignvobyactivity = '/nccloud/mmbd/aassign/queryaassignvobyactivity.do'    //根据作业档案pk查询已选、可选工作中心
const saveUnAassignVOs = '/nccloud/mmbd/aassign/saveUnAassignVOs.do'    //提交选择结果 

class List extends Component {
    constructor(props) {
        super(props)
        this.tableId1 = tableId1        //actlist
        this.tableId2 = tableId2        //wclist
        this.selectedActivityRowRecord = null   //作业档案选中行
        this.selectedWkRowRecords = []         //工作中心选中行
        this.state = {
            json: {},
            inlt: null,
            pk_org: null        //当前选择的工厂参照
        }
    }

    componentDidMount() {
        //多语初始化后的回调函数
        let callback = (json, status, inlt) => {
            if(status) {
                this.setState({json, inlt}, ()=>{
                    this.initTemplate(this.props)
                })
            }
        }

        let callbacknoinit = (json, status, inlt) => {
            if(status) {
                this.setState({pubjson: {...json}})
            }
        }

        //多与初始化
        this.props.MultiInit.getMultiLang({moduleId: '10140AASSIGN', domainName: 'uapbd',callback})
        this.props.MultiInit.getMultiLang({moduleId: '10140mmpubmsg', domainName: 'uapbd', callback: callbacknoinit})

        //特殊处理：工厂参照--处理初始化时默认选择的工厂
        let pk_org = this.props.getUrlParam('pk_org')
        if(pk_org && pk_org.refpk){
            let tableData = {
                allpks: [],
                rows: []
            }
            this.props.setAllTableData(tableId1, tableData)     //作业档案列表清空
            this.props.setAllTableData(tableId2, tableData)     //工作中心列表清空
            this.setState({pk_org: pk_org})     //记录当前选择的工厂
            this.getData(pk_org.refpk)          //根据当前选择的工厂查询数据并加载          
        }
        
        this.setBtnStatus()
    }

    initTemplate = (props) => {
        props.createUIDom({
            pagecode: pageId,
            appcode: appcode
        },(data)=>{
            if(data){
                if(data.template){      //初始化模板信息
                    let meta = data.template        //应用注册中配置的模板信息
                    meta = this.modifierMeta(props, meta)   //动态调整
                    props.meta.setMeta(meta)                //更新模板信息
                }

                if(data.button){        //初始化按钮信息
                    let button = data.button
                    props.button.setButtons(button)
                }

                if(data.context){
                    if(data.context.pk_org){
                        this.setState({
                            pk_org: {
                                value: data.context.pk_org,
                                display: data.context.org_Name,
                                refpk: data.context.pk_org,
                                refname: data.context.org_Name
                            }
                        }, ()=>{
                            this.getData(data.context.pk_org, false)
                        })
                    }
                }
            }
        })
    }

    //在单据模板加载基础上的调整
    modifierMeta(props, meta){
        //添加操作列
        //作业档案列表-分配
        // meta[tableId1].items.push({
        //     itemtype: 'customer',
        //     attrcode: 'opr',
        //     label: '操作',
        //     width: 200,
        //     className: 'table-opr',
        //     visible: true,
        //     render: (text, record, index)=>{
        //         return (
        //         <span>
        //             <span
        //                 style={{ cursor:'pointer' }} 
        //                 onClick={(e)=>{
        //                     let id = record.values[cactivityid].value
        //                     if(this.selectedActivityRowRecord == null || this.selectedActivityRowRecord.cactivityid.value != id){
        //                         this.selectedActivityRowRecord = record.values
        //                         let data = {
        //                             cactivityid: this.selectedActivityRowRecord.cactivityid.value,
        //                             pk_org: record.values.pk_org.value
        //                         }
        //                         console.log(data)
        //                         this.queryWorkCenterByActivity(props, data, false, ()=>{
        //                              this.onAssignClick(props, id)
        //                         })
        //                     }else{
        //                         this.onAssignClick(props, id)
        //                     }                                                                   
        //                 }}>
        //                     {'分配'}
        //             </span>
        //             <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
        //             <span
        //                 style={{ cursor:'pointer' }} 
        //                 onClick={(e)=>{
        //                     let id = record.values[cactivityid].value
        //                     if(this.selectedActivityRowRecord == null || this.selectedActivityRowRecord.cactivityid.value != id){
        //                         this.selectedActivityRowRecord = record.values
        //                         this.selectedWkRowRecords = []
        //                         let data = {
        //                             cactivityid: this.selectedActivityRowRecord.cactivityid.value,
        //                             pk_org: record.values.pk_org.value
        //                         }
        //                         console.log(data)
        //                         this.queryWorkCenterByActivity(props, data, false, ()=>{
        //                              this.onUnAssignClick(props, id)
        //                         })
        //                     }else{
        //                         this.onUnAssignClick(props, id)
        //                     } 
        //                 }}>
        //                     {'取消分配'}
        //             </span>
        //             <span>&nbsp;&nbsp;</span>
        //         </span>                
        //         )
        //     }
        // })
        //工作中心列表-取消分配
        meta[tableId2].items.push({
            itemtype: 'customer',
            attrcode: 'opr',
            label: '操作',
            width: 200,
            className: 'table-opr',
            visible: true,
            render: (text, record, index)=>{
                return (
                <span>
                    <span
                        style={{ cursor:'pointer' }} 
                        onClick={(e)=>{                                                       
                            props.cardTable.selectAllRows(tableId2, false)
                            props.cardTable.selectRowsByIndex(tableId2, index)

                            this.selectedWkRowRecords = [] 
                            this.selectedWkRowRecords.push(record)
                            let aassignrecords = []
                            this.selectedWkRowRecords.forEach(item => {
                                let one = {
                                    cwkid: item.values['cwkid.cwkid'],
                                    pk_group: item.values['cwkid.pk_group'],
                                    pk_org: item.values['cwkid.pk_org'],
                                    pk_org_v: item.values['cwkid.pk_org_v'],
                                    cactivityid: this.selectedActivityRowRecord.cactivityid.value
                                }
                                aassignrecords.push(one)
                            })
                            console.log(aassignrecords)
                                                        
                            let data = {
                                pk_org: this.state.pk_org.value,
                                cactivityid: this.selectedActivityRowRecord.cactivityid.value,
                                aassignedvos: aassignrecords
                            }
                            ajax({
                                url: saveUnAassignVOs,
                                data,
                                success: (res)=>{
                                    this.queryAassignvoByActivity(props, data, false,null) 
                                }
                            })
                        }}>
                        {'取消分配'}
                    </span>
                    <span>&nbsp;&nbsp;</span>
                </span>
                )
            }
        })
        return meta
    }

    refreshAction = (props, showToast) => {
        let pk_org = props.getUrlParam('pk_org')
        if(pk_org == null || pk_org == ''){
            if(this.state.pk_org == null || this.state.pk_org.value == ''){
                return
            }else{
                pk_org = this.state.pk_org.value
            }
        }
        this.getData(pk_org, false, ()=>{
            if(showToast){
                toast({
                    title: '刷新成功！',
                    color: 'success'
                })
            }
        });
    }

    getData(pk_org, showToast = false, callback) {
        let data = {
            pageInfo:{
                pageIndex:0,
                pageSize:10,
                total:0,
                totalPage:0
            },
            pagecode: pageId,
            pk_org: pk_org
        }
        ajax({
            url: queryListUrl,
            data,
            success: (res) => {
                console.log(res)
                let allPks = []
                if(res.data){
                    res.data[tableId1].rows.forEach(row => {
                        allPks.push(row.values[cactivityid].value)
                    })                    
                    res.data[tableId1].allpks = allPks
                    this.props.cardTable.setTableData(tableId1, res.data[tableId1])
                     //上下表体中的选中记录清空
                    this.selectedActivityRowRecord = null
                    this.selectedWkRowRecords = []
                    this.setBtnStatus()
                    //查询结果提示
                    let count = allPks.length
                    let {inlt} = this.state
                    if(showToast){
                        toast({
                            title: '已成功!',
                            content: inlt.get('查询成功，共{count}条。', {count: count}),
                            color: 'success'
                        })
                    }
                }else{
                    let tableData = {allpks:[], rows:[]}
                    this.props.cardTable.setTableData(tableId1, tableData)
                     //上下表体中的选中记录清空
                    this.selectedActivityRowRecord = null
                    this.selectedWkRowRecords = []
                    this.setBtnStatus()
                    //查询结果提示
                    if(showToast){
                        toast({
                            title: '请注意!',
                            content: '未查询出符合条件的数据！',
                            color: 'warning'
                        })
                    }
                }

                if(callback && typeof callback == 'function'){
                    callback()
                }
            }
        })
    }

    setBtnStatus() {
        let actrows = this.props.cardTable.getAllData(tableId1).rows    //作业档案列表
        if(actrows && actrows.length > 0){
            this.props.button.setButtonDisabled(['Refresh'],false)
            if(this.selectedActivityRowRecord){
                this.props.button.setButtonDisabled(['Assign','UnAssign'],false)
            }else{
                this.props.button.setButtonDisabled(['Assign','UnAssign'],true)
            }
        }else{
            this.props.button.setButtonDisabled(['Refresh'],true)
        }    
    }

    //改变工厂
    onUnitChange = (refdata) => {
        this.setState({
            pk_org: {
                value:refdata.refpk,
                display: refdata.refname,
                refpk:refdata.refpk,
                refname:refdata.refname
            }
        })
        if(refdata.refpk){
            this.getData(refdata.refpk, false, ()=>{})
        }else{
            this.props.cardTable.setTableData(tableId1, {rows: []})
            this.props.cardTable.setTableData(tableId2, {rows: []})
             //上下表体中的选中记录清空
            this.selectedActivityRowRecord = null
            this.selectedWkRowRecords = []
        }
    }

    //按钮事件
    buttonClick = (props, id) => {
        switch (id) {
            case 'Refresh':
                this.refreshAction(props, true)
                break;
            case 'Assign':
                //分配
				this.onAssignClick(props, id)
                break;
            case 'UnAssign':
                //取消分配
                this.onUnAssignClick(props, id)
                break;
            default:
                break;
        }
    }

    onAssignClick = (props, id) => {
        if(this.selectedActivityRowRecord == null){
            toast({
                content: '请先选择一个作业档案！',
                color: 'warning'
            })
            return
        }

        let data = {
            cactivityid: this.selectedActivityRowRecord.cactivityid.value,
            pk_org: this.state.pk_org.value
        }

        this.assignModal.show(data, false, ()=>{
            console.log('assignModal close')
            this.queryAassignvoByActivity(props, data, false,null) 
        })
    }

    onUnAssignClick = (props, id) => {
        if(this.selectedActivityRowRecord == null){
            toast({
                content: '请先选择一个作业档案！',
                color: 'warning'
            })
            return
        }

        if(this.props.cardTable.getAllData(tableId2).rows == null || this.props.cardTable.getAllData(tableId2).rows.length == 0){
            toast({
                content: '该作业档案没有已分配的工作中心！',
                color: 'warning'
            })
            return
        }

        
        if(this.selectedWkRowRecords == null || this.selectedWkRowRecords.length == 0){
            //如果没有选择工作中心，则弹出对话框，选择要取消分配的工作中心
            let data = {
                cactivityid: this.selectedActivityRowRecord.cactivityid.value,
                pk_org: this.state.pk_org.value
            }

            this.assignModal.show(data, true, ()=>{
                console.log('assignModal close')
                this.queryAassignvoByActivity(props, data, false,null) 
            })
        }else{
            let aassignrecords = []
            this.selectedWkRowRecords.forEach(item => {
                let one = {
                    cwkid: item.data.values['cwkid.cwkid'],
                    pk_group: item.data.values['cwkid.pk_group'],
                    pk_org: item.data.values['cwkid.pk_org'],
                    pk_org_v: item.data.values['cwkid.pk_org_v'],
                    cactivityid: this.selectedActivityRowRecord.cactivityid.value
                }
                aassignrecords.push(one)
            })
            console.log(aassignrecords)
                                        
            let data = {
                pk_org: this.state.pk_org.value,
                cactivityid: this.selectedActivityRowRecord.cactivityid.value,
                aassignedvos: aassignrecords
            }
            ajax({
                url: saveUnAassignVOs,
                data,
                success: (res)=>{
                    this.queryAassignvoByActivity(props, data, false,null) 
                }
            })
        }

        
    }

    onActivityClick = (props, moduleId, record, index, status) =>{
        let showToast = false
        let oldrecord = this.selectedActivityRowRecord
        this.selectedActivityRowRecord = record.values
        console.log(this.selectedActivityRowRecord)

        this.selectedWkRowRecords = [] 
        if(this.selectedActivityRowRecord){
            if(oldrecord == null || oldrecord.cactivityid.value != this.selectedActivityRowRecord.cactivityid.value){
                props.cardTable.setTableData(tableId2, {rows: []})
            }
        }

        let data = {
            cactivityid: this.selectedActivityRowRecord.cactivityid.value,
            pk_org: this.state.pk_org.value
        }
        
        this.queryAassignvoByActivity(props, data, false,null) 
    }

    queryAassignvoByActivity = (props, data, isShowToast = false, callback) => {
        ajax({
            url: queryaassignvobyactivity,
            data,
            success: (res) => {                                
                if(res.data){ 
                    let tabledata = {
                        rows: [],
                        areacode: 'wclist'
                    }

                    res.data.map((line)=>{
                        let json = JSON.parse(line)                       
                        if(json.assigned == true || json.assigned =='true'){
                            let temp = {}
                            temp['cwkid.cwkid'] = json['cwkid']
                            temp['cwkid.pk_group'] = json['pk_group']
                            temp['cwkid.pk_org'] = json['pk_org']
                            temp['cwkid.pk_org_v'] = json['pk_org_v']
                            temp['cwkid.vwkcode'] = {value:json['code'], display:json['code']}
                            temp['cwkid.vwkname'] = {value:json['name'], display:json['name']}

                            tabledata.rows.push({values:temp})
                        }
                    })                    

                    console.log(tabledata)
                    props.cardTable.setTableData(tableId2, tabledata)


                    // let index = 0
                    // selecteddata.forEach(item => {

                    //     props.cardTable.setValByKeyAndIndex(tableId2, index, 'caassignid', {value: item.cassignid, display:item.cassignid})
                    //     props.cardTable.setValByKeyAndIndex(tableId2, index, 'cwkid.cwkid', {value: item.cwkid, display:item.cwkid})
                    //     props.cardTable.setValByKeyAndIndex(tableId2, index, 'cwkid.pk_group', {value: item.pk_group, display:item.pk_group})
                    //     props.cardTable.setValByKeyAndIndex(tableId2, index, 'cwkid.pk_org', {value: item.pk_org, display:item.pk_org})
                    //     props.cardTable.setValByKeyAndIndex(tableId2, index, 'cwkid.pk_org_v', {value: item.pk_org_v, display:item.pk_org_v})
                    //     props.cardTable.setValByKeyAndIndex(tableId2, index, 'cwkid.vwkcode', {value: item.code, display:item.code})
                    //     props.cardTable.setValByKeyAndIndex(tableId2, index, 'cwkid.vwkname', {value: item.name, display:item.name})
                    //     index++  
                    // });
                    console.log(props.cardTable.getAllData(tableId2))
                    this.setBtnStatus()
                    //查询结果提示
                    let count = tabledata.length
                    let {inlt} = this.state
                    if(isShowToast){
                        toast({
                            title: '',
                            content: `查询成功，共${count}条。`,
                            color: 'success'
                        })
                    }
                }else{
                    let tableData = {cactivityid:this.selectedActivityRowRecord.pk_org.value, rows:[]}
                    props.cardTable.setTableData(tableId2, tableData)
                    this.setBtnStatus()
                    //查询结果提示
                    if(isShowToast){
                        toast({
                            title: '',
                            content: '当前作业档案没有分配工作中心！',
                            color: 'warning'
                        })
                    }
                }

                if(callback && typeof callback == 'function'){
                    callback()
                }
            }
        })
    }

    // queryWorkCenterByActivity = (props, data, isShowToast = false, callback) => {
    //     ajax({
    //         url: queryWorkCenterByActivity,
    //         data,
    //         success: (res) => {                                
    //             if(res.data){
    //                 let cactivityid = this.selectedActivityRowRecord.pk_org.value                                       
    //                 res.data[tableId2].cactivityid = cactivityid
    //                 console.log(res.data[tableId2])
    //                 props.cardTable.setTableData(tableId2, res.data[tableId2])

    //                 this.setBtnStatus()
    //                 //查询结果提示
    //                 let count = res.data[tableId2].rows.length
    //                 let {inlt} = this.state
    //                 if(isShowToast){
    //                     toast({
    //                         title: '',
    //                         content: `查询成功，共${count}条。`,
    //                         color: 'success'
    //                     })
    //                 }
    //             }else{
    //                 let tableData = {cactivityid:this.selectedActivityRowRecord.pk_org.value, rows:[]}
    //                 this.props.cardTable.setTableData(tableId2, tableData)
    //                 this.setBtnStatus()
    //                 //查询结果提示
    //                 if(isShowToast){
    //                     toast({
    //                         title: '',
    //                         content: '当前作业档案没有分配工作中心！',
    //                         color: 'warning'
    //                     })
    //                 }
    //             }

    //             if(callback && typeof callback == 'function'){
    //                 callback()
    //             }
    //         }
    //     })
    // }


    onWkSelected = (props, moduleId, record, index, status) =>{
        this.selectedWkRowRecords = props.cardTable.getCheckedRows(tableId2)
    }

    render() {
        let {cardTable, button, search, base, modal} = this.props
        let buttons = this.props.button.getButtons()
        buttons = buttons.sort((a, b)=>{
            return b.btnorder - a.btnorder
        })

        let {createCardTable} = cardTable
        let {createModal} = modal
        let {createButtonApp, getButtons} = button

        return (
            <div className="nc-bill-list">
                <div className='nc-bill-header-area'>
                    <div className='header-title-search-area'>
                        {createPageIcon()}
                        <h2 className='title-search-detail'>{'作业分配'}</h2>
                    </div>
                    <div className='search-box' style={{position:'relative'}}>
                        {FactoryGridRef({
                            onChange: this.onUnitChange.bind(this),
                            foolValue:this.state.pk_org,
                            value:[this.state.pk_org],
                            isDataPowerEnable: false,
                            queryCondition: {GridRefActionExt: 'nccloud.web.mmbd.refer.pub.AppPermissionOrgRefFilter'}
                        })}
                    </div>
                    <div className='header-button-area'>
                        {createButtonApp({
                            area: 'header',
                            buttonLimit: 3,
                            onButtonClick: this.buttonClick.bind(this),
                            popContainer: document.querySelector('.header-button-area')
                        })}
                    </div>
                </div>
                <div className="nc-bill-table-area">
                    {createCardTable(tableId1, {
                        dataSource: dataSource,
                        pkname: cactivityid,
                        tableModelConfirm: this.tableModelConfirm,
                        showIndex: false,
                        showCheck: false,
                        onRowClick: this.onActivityClick.bind(this),
                        height: 300
                    })}
                </div>
                <div className="nc-bill-table-area">
                    {createCardTable(tableId2, {
                        dataSource: dataSource,
                        pkname: cassignid,
                        tableModelConfirm: this.tableModelConfirm,
                        showIndex: false,
                        showCheck: true,
                        onSelected: this.onWkSelected.bind(this),
                        onSelectedAll: this.onWkSelected.bind(this),
                        height: 300
                    })}
                </div>
                <AssignModal ref={(assignModal)=>(this.assignModal = assignModal)} {...this.props} />
            </div>)
    }
}

List = createPage({
    initTemplate: [],
    mutiLangCode: '10140AASSIGN'
})(List)

export default List
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65