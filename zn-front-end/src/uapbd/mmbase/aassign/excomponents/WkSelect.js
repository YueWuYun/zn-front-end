//V/v6BHiHAZGAOmV4PPkTPRdEXPk31/nIGzKlAeGbSQhIpKrbDkxh7PDpxIzUCZqb
import React, {Component} from 'react'
import {base, ajax} from 'nc-lightapp-front'
import classnames from 'classnames'
let {NCTable, NCCheckbox, NCButton} = base

const tableId = 'actlist'
const queryaassignvobyactivity = '/nccloud/mmbd/aassign/queryaassignvobyactivity.do'    //根据作业档案pk查询已选、可选工作中心

import '../../../../uapbd/public/uapbdstyle/uapbd_style_common'
import './WkSelect.less'

class WkSelect extends Component {
    constructor(props){
        super(props)

        this.state = {
            allData: [],
            selectedData: [],
            checkedAll: false,
            checkboxStatus: [],
            currentorg: props.getUrlParam('currentorg'),
            cactivityid: props.cardTable.getClickRowIndex(tableId) ?  props.cardTable.getClickRowIndex(tableId).record.values['cactivityid'].value : null
        }

        console.log(this.state)
    }

    getAllTableColumns = () =>{
        let defaultColumns = [{
            title: (<NCCheckbox className='table-checkbox' checked={this.state.checkedAll} onChange={this.onAllCheckChange.bind(this)} />),
            key: 'checkbox',
            dataIndex: 'checkbox',
            width:'10%',
            render: (text, record, index)=>{
                return(
                    <NCCheckbox className='table-checkbox' checked={this.state.checkboxStatus[index]} onChange={this.onCheckboxChange.bind(this,text,record,index)} />
                )
            }
        }]

        let cols = [{
            title: '工作中心编码',
            dataIndex: 'code',
            width: '30%'
        },{
            title: '工作中心名称',
            dataIndex: 'name',
            width: '30%'
        }]

        cols = defaultColumns.concat(cols)
        return cols
    }

    getSelectedTableColumns = () => {
        let cols = [{
            title: '工作中心编码',
            dataIndex: 'code',
            width: '30%'
        },{
            title: '工作中心名称',
            dataIndex: 'name',
            width: '30%'
        },{
            title: '操作',
            dataIndex: 'cancel',
            width: '20%',
            render: function(text, record, index) {
                let delFn = () =>{
                    let datas = this.state.selectedData
                    this.state.selectedData = datas.filter((data)=> data.cwkid != record.cwkid)
                    for(let i = 0; i < this.state.allData.length; i++){
                        if(this.state.allData[i].cwkid == record.cwkid){
                            this.state.checkboxStatus[i] = false
                        }
                    }
        
                    this.setState(this.state)
                }
            return (<NCButton onClick={delFn.bind(this)}>{'取消选择'}</NCButton>)
            }.bind(this)
        }]

        return cols
    }

    onAllCheckChange = () => {
        this.state.checkedAll = !this.state.checkedAll
        this.state.selectedData = this.state.checkedAll == true ? this.state.allData : []
        this.state.checkboxStatus = this.state.checkboxStatus.map((item)=>{
            return this.state.checkedAll
        })

        this.setState(this.state)
    }

    onCheckboxChange = (text, record, index) => {
        if(this.state.checkboxStatus[index] == true){
            this.state.checkboxStatus[index] = false
            this.state.selectedData = this.state.selectedData.filter((data)=>data.cwkid != record.cwkid)
        }else{
            this.state.checkboxStatus[index] = true
            this.state.selectedData.push(record)
        }

        let checkall = true
        this.state.checkboxStatus.map((item)=>{
            if(item == false){
                checkall = false
            }
        })
        this.state.checkedAll = checkall

        this.setState(this.state)
    }

    

    componentDidMount() {
        if(this.state.currentorg == null){
            return
        }
        this.reset()
    }

    reset = () => {
        console.log(this.state)
        let data = {
            pk_org: this.state.currentorg,
            cactivityid: this.state.cactivityid
        }

        ajax({
            url: queryaassignvobyactivity,
            data,
            success: (res)=>{
                if(res.data){
                    this.state.allData = []
                    this.state.selectedData = []
                    this.state.checkboxStatus = []
                    res.data.map((line)=>{
                        let json = JSON.parse(line)
                        this.state.allData.push(json)
                        if(json.assigned == true || json.assigned =='true'){
                            this.state.selectedData.push(json)
                            this.state.checkboxStatus.push(true)
                        }else{
                            this.state.checkboxStatus.push(false)
                        }
                    })
                    this.setState(this.state)

                }
            }
        })

    }

    render = () => {
        let lefttable = {
            main:this,
            rowKey:'id',
            bodyStyle:{height:'330px'},
            columns:this.getAllTableColumns()
        }
        let righttable = {
            main: this,
            rowKey: 'id',
            bodyStyle:{height:'330px'},
            columns:this.getSelectedTableColumns()
        }

        let leftdata = this.state.allData
        let rightdata = this.state.selectedData
        
        return(
            <div className = 'transfer_tree_container' style={{marginTop: '5px'}}>
                <div className='left-area' style={{height:'400px',padding:'10px',backgroud:'rgb(249,249,249)',width:'calc(50%-10px)'}}>
                    <div style={{marginBottom: '10px'}}>{'可选工作中心'}</div>
                    <NCTable {...lefttable} data={leftdata} {...{scroll:{y:'390px'}}}></NCTable>
                </div>
                <div className='right-area' style={{marginLeft:15,height:'400px',padding:'10px',backgroud:'rgb(249,249,249)',width:'calc(50%-10px)'}}>
                    <div  style={{marginBottom: '10px'}}>{'已选工作中心'}</div>
                    <NCTable {...righttable} data={rightdata} {...{scroll:{y:'390px'}}}></NCTable>
                </div>
            </div>
        )
    }
}

export default WkSelect
//V/v6BHiHAZGAOmV4PPkTPRdEXPk31/nIGzKlAeGbSQhIpKrbDkxh7PDpxIzUCZqb