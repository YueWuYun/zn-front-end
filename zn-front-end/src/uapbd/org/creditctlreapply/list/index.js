//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// import {createPage, getMultiLang, base, cardCache, toast, ajax, promptBox, high} from 'nc-lightapp-front';

// const {ApproveDetail, PrintOutput, ApprovalTrans} = high;

import { createPage, ajax, base, toast, cardCache, print, high, promptBox, createPageIcon } from 'nc-lightapp-front';

const { PrintOutput, ApproveDetail, ApprovalTrans } = high;
const pageId = '10100CRESP_list'; //pagecode
const searchId = 'searcharea'; //查询区id
const tableId = 'creditpf';  //表头id
const linkItem = 'billno'; //列表卡片跳转字段 
const {NCDiv} = base;
const dataSource = 'uapbd.org.creditctlreapply.data';  //缓存区id
const queryListUrl = '/nccloud/uapbd/creditctlreapply/credApplyListQuery.do';  
const validUrl = '/nccloud/uapbd/creditctlreapply/credApplyValid.do'//权限校验 
const deleteUrl = '/nccloud/uapbd/creditctlreapply/deleteCreditctlreApply.do'	//删除
const queryPageUrl = '/nccloud/uapbd/creditctlreapply/pageInfoClick.do' //分页点击事件
const printUrl = '/nccloud/uapbd/creditctlreapply/credApplyPrint.do';     //打印url
const commitUrl = '/nccloud/uapbd/creditctlreapply/credApplyCommit.do' //提交
const callbackUrl = '/nccloud/uapbd/creditctlreapply/credApplyCallback.do' //收回
const  pk_item = 'pk_ccregion_pf'; //列表主键
const PrintFunCode = '10100CRESP'; //有打印模板的小应用编码
const printNodeKey = 'credpflist'; //模板节点标识 
const {setDefData, getDefData} = cardCache;

class List extends Component{
    constructor(props){
        super(props);
        this.searchId = searchId;
        this.tableId = tableId;
        this.state = {
            json:{},
            approveDetailShow: false,
            billid:'',
            compositedata:null,
            compositedisplay:false,



        };
    }

    initTemplate(props){
        //createUIDom方法用于页面初始化时查询模板、按钮和context信息
        props.createUIDom(
            {
                pagecode:pageId //页面id
            },
            (data)=>{
                if(data){
                    if(data.template){
                        // props.meta.setMeta(data.template)
                        let meta = data.template;
                        meta = this.modifierMeta(props,meta)
                        props.meta.setMeta(meta, () => {
                            if (data.context) {
                                if (data.context.pk_org && data.context.org_Name) {
                                    props.search.setSearchValByField(searchId, "pk_org", { value: data.context.pk_org ? data.context.pk_org : null, display: data.context.org_Name ? data.context.org_Name : null });
                                }
                            }
                        });
                        let hasSearched = getDefData("hasSearched", dataSource);
                        let searchVal = getDefData("searchParams",dataSource);
                        console.log(this.state.json['10100CRESP-000006']) /* 国际化处理： 缓存查询条件*/
                        console.log(searchVal);
                        if (hasSearched && hasSearched === 1) {//hasSearched 为1表示有过查询，从缓存获取查询模板条件
                            // searchVal.map((v)=>{
                            // 	props.search.setSearchValByField('searchArea',v.field,v.display);
                            // 	return v;
                            // })
                            if (searchVal && searchVal != false) {
                                props.search.setSearchValue(searchId, searchVal.querycondition.conditions);
                            }

                            //获取查询模板信息
                            let queryInfo = props.search.getQueryInfo(searchId);
                            let OID = queryInfo.oid;

                            let data = {
                                querycondition: { conditions: searchVal == null ? null : searchVal.querycondition.conditions },
                                // ...searchVal,
                                //  获取simpleTable表格的page信息
                                pageInfo: getDefData('pageInfo', dataSource) ? getDefData('pageInfo', dataSource) : props.table.getTablePageInfo(tableId),
                                // {
                                // 	pageIndex: 0,
                                // 	pageSize: 10,
                                // 	total: 0,
                                // 	totalPage: 0
                                // },
                                pagecode: pageId,
                                queryAreaCode: searchId,  //查询区编码
                                oid: OID,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
                                querytype: 'tree'
                            };

                            ajax({
                                url: queryListUrl,
                                data,
                                success: (res) => {
                                    if (res.data) {
                                        props.table.setAllTableData(tableId, res.data[tableId]);
                                    } else {
                                        toast({ content: this.state.json['10100CRESP-000007'], color: "warning" });/* 国际化处理： 无数据*/
                                    }
                                },
                                error: (res) => {
                                    console.log(res.message);
                                }
                            });
                        }

                    }
                    if(data.button){
                        // props.button.setButtons(data.button)
                        let button = data.button;
                        props.button.setButtons(button);
                        //setButtonVisible|设置按钮的显隐性
                        props.button.setButtonVisible(['Commit','Print'],false);//下拉不在重复出现提交打印按钮
                        props.button.setButtonDisabled(['delete','CommitGrp','Callback','PrintGrp','Output'],true);
                        props.button.setPopContent('deline',this.state.json['10100CRESP-000008']) /**设置操作列上删除按钮的弹窗提示 */

                    }
                    //data.context
                }
            }
        )

    }

