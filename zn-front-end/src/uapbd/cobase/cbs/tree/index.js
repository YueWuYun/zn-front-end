//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from "react";
import { createPage, base, high, createPageIcon } from "nc-lightapp-front";
const { Refer } = high;
import {
    activateButton,
    clickDelIconEve,
    clickEditIconEve,
    onSelectEve,
    clickAddIconEve,
    onMouseEnterEve,
    initTemplate,
    queryModalCBSOrg,
    commonParams,
    queryAndTransformToTree,
    rootNodeHandle,
    changeButtonByScene,
    setDefaultVal,
    showToast
} from "./events"
import { constant, attrcodeObj, toastConfig } from "./const";
import AssignTransfer from "./AssignTransfer";
import ImportTransfer from "./ImportTransfer";

let {
    pkOrg,
    pkProject,
    pkProjecttype
} = attrcodeObj
let {
    treeId,
    formId,
    pageName,
    pageCode,
    modalId,
    btnArea,
    appCode
} = constant;
class CBSTree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            importModal: false,
            assignModal: false,
            tableArr : [],
            treeModalData : [],
            type :'',
            pkOrgValueRef:'',
            pkProjectValueRef:'',
            pkProjectTypeValueRef:'',
        }
        pageCode = props.getSearchParam('p');
        pageName = pageCode === "10140CBSG-group" ? "CBS-集团" : (pageCode === "10140CBSC-org" ? "CBS-财务组织" : "项目CBS");

        initTemplate.call(this, props);

        this.activateButton = activateButton.bind(this);
        this.onMouseEnterEve = onMouseEnterEve.bind(this);
        this.clickAddIconEve = clickAddIconEve.bind(this);
        this.onSelectEve = onSelectEve.bind(this);
        this.clickEditIconEve = clickEditIconEve.bind(this);
        this.clickDelIconEve = clickDelIconEve.bind(this);
    }

    setProps = (type, tableArr ,callback) => {
        if(tableArr && tableArr.length === 0){
            showToast(toastConfig, 'financeOrgWaring');
            return false;
        }
        let {
            pkOrgValueRef
        } = this.state;
        let returnFlag = callback&&callback();
        if(callback && !returnFlag){
            return ;
        }

        if (type === 'next') {
            this.setState({
                importModal: true,
                tableArr : tableArr,
            })
        } else if(type === 'cancel'){
            this.setState({
                assignModal: false,
                tableArr : [{'key': pkOrgValueRef.refpk}],
                treeModalData :[],
                type : ''
            })
        }else if(type === 'importCacel'){
            this.setState({
                importModal: false,
                tableArr : [{'key': pkOrgValueRef.refpk}],
                type : ''
            })
        }else if(type === 'import'){
            this.setState({
                importModal: false,
                tableArr : [{'key': pkOrgValueRef.refpk}],
                treeModalData :[],
                type : '',
                assignModal: false,
            })
        }
     
    }
    getMustInputValue =()=>{
        setDefaultVal.call(this)
        let {
            haveValueFlag,
            params
        } = commonParams.call(this);
        if(haveValueFlag){
            let disabledButtons = changeButtonByScene.call(this, [],  ['ImportCBS'], true)
            this.props.button.setButtonDisabled(disabledButtons);
            queryAndTransformToTree.call(this, this.props, params, false, () => { rootNodeHandle.call(this, "root") });
        }
    }

    render() {
        const { ncmodal, button, DragWidthCom, syncTree, form } = this.props;
        const { createModal } = ncmodal;
        const { createButtonApp } = button;
        const { createForm } = form;
        const { createSyncTree } = syncTree;
        const leftDom = (
            <div className="tree-area">
                {createSyncTree({
                    treeId: treeId,
                    onMouseEnterEve: this.onMouseEnterEve,
                    showModal: false,
                    clickAddIconEve: this.clickAddIconEve,
                    onSelectEve: this.onSelectEve,
                    clickEditIconEve: this.clickEditIconEve,
                    clickDelIconEve: this.clickDelIconEve,
                })}
            </div>
        );

        const rightDom = (
            <div className="card-area">
                {createForm(formId, {
                    cancelPSwitch: true,
                    datasource: constant.datasource,
                })}
            </div>
        );
        let {
            pkOrgValueRef,
            pkProjectValueRef,
            pkProjectTypeValueRef
        } = this.state;
        return (
            <div className="nc-single-table">
                <div className="nc-singleTable-header-area">
                    <div className="header-title-search-area">
                        {createPageIcon()}
						<h2 className="title-search-detail">{pageName}</h2>
					</div>
                   {
                       pageCode !== "10140CBSG-group"? 
                       <div className={'refer'}>    
                            <span className={"mustFillIn_search"}>*</span>      
                                <Refer
                                    value={pkOrgValueRef}
                                    onChange={(value) => {
                                        this.setState({
                                            pkOrgValueRef: value,
                                            tableArr : [{'key': value.refpk}]
                                        }, ()=>{
                                            this.getMustInputValue.call(this)
                                        })
                                    }}
                                    refName = "财务组织"
                                    placeholder="财务组织"
                                    refType="tree"
                                    rootNode= {{ refname: '财务组织', refpk: 'root'} } /* 国际化处理：销售组织*/
                                    queryTreeUrl={'/nccloud/uapbd/org/FinanceOrgAllDataTreeRef.do'}
                              
                                />
                            </div>
                            :null
                   }
                    {
                        pageCode === "10140CBSPRO-pro"?
                        <div className={'refer'}>    
                            <span className={"mustFillIn_search"}>*</span>      
                            <Refer
                                value={pkProjectValueRef}
                                onChange={(value) => {
                                    this.setState({
                                            pkProjectValueRef: value
                                    }, ()=>{
                                        this.getMustInputValue.call(this)
                                    })
                                }}
                                refName = "项目"
                                placeholder="项目"
                                refType="gridTree"
                                rootNode= { {refname: '项目基本分类', refpk: 'root'} } /* 国际化处理：销售组织*/
                                queryCondition = {
                                    () => {                             
                                        return {                                
                                            pk_org : pkOrgValueRef.refpk,                            
                                        };                         
                                    }
                                }
                                queryTreeUrl={'/nccloud/uapbd/ref/ProjectDefaultTreeRef.do'}
                                queryGridUrl={'/nccloud/uapbd/ref/ProjectDefaultGridRef.do'}
                            />
                        </div>
                        :null
                    }
                    {
                        pageCode !== "10140CBSPRO-pro"?
                        <div className={'refer'}>    
                            <span className={"mustFillIn_search"}>*</span>      
                            <Refer
                                value={pkProjectTypeValueRef}
                                onChange={(value) => {
                                    this.setState({
                                            pkProjectTypeValueRef: value
                                    }, ()=>{
                                        this.getMustInputValue.call(this)
                                    })
                                }}
                                rootNode= { {refname: '项目基本分类', refpk: 'root'} } /* 国际化处理：销售组织*/
                                refName = "项目基本分类"
                                placeholder="项目基本分类"
                                refType="tree"
                                queryTreeUrl={'/nccloud/uapbd/pm/EpsTreeRef.do'}
                            />
                        </div> 
                        :null
                    }
                    <div className="header-button-area">
                        {createButtonApp({
                            area: btnArea,
                            onButtonClick: this.activateButton
                        })}
                    </div>
                </div>

                <div className="tree-card">
                    <DragWidthCom
                        leftDom={leftDom}
                        rightDom={rightDom}
                        leftMinWid={"350px"}
                    />
                </div>
                <AssignTransfer showModalT={this.state.assignModal} setProps={this.setProps} /> 
                <ImportTransfer showModalT={this.state.importModal} that = {this} type = {this.state.type} pkProjectValueRef = {pkProjectValueRef.refpk} setProps={this.setProps} tableArr = {this.state.tableArr}  queryTree={ queryModalCBSOrg.bind(this)} />
                {createModal(modalId, {})}
            </div>
        );
    }
}
CBSTree = createPage({
    initTemplate: ''
})(CBSTree);
ReactDOM.render(<CBSTree />, document.querySelector("#app"));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65