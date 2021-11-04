//kKbZ8gEoqrUn5TTCf2VIKmhOF1cNmpN609n0IVMWH0AVo9g2/AJapHes5ffyU5Dh
/**
 * 查看组织档案
 * @author  yinshb
 */
import React, { Component } from 'react';
import {ajax, high,print,toast } from 'nc-lightapp-front';

import './MarOrg.less';
const {PrintOutput} = high;
const urls = {
    "queryMaterialListForMarOrg" : "/nccloud/uapbd/material/queryMaterialListForMarOrg.do",
    "queryMarorgList" : "/nccloud/uapbd/material/queryMarorgList.do",
    "print" : "/nccloud/uapbd/material/printMaterial.do"
}

import '../../../public/uapbdstyle/uapbd_style_common.less'

class MarOrg extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            oids:[],
            searchVal:{}
        }
        this.updateButtonDisabledStatus(true);
    }

    onRowClick = (props,moduleId,record,index) => {
        //清空表数据
        this.props.editTable.setTableData('marorg',{rows:[],areacode:'marorg'});
        let pk = record.pk_material.value;
        ajax({
            url : urls['queryMarorgList'],
            data : {
                pk : pk,
                pagecode : '10140MORG_marorg'
            },
            success : (res) => {
                let {success,data} = res;
                if(data.marorg){
                    props.editTable.setTableData('marorg',data.marorg);
                }
            }
        });
    }


    clickSearchBtn = (props,data) => {
        let searchVal = this.props.search.getQueryInfo('materialqry');
        if(!searchVal || !searchVal.querycondition) return;
        this.setState({searchVal:searchVal});
        let pageInfo =this.props.table.getTablePageInfo('marorg_material');
        searchVal.pageCode = '10140MORG_marorg_m';
        searchVal.pageInfo = pageInfo;
        ajax({
            url: urls['queryMaterialListForMarOrg'],
            data:searchVal,
            success : (res)=>{
                let {sucess,data} = res;
                if(data&&data['marorg_material']){
                    this.props.table.setAllTableData('marorg_material',data['marorg_material']);
                    this.setState({
                        oids:data['marorg_material'].allpks
                    });
                    let sum = data['marorg_material'].rows ?data['marorg_material'].rows.length : 0;
                    if(sum === 0){
                        toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000062')/* 国际化处理： 未查询到符合条件的数据！*/,color:'warning',title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000063')/* 国际化处理： 请注意！*/});
                        this.updateButtonDisabledStatus(true);
                    }else{
                        this.updateButtonDisabledStatus(false);
                        toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000064',{sum:sum})/* 国际化处理： 查询成功，共{sum}条数据!*/,color:'success',title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000066')/* 国际化处理： 已成功！*/});
                    }
                }else{
                    this.updateButtonDisabledStatus(true);
                    toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000062')/* 国际化处理： 未查询到符合条件的数据！*/,color:'warning',title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000063')/* 国际化处理： 请注意！*/});
                    this.props.table.setAllTableData('marorg_material',{
                        allpks:[],
                        areacode : 'marorg_material',
                        rows:[],
                        pageInfo : {
                            pageIndex : 0,
                            pageSize : 10
                        }
                    });
                    this.setState({
                        oids:[]
                    });
                }
            }
        });
    }

    handlePageInfoChange = () =>{
        this.refresh();
    }

    refresh = () => {
        let searchVal = this.state.searchVal;
        if(!searchVal || !searchVal.querycondition) return;
        let pageInfo =this.props.table.getTablePageInfo('marorg_material');
        searchVal.pageCode = '10140MORG_marorg_m';
        searchVal.pageInfo = pageInfo;
        ajax({
            url: urls['queryMaterialListForMarOrg'],
            data:searchVal,
            success : (res)=>{
                let {sucess,data} = res;
                if(data&&data['marorg_material']){
                    this.props.table.setAllTableData('marorg_material',data['marorg_material']);
                    this.setState({
                        oids:data['marorg_material'].allpks
                    });
                    let sum = data['marorg_material'].rows ?data['marorg_material'].rows.length : 0;
                    if(sum === 0){
                        toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000062')/* 国际化处理： 未查询到符合条件的数据！*/,color:'warning',title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000063')/* 国际化处理： 请注意！*/});
                        this.updateButtonDisabledStatus(true);
                    }else{
                        this.updateButtonDisabledStatus(false);
                        toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000064',{sum:sum})/* 国际化处理： 查询成功，共{sum}条数据!*/,color:'success',title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000066')/* 国际化处理： 已成功！*/});
                    }
                }else{
                    this.updateButtonDisabledStatus(true);
                    toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000062')/* 国际化处理： 未查询到符合条件的数据！*/,color:'warning',title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000063')/* 国际化处理： 请注意！*/});
                    this.props.table.setAllTableData('marorg_material',{
                        allpks:[],
                        areacode : 'marorg_material',
                        rows:[],
                        pageInfo : {
                            pageIndex : 0,
                            pageSize : 10
                        }
                    });
                    this.setState({
                        oids:[]
                    });
                }
            }
        });
    }

    updateButtonDisabledStatus = (flag) => {
        this.props.button.setDisabled({
            marorg_print : flag,
            marorg_output:flag
        });
    }

    onButtonClick = (props,id) => {
        switch(id){
            case 'marorg_print':
                if(this.state.oids.length === 0){
                    return;
                }
                print('pdf',
                urls['print'],
                {
                    funcode : '10140MAG',
                    appcode : '10140MAG',
                    nodekey : 'materialbaselist_ncc',
                    oids : this.state.oids
                });
                break;
            case 'marorg_output':
                if(this.state.oids.length === 0){
                    return;
                }
                this.refs.printOutput.open();
                break;
            case 'marorg_refresh':
                this.refresh();
                break;
        }
    }
    render() {
        let {editTable,search} = this.props;
        let { createEditTable } = editTable;
        let {NCCreateSearch} = search;
        return (
            <div  style={{maxHeight:'500px'}}>
                <div className="marorg">
                <div className="header-button-area marOrg-NCCreateSearch">
                    <div style={{height: 30}}>
                        <div className="uapbd_style_center_container">
                            <div className="uapbd_style_center_right20" style={{right: 0}}>
                                <div style={{display:'flex'}} className='marOrg_button_self'>
                                    
                                    {this.props.button.createButtonApp({
                                        area: 'marorg',
                                        buttonLimit: 3,
                                        onButtonClick: this.onButtonClick,
                                        popContainer: document.querySelector('.header-button-area')

                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                        
                </div>
                <div>
                    {NCCreateSearch(
                        'materialqry',//模块id
                        {
                            clickSearchBtn: this.clickSearchBtn.bind(this),//   点击按钮事件
                            //onlyShowSuperBtn:true,
                            //replaceSuperBtn:'查询',
                            showAdvBtn: true,                           //  显示高级按钮
                            oid:'1009Z01000000005855D'        //查询模板的oid，用于查询查询方案
                        }
                    )}
                </div>
                            <div className="table-top">
                                {this.props.table.createSimpleTable('marorg_material', {//列表区
                                    useFixedHeader:true,    
                                    showIndex:true,
                                    showCheck:false,
                                    onRowClick:this.onRowClick,
                                    handlePageInfoChange:this.handlePageInfoChange
                                })}
                            </div>
                            <div className="table-bottom">
                                {createEditTable('marorg', {//列表区
                                    useFixedHeader:true,    
                                    showIndex:true,
                                    showCheck:false
                                })}
                            </div>
                </div>
                <PrintOutput
                    ref='printOutput'
                    url={urls['print']}
                    data={{
                        funcode : '10140MAG',
                        appcode : '10140MAG',
						nodekey : 'materialbaselist_ncc',
						oids : this.state.oids,
						outputType : 'output'
					}}
                />
            </div>
        );
    }
}

export default MarOrg;


//kKbZ8gEoqrUn5TTCf2VIKmhOF1cNmpN609n0IVMWH0AVo9g2/AJapHes5ffyU5Dh