    componentDidMount(){
        let callback = (json) => {
			this.setState({ json }, () => {
				this.initTemplate(this.props)
			})
		}
        this.props.MultiInit.getMultiLang({moduleId: '10100CRESP', domainName: 'uapbd', callback})
        
    }

    modifierMeta = (props,meta) =>{

        	//修正，收款申请单申请类型字段去掉停用和启用选项
		let applyTypeItem = meta[searchId].items.find(item => item.attrcode == 'apply_type')
		let originOptions = applyTypeItem.options
		let newOptions = [originOptions[0], originOptions[1], originOptions[2]]
		applyTypeItem.options = newOptions

        meta[searchId].items = meta[searchId].items.map((item,key)=>{
            if(item.attrcode == 'pk_org'){
                //isShowDisabledData| 是否显示停用数据 | boolean |true
                item.isShowDisabledData = true
                //pk_org_creditctl 信用控制域所属组织
            }else if(item.attrcode == 'pk_org_creditctl'){
                //isMultiSelectedEnabled  是否多选
                item.isMultiSelectedEnabled = true
				item.isShowDisabledData = true
            }
            item.col = '2';
            return item;
        })
        //pagination 来描述分页信息  
        meta[tableId].pagination = true;
        meta[tableId].items = meta[tableId].items.map((item,key)=>{
            if(item.attrcode == linkItem){
                item.render = (text,record,index)=>{
                    return(
                        <span
                            style={{ color: '#007ace', cursor: 'pointer' }}
                            onClick={() => {
                                let searchVal = props.search.getQueryInfo(searchId);
                                setDefData('searchParams', dataSource, searchVal);
                                setDefData('preid', dataSource, record[pk_item].value);
                                setDefData('pageInfo', dataSource, props.table.getTablePageInfo(tableId));
                                props.pushTo('/card', {
                                    status: 'browse',
                                    id: record[pk_item].value,//列表卡片传参
                                    //必须先转为字符串
									errParam: JSON.stringify(record)
                                });
                            }}
                        >
                            {record && record[linkItem] && record[linkItem].value}
                        </span>
                    )
                }
            }
            return item;
        })
        //添加操作列
        meta[tableId].items.push({
            itemtype:'customer',
            attrcode:'opr',
            label:this.state.json['10100CRESP-000023'], /**国际化处理：操作 */
            width:200,
            fixed:'right',
            className:'table-opr',
            visible:true,
            render:(text,record,index) => {
                //自由态单据修改删除，非自由态为审批详情
                let tableBtnAry = record.approvestatus.value == '-1'?['editline','delline']:['approveinfo']
                return props.button.createOprationButton(
                    tableBtnAry,
                    {
                        area:"table-opr-area",
                        buttonLimit:3,
                        onButtonClick:(props,id)=>this.tableButtonClick(props,id,text,record,index)
                    }
                )
            }
        })
        return meta;
    }

    tableButtonClick=(props,id,text,record,index)=>{
           switch(id){
               case 'editline':
                   this.valid(props,record,'edit',(codeedit,vbillnumedit)=>{
                       props.pushTo('/card',{
                           status:'edit',
                           codeeit:codeedit,
                           vbillnumedit:vbillnumedit,
                           //主键的值
                           id:record[pk_item].value
                       })
                   })
                   break;
                case 'delline':
                    ajax({
                        url:deleteUrl,
                        data:
                        {
                           pk_org:getDefData('pk_org',dataSource),
                           deleteinfo:[
                               {
                                   //0001X0100000000036GK
                                   pk_org:record.pk_org.value,
                                   pk:record[pk_item].value,
                                   ts:record.ts.value
                               }
                           ]
                        },
                        success:(res)=>{
                            if(res.data){
                                toast({color:'success',content:this.state.json['10100CRESP-000024']}) /**国际化处理 删除成功 */
                                props.table.deleteTableRowsByIndex(tableId,index);
                            }
                        }
                    })
                break;
                case 'approveinfo':
                    this.setState({
                        approveDetailShow:true,
                        billid:record[pk_item].value
                    })
                break;
                default:
                    console.log(id,index);
                    break;
           }
    }

//权限校验
//  action：edit   
   valid = (props,record,action,callback) => {
       let pk = record[pk_item].value;
       let data = {
           pk,
           action
       }
       ajax({
          url:validUrl,
          data,
          success:(res)=>{
              ////codeedit  字段信息
              let codeedit = res && res.data ? res.data.codeedit : true
              //Vbillnumedit  editline
              let vbillnumedit = res && res.data ? res.data.vbillnumedit : true
              callback && callback(codeedit,vbillnumedit);

          }
       })
   }

    buttonClick(props,id){
        let allData = props.table.getAllTableData(tableId);
        let checkedData = props.table.getCheckedRows(tableId)
        switch(id){
            case 'add':
            props.pushTo('/card', {
                status: 'add'
            })
            let preid = '';
            if(checkedData && checkedData[0]){
                preid = checkedData[0].data.values[pk_item].value
            }
            else if(allData && allData.rows[0]){
                preid = allData.rows[0].values[pk_item].value
            }
            setDefData('preid',dataSource,preid);
            break;
            case 'delete':
               promptBox({
                   color:"warning",
                   title:this.state.json['10100CRESP-000018'], /**国际化处理：确认删除 */
                   content:this.state.json['10100CRESP-000019'],/*确定要删除所选数据吗?*/
                   beSurBtnClick:this.deleteAction.bind(this)
               })
            break;
            case 'refresh':
                this.refreshAction(props);
                break;
            case 'printGrp':
                this.onPrint();
                break;
            case 'print':
                this.onPrint();
                break;
            case 'Output':
                this.onOutput();
                break;
            case 'CommitGrp':
                this.pfProcess(commitUrl);
                break;
            case 'Commit':
                this.pfProcess(commitUrl);
                break;
            case 'Callback':
                this.pfProcess(callbackUrl);
                break;
            default:
                break;
        }
    }

deleteAction = ()=>{
    let data = this.props.table.getCheckedRows(tableId);
    console.log(data)
    let params = {
        pk_org:getDefData('pk_org',dataSource),
        deleteinfo:data.map((v)=>{
            let pk_org = v.data.values.pk_org.value;
            let id = v.data.values[pk_item].value;
            let ts = v.data.values.ts.value;
            return{
                pk_org, id, ts
            }
        })
    }
    console.log(params)
    ajax({
        url:deleteUrl,
        data:params,
        success:(res)=>{
            toast({color:"success",content:this.state.json['10100CRESP-000020']});/**国际化处理：删除成功 */
            this.refreshAction(this.props,false);
           
        }
    })

}

/**
 * 刷新
 */

 refreshAction=(props, showInfo = true)=>{
     let searchVal = props.search.getAllSearchData(searchId);
     console.log(searchId);
     if(searchVal != false){
         //获取查询模板信息
         //props.search.getQueryInfo(searchId, flag = true)方法直接获取包装好的queryInfo，flag参数表示是否校验数据，默认为true校验
         let queryInfo = props.search.getQueryInfo(searchId);
         let OID = queryInfo.oid;

         let data = {
             ...queryInfo,
             //.getTablePageInfo**(moduleId)| 获取simpleTable表格的page信息
             pageInfo:props.table.getTablePageInfo(tableId),
             pagecode:pageId,
             queryAreaCode:searchId, //查询区编码
             oid:OID, //查询模板id,手工添加在界面模板json
             queryType:'tree'
            };
            ajax({
                url:queryListUrl,
                data,
                success:(res)=>{
                    console.log(res);
                    if(res.data){
                        props.table.setAllTableData(tableId,res.data[tableId]);
                        if(showInfo){
                            toast({color:"success", title:this.state.json['10100CRESP-000021']}) /**国际化处理：刷新成功 */
                        }
                    }else{
                        props.table.setAllTableData(tableId,{rows:[]});
                        if(showInfo){
                            toast({color:"warning",title:this.state.json['10100CRESP-000022']})/**无数据 */
                        }
                    }
                    this.props.button.setButtonDisabled(['delete', 'CommitGrp', 'Callback', 'PrintGrp', 'Output'],true);
                },
                error:(res)=>{
                    console.log(res.message);
                }
            })
     }

 }
 /**
  * 打印
  */
    onPrint=()=>{
        let allData = this.props.table.getAllTableData(tableId);
        if(!allData || allData.length === 0 || allData.rows.length === 0){
            toast({color:'warning',content:this.state.json['10100CRESP-000025']}); /**国际化处理：无可打印数据 */
            return;
        }
        let pks = [];
        allData.rows.forEach((item,key)=>{
            pks.push(item.values[pk_item].value);
        });
        print(
            'pdf',
            printUrl,
            {
                funcode:PrintFunCode,//功能节点编码
                nodeKey:printNodeKey,//模板节点编码
                oids:pks
            }
        )

    }

    /**
     * 输出
     */
    onOutput=()=>{
        let allData = this.props.table.getAllTableData(tableId);
        if(!allData || allData.length === 0 || allData.rows.length === 0){
            toast({clolor:'warning', content:this.state.json['10100CRESP-000026']});/**国际化处理：无可输出的数据 */
        }
        let pks = [];
        allData.rows.forEach((item,key)=>{
            pks.push(item.values[pk_item].value);
        });
        this.setState({
            ids:pks
        },this.refs.printOutput.open());
    }
    
    
    //searchVal: '', // 搜索框的value
    clickSearchBtn = (props,searchVal) => {
        // /*
        // * key：存储数据的key
        // * dataSource: 缓存数据命名空间
        // * data： 存储数据
        // */
       // 1  表示搜索过了
       setDefData("hasSearched", dataSource, 1);
        //getTablePageInfo**(moduleId)| 获取simpleTable表格的page信息 | moduleId 页面对应的区域ID 
        setDefData("pageInfo", dataSource, props.table.getTablePageInfo(tableId));
        //获取查询模板信息
        let queryInfo = props.search.getQueryInfo(searchId);
        let OID = queryInfo.oid;
        //{}
        let finalSearchVal = {...queryInfo}
        finalSearchVal.querycondition.conditions = searchVal.conditions

        setDefData("searchParams",dataSource, queryInfo);

        let data = {
            ...queryInfo,
            //getTablePageInfo**(moduleId)| 获取simpleTable表格的page信息
            pageInfo:props.table.getTablePageInfo(tableId),
            pagecode:pageId,
            queryAreaCode: searchId, //查询区编码
            oid:OID,//查询模板id
            queryType:'tree'
        };
        ajax({
            url:queryListUrl,
            data,
            success:(res)=>{
                console.log(res);
                if(res.data){
                    props.table.setAllTableData(this.tableId,res.data[tableId]);
                    let count = res.data[this.tableId].allpks.length;
                    toast({color:'success',content:this.state.json['10100CRESP-000003'] + count + this.state.json['10100CRESP-000004']}) /* 国际化处理： 已成功！,查询成功，共,条。*/
                    }else{
                        props.table.setAllTableData(this.tableId,{rows:[]});
                        toast({color:"warning",content:this.state.json['10100CRESP-000005']}) /* 国际化处理： 未查询出符合条件的数据。*/
                    }
                },
                error:(res)=>{
                    console.log(res.message)
                }
        })
    }

    /**
     * 提交 、收回  操作
     */
    pfProcess(url,content){
        //自由=-1,审批未通过=0,审批通过=1,审批中=2,已提交=3
        let billstatus = ['-1'];

        if(url == commitUrl){
            billstatus = ['-1'];
        }else if(url == callbackUrl){
            billstatus = ['1','3'];
        }
        let curSels = this.props.table.getCheckedRows(tableId);

        let pks = [];

        curSels.map(row =>{
            //approvestatus 审批状态
            if(billstatus.indexOf(row.data.values.approvestatus.value) >= 0){
                pks.push(row.data.values[pk_item].value);
            }
        })
        if(pks.length == 0){
            toast({ content:this.state.json['10100CRESP-000028'], color:'warning'});/**国际化处理：没有可操作数据 */
            return;
        }
        let finalData = {
            pks,
            content
        }
        ajax({
            url,
            data:finalData,
            success:res =>{
                if(url == commitUrl){
                    if(res.data.workflow && (res.data.workflow == 'approveflow' || res.data.workflow == 'workflow')){
                        this.setState({
                            compositedata:res.data,
                            compositedisplay:true
                        });
                    }else{
                        toast({clolor:'success',content:this.state.json['10100CRESP-000029']}); /**国际化处理：提交成功！ */
                        this.setState({
                            compositedata:null,
                            compositedisplay:false
                        });
                        this.refreshAction(this.props,false);
                    }
                }
                else if(url == callbackUrl){
                    toast({content:this.state.json['10100CRESP-000030'],color:'success'});/**国际化处理：单据已成功收回 */
                    this.refreshAction(this.props,false);
                }
            }
        })
    }
    onSelected=()=>{
        let rows = this.props.table.getCheckedRows(tableId);
        let canCommit = true;
        let canCallBack = true;
        if(rows && rows.length >0 ){
             this.props.button.setButtonDisabled(['delete','PrintGrp','Output'],false);

             rows.forEach((row,key)=>{
                 if(row.data.values.approvestatus.value == -1){ //自由
                    canCommit = false;
                }
                 if(row.data.values.approvestatus.value == 3){ // 提交
                    canCallBack = false;

                 }
             })
             //特殊处理一下审批通过收回操作
             if(rows[0].data.values.approvestatus.value == 1){ //审批通过
                   canCallBack = false;
             }
             this.props.button.setButtonDisabled(['CommitGrp'],canCommit);
             this.props.button.setButtonDisabled(['Callback'],canCallBack);
         }
         else{
             this.props.button.setButtonDisabled(['delete','CommitGrp','Callback','PrintGrp','Output'],true);
         }
         //重新渲染页面
         this.setState(this.state)

    }

    /**
     * 分页器操作
     */
    pageInfoClick = (props, config, pks)=>{
        let pageInfo = props.table.getTablePageInfo(this.tableId);
        let searchVal = props.table.getAllSearchData(searchId);

        setDefData('pageInfo',dataSource,props.table.getTablePageInfo(this.tableId));

        let data = {
            'pk_org':getDefData('pk_org',dataSource),
            'allpks':pks,
            'pageid':pageId
        }
        //得到页面数据渲染到页面
        let that = this;
        ajax({
            url:queryPageUrl,
            data:data,
            success:function(res){
                let {success,data} = res;
                if(success){
                    if(data){
                        props.table.setAllTableData(tableId,data[tableId]);
                    }else{
                        props.table.setAllTableData(tableId,{rows:[]});
                    }
                }
            }
        })
    }

    /**
     * onRowDoubleClick
     */
    doubleClick=(record, index, e)=>{
        // let searchVal = this.props.table.getAllSearchData(searchId);
        let searchVal = this.props.search.getAllSearchData(searchId);
        setDefData('searcParams',dataSource,searchVal);
        setDefData('preid',dataSource,record[pk_item].value);
        this.props.pushTo('/card',{
            status:'browse',
            id:record[pk_item].value
        })
    }
    /**
      * 审批详情 
    */
    closeApprove =()=>{
        this.setState({
            approveDetailShow:false
        })
    }

    render(){
           const{createBillHeadInfo} = this.props.BillHeadInfo;
           let { button, search, table}  = this.props;
           let  {createButtonApp} = button;
           let  { NCCreateSearch } = search;
           let  { createSimpleTable } = table;
        return(<div className="nc-bill-list">
            {/* //NCDiv组件，通过传入指定的areaCode来统一给区域加标记 */}
            <NCDiv areaCode={NCDiv.config.HEADER} className='nc-bill-header-area'>
            <div className='header-title-search-area'>
                {createBillHeadInfo({
                    title:this.state.json ? this.state.json['10100CRESP-000000'] : '10100CRESP-000000' ,//信用控制域
                    initShowBackBtn:false
                })}
            </div>
            <div className="header-button-area">
                {createButtonApp({
                      area: 'header-button-area',
                      buttonLimit:5,
                      onButtonClick:this.buttonClick.bind(this),
                    popContainer: document.querySelector('.header-button-area')
                })}
            </div>
            </NCDiv>
            <div className="nc-bill-search-area">
                {NCCreateSearch(this.searchId,{
                    clickSearchBtn:this.clickSearchBtn.bind(this)
                })}
            </div>
            <div className="nc-bill-table-area">
                {createSimpleTable(tableId,{
                    //handlePageInfoChange   分页器操作的回调函数  props，config，pks
                   handlePageInfoChange:this.pageInfoClick.bind(this),  //分页器操作的回调函数
                   showIndex:true,    //showIndex  控制序号展示和隐藏  true或false
                   showCheck:true,    //showCheck 控制多选框展示和隐藏  true或false
                  onRowDoubleClick: this.doubleClick.bind(this),
                  dataSource:dataSource,
                  onSelected: this.onSelected.bind(this),
                  onSelectedAll: this.onSelected.bind(this)

                })}
            </div>
            <PrintOutput
                ref='printOutput'
                url={printUrl}
                data={{
                    funcode:PrintFunCode,//功能节点编码
                    nodeKey:printNodeKey,//模板节点编码
                    oids:this.state.ids,// // 功能节点的数据主键 
                    outputType:'output'
                }}
            />
            {this.state.compositedisplay ?<ApprovalTrans
                 title={this.state.json['10100CRESP-000027']} /**国际化处理：指派 */
                 data={this.state.compositedata}
                 display={this.state.compositedisplay}
                 getResult={this.getAssginUsedr.bind(this)}
                 cancel={this.turnoff.bind(this)}

            />:""}
            <ApproveDetail
                show={this.state.approveDetailShow}
                close={this.closeApprove.bind(this)}
                ////billtype**| 单据类型
                billtype='10KH'
                billid={this.state.billid}
            />
        </div>

        )
    }
         
}

List = createPage({
     initTemplate:[],
     mutiLangCode: '10100CRESP'
})(List);
//ReactDOM.render(<List />, document.querySelector('#app'));
 export default List 
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65