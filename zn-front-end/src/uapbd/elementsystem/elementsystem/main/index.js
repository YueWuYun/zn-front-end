//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import { createPage, base, ajax, toast, createButtonApp, cardTable, print, high, promptBox, createPageIcon } from 'nc-lightapp-front';
import loadPlatData from "../util/loadPlatData";
const {NCDiv} = base;

const urls = {
    elesysLoadTree: "/nccloud/uapbd/elementsystem/elesysLoadTree.do",
    elesysQueryCard: "/nccloud/uapbd/elementsystem/elesysQueryCard.do",
    elesysAdd: "/nccloud/uapbd/elementsystem/elesysAdd.do",
    elesysSave: "/nccloud/uapbd/elementsystem/elesysSave.do",
    elesysDel: "/nccloud/uapbd/elementsystem/elesysDel.do",
}

let EMPTY_FN = function(){};

class ElementSystem extends Component {

    constructor(props){
        super(props);
        loadPlatData({
            props: props,
            pagecode: '10140ES_elementsys',
            moduleId: '10140ES',
            domainName: 'uapbd',
            callback: (meta) => {
                let {context, template, lang, button} = meta;
                this.lang = lang;
                this.initState(meta);
                this.setState(this.state, ()=>{
                    props.button.setButtons(button, ()=>{
                        this.buttonStatus();
                        props.meta.setMeta(template, ()=>{
                            this.loadTreeData();
                        });
                    })
                })
            }
        });
    }

    initState = (meta)=>{
        let {context, template, lang} = meta;
        this.state = {
            treeId: 'elesysTree',
            formId: 'elementsys',
            tableId: 'eletypes',
            root: {
                "isleaf": false,
                "key":"~",
                "title": this.lang['10140ES-000001'],
                "id":"~",
                "innercode":"~",
                "pid": "",
                "refname": this.lang['10140ES-000001'],
                "refpk": "~"
            },
            tableStatus: 'browse',
            selectedpk: ''
        }
    }

    loadTreeData = (callback = EMPTY_FN)=>{
        ajax({
            url: urls.elesysLoadTree,
            data:{},
            success:(result)=>{
                if(result.success){
                    let data = [Object.assign(this.state.root, {children: result.data})];
                    //?????????  ??????????????????
                    this.props.syncTree.setSyncTreeData(this.state.treeId, this.dealTreeData(data));
                    this.props.syncTree.setNodeDisable(this.state.treeId,false);//?????????????????????
                    //????????????  ?????????????????????
                    this.props.syncTree.openNodeByPk(this.state.treeId, this.state.root.refpk);
                    this.state.tableStatus = 'browse';
                    this.setState(this.state, callback);
                    if(this.state.selectedpk && this.state.selectedpk.length > 0){
                        this.onSelectTree(this.state.selectedpk);
                    }
                }
            }
        });
    }

    /**
     * ???????????????  ????????? ????????????????????????children????????????????????????????????????children
     * @param data
     * @returns {*}
     */
    dealTreeData(data){
        let deleteDataChildrenProp = function(node){
            if(!node.children || node.children.length == 0) {
                delete node.children;
            }
            else{
                node.isLeaf = false;
                node.children.forEach( (e) => {
                    deleteDataChildrenProp(e);
                } );
            }
        };
        data.forEach( (e) => {
            deleteDataChildrenProp(e);
        });
        return data;
    }

    // ?????????
    onSelectTree(refpk){
        // //?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
        // let elesystem;
        // if(refpk){
        //     elesystem = this.props.syncTree.getSyncTreeValue(this.state.treeId, refpk);
        //     // ??????????????????
        //     this.props.syncTree.setNodeSelected(this.state.treeId, refpk);
        //     this.state.selectedpk = refpk;
        // } else {
        //     elesystem = this.props.syncTree.getSelectNode(this.state.treeId);
        // }
        // if(elesystem && elesystem.refpk && elesystem.refpk!==this.state.root.refpk){
        //     ajax({
        //         url: urls.elesysQueryCard,
        //         data : {pk_elementsystem: elesystem.refpk},
        //         success: (res) => {
        //             let { success, data } = res;
        //             if (success) {
        //                 if(data && data['elesystem']){
        //                     let elesysdata = data['elesystem'];
        //                     this.props.form.setAllFormValue({[this.state.formId]: elesysdata.head[this.state.formId]});
        //                     this.props.form.setAllFormValue({['audit']: elesysdata.head[this.state.formId]});
        //                     if(elesysdata && elesysdata.body && elesysdata.body[this.state.tableId]){
        //                         this.props.cardTable.setTableData(this.state.tableId, elesysdata.body[this.state.tableId]);
        //                     }else{
        //                         this.props.cardTable.setTableData(this.state.tableId, {rows: []});
        //                     }
        //                 }
        //             }
        //         },
        //         error: (res) => {
        //             toast({ color: 'danger', content: res.message });
        //         }
        //     })
        // } else {
        //     // ??????????????????
        //     this.props.form.EmptyAllFormValue(this.state.formId);
        //     this.props.cardTable.setTableData(this.state.tableId, {rows: []});
        // }
        let elesystem;
        if(refpk){
            elesystem = this.props.syncTree.getSyncTreeValue(this.state.treeId, refpk);
            // ??????????????????
            this.props.syncTree.setNodeSelected(this.state.treeId, refpk);
            this.state.selectedpk = refpk;
        } else {
            elesystem = this.props.syncTree.getSelectNode(this.state.treeId);
        }
        if(elesystem && elesystem.refpk && elesystem.refpk!==this.state.root.refpk){
            ajax({
                url: urls.elesysQueryCard,
                data : {pk_elementsystem: elesystem.refpk},
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        if(data && data['elesystem']){
                            let elesysdata = data['elesystem'];
                            this.props.form.setAllFormValue({[this.state.formId]: elesysdata.head[this.state.formId]});
                            this.props.form.setAllFormValue({['audit']: elesysdata.head[this.state.formId]});
                        }
                    }
                },
                error: (res) => {
                    toast({ color: 'danger', content: res.message });
                }
            })
        } else {
            // ??????????????????
            this.props.form.EmptyAllFormValue(this.state.formId);
        }
    }

    /**
     * ???????????????????????????
     * @param key
     */
    onMouseEnterEve(key){
        //??????
        let obj = {};
        if(key === this.state.root.refpk){
            obj = {
                delIcon:false, //false:????????? true:??????; ????????????true??????
                editIcon:false,
                addIcon:true
            };
        }else{
            obj = {
                delIcon:true, //false:????????? true:??????; ????????????true??????
                editIcon:true,
                addIcon:false
            };
        }
        this.props.syncTree.hideIcon(this.state.treeId, key, obj);
    }

    /**
     * ????????????????????????????????????
     * @param id
     */
    buttonStatus(id){
        let meta = this.props.meta.getMeta();
        if(id==='add' || id==='edit'){
            this.props.form.setFormStatus(this.state.formId, id);
            this.props.cardTable.setStatus(this.state.tableId, 'edit');
            //???????????????????????????
            if(meta['elementsys']){
                meta['elementsys'].items.forEach((item) => {
                    if(item.attrcode && item.attrcode == 'elesyscoderule'){
                        item.visible = true;
                    }
                });
                this.props.meta.setMeta(meta);
            }
        }else{
            this.props.form.setFormStatus(this.state.formId, 'browse');
            this.props.cardTable.setStatus(this.state.tableId, 'browse');
            if(meta['elementsys']){
                meta['elementsys'].items.forEach((item) => {
                    if(item.attrcode && item.attrcode == 'elesyscoderule'){
                        item.visible = false;
                    }
                });
                this.props.meta.setMeta(meta);
            }
        }
        switch(id){
            case 'add':
                this.props.button.setButtonVisible(['refresh'], false);
                this.props.button.setButtonVisible(['save','saveAdd','cancel'], true);
                this.props.syncTree.setNodeDisable(this.state.treeId, true);    //?????????????????????????????????
                break;
            case 'cancel':
                this.props.button.setButtonVisible(['refresh'], true);
                this.props.button.setButtonVisible(['save','saveAdd','cancel'], false);
                this.props.syncTree.setNodeDisable(this.state.treeId, false);
                break;
            case 'save':
                this.props.button.setButtonVisible(['refresh'], true);
                this.props.button.setButtonVisible(['save','saveAdd','cancel'], false);
                this.props.syncTree.setNodeDisable(this.state.treeId, false);
                break;
            case 'edit':
                this.props.button.setButtonVisible(['refresh'], false);
                this.props.button.setButtonVisible(['save','saveAdd','cancel'], true);
                this.props.syncTree.setNodeDisable(this.state.treeId, true);
                break;
            default :
                this.props.button.setButtonVisible(['refresh'], true);
                this.props.button.setButtonVisible(['save','saveAdd','cancel'], false);
                break;
        }
    }

    // ????????????
    onButtonClick =(props, id)=> {
        switch (id) {
            case 'refresh'://??????
                this.onRefresh(() => {
                    toast({ color:'success', title:this.lang['10140ES-000004'] });/* ?????????????????? ???????????????*/
                });
                break;
            case 'cancel'://??????
                this.onCancel();
                break;
            case 'saveAdd':
                this.onSaveAdd();
                break;
            case 'save':
                this.onSave();
                break;
            case 'addLine':
                this.addLine();
                break;
            case 'delLine':
                this.delLine();
                break;
            case 'moveUp':
                this.moveUpOrDown();
                break;
            case 'moveDown':
                this.moveUpOrDown(false);
                break;
            default:
                break;
        }
    }

    // ???????????????
    moveUpOrDown = (isUp=true)=>{
        let allDatas = this.props.cardTable.getVisibleRows(this.state.tableId);
        let dataLength = allDatas.length;
        let currIndex = this.props.cardTable.getCurrentIndex(this.state.tableId);
        if(typeof(currIndex) == "number"){
            currIndex = currIndex;
        }else if(currIndex && currIndex.length){
            if(currIndex.length> 0){
                currIndex = currIndex[currIndex.length - 1];
            }else{
                currIndex = null;
            }
        }
        if(dataLength && (currIndex || currIndex == 0)){
            let beginIndex = currIndex;
            let targetIndex = isUp ? beginIndex-1 : beginIndex+1;
            if(targetIndex<0 || targetIndex>dataLength-1){
                return;
            }
            if(isUp){
                allDatas[beginIndex].values.eletypecode.value = parseInt(allDatas[beginIndex].values.eletypecode.value)-1;
                allDatas[targetIndex].values.eletypecode.value = parseInt(allDatas[targetIndex].values.eletypecode.value)+1;
            } else {
                allDatas[beginIndex].values.eletypecode.value = parseInt(allDatas[beginIndex].values.eletypecode.value)+1;
                allDatas[targetIndex].values.eletypecode.value = parseInt(allDatas[targetIndex].values.eletypecode.value)-1;
            }
            allDatas[beginIndex].status = 1;
            allDatas[targetIndex].status = 1;
            this.props.cardTable.moveRow(this.state.tableId, beginIndex, targetIndex);
            this.props.cardTable.focusRowByIndex(this.state.tableId, targetIndex);
        }else{
            toast({ color: 'warning', content: this.lang['10140ES-000014'] });
        }
    }

    // ????????????
    addLine = ()=>{
        //??????id?????????????????????(??????)???????????????
        let count = this.props.cardTable.getNumberOfRows(this.state.tableId);
        this.props.cardTable.addRow(this.state.tableId, count, {
            'eletypecode':{value: count+1+''},
            'balanorient': {value : '0', display: this.lang['10140ES-000010']},/* ?????????????????? ???*/
            'balanposition': {value: '0', display: this.lang['10140ES-000011']},/* ?????????????????? ???*/
            'elementtype' : {value: '0', display: this.lang['10140ES-000012']},/* ?????????????????? ??????*/
            'dr':{value: 0}
        }, false)
        this.props.cardTable.focusRowByIndex(this.state.tableId, count);
    }

    // ????????????
    delLine = ()=>{
        let checkDatas = this.props.cardTable.getCheckedRows(this.state.tableId);
        if(checkDatas && checkDatas.length>0){
            // ????????????
            let indexs = checkDatas.map((item)=>{
                return item.index;
            });
            this.props.cardTable.delRowsByIndex(this.state.tableId, indexs);
        }else{
            toast({ color: 'warning', content: this.lang['10140ES-000013'] });
        }
    }

    // ??????
    onSave = (callback=EMPTY_FN)=>{
        //???????????????????????????????????????????????????UE??????????????????????????????????????????????????????????????????
        //?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
        // if(!this.props.form.isCheckNow(this.state.formId)) {
        //     return;
        // }
        // if(!this.props.cardTable.checkTableRequired(this.state.tableId)) {
        //     return;
        // }
        // let allData = this.props.createMasterChildData('10140ES_elementsys', this.state.formId, this.state.tableId);
        // //????????????????????????????????????????????????
        // allData.head[this.state.formId]['rows'][0]['values']['elementtypes'] = null;
        // this.props.validateToSave(allData, ()=>{
        //     ajax({
        //         url: urls.elesysSave,
        //         data: allData,
        //         success: (result) => {
        //             if(result.success) {
        //                 this.onRefresh(()=>{
        //                     toast({title: this.lang['10140ES-000005'], color: 'success'});/* ?????????????????? ???????????????*/
        //                     this.onSelectTree(result.data['pk_elementsystem']);
        //                     setTimeout(callback, 0);
        //                 });
        //             }
        //         }
        //     });
        // } , {[this.state.formId]:"form", [this.state.tableId]:"cardTable"} , 'card' );
        if(!this.props.form.isCheckNow(this.state.formId)) {
            return;
        }
        let allData = this.props.createMasterChildData('10140ES_elementsys', this.state.formId,null);
        //????????????????????????????????????????????????
        allData.head[this.state.formId]['rows'][0]['values']['elementtypes'] = null;
        this.props.validateToSave(allData, ()=>{
            ajax({
                url: urls.elesysSave,
                data: allData,
                success: (result) => {
                    if(result.success) {
                        this.onRefresh(()=>{
                            toast({title: this.lang['10140ES-000005'], color: 'success'});/* ?????????????????? ???????????????*/
                            this.onSelectTree(result.data['pk_elementsystem']);
                            setTimeout(callback, 0);
                        });
                    }
                }
            });
        } , {[this.state.formId]:"form", [this.state.tableId]:"cardTable"} , 'card' );
    }

    // ??????
    onRefresh = (callback=EMPTY_FN)=>{
        this.props.form.EmptyAllFormValue(this.state.formId);
        this.props.cardTable.setTableData(this.state.tableId, {rows: []});
        this.buttonStatus();
        this.props.syncTree.cancelSelectedNode(this.state.treeId);
        this.loadTreeData(callback);
    }

    // ????????????
    onSaveAdd = ()=>{
        this.onSave(()=>{
            this.onAddIconEve();
        });
    }

    // ??????
    onCancel = ()=>{ 
        promptBox({
            color: 'warning',
            title: this.lang['10140ES-000002'],               // ???????????? /* ?????????????????? ??????*/
            content: this.lang['10140ES-000003'],             // ???????????? /* ?????????????????? ?????????????????????*/
            beSureBtnClick: () => {
                this.state.tableStatus = "browse";
                this.setState(this.state, ()=>{
                    this.buttonStatus('cancel');
                    this.onSelectTree();
                });
            }
        });
    }

    // ???????????????????????????
    onAddIconEve(){
        ajax({
            url: urls.elesysAdd,
            data: {},
            success: (result) => {
                if(result.success) {
                    if(result.data.billcard.head){
                        //?????????
                        this.props.form.EmptyAllFormValue(this.state.formId);
                        this.props.cardTable.setTableData(this.state.tableId,{rows:[]});
                        //?????????
                        // this.props.form.setAllFormValue({[this.state.formId]: result.data.billcard.head[this.state.formId]});
                        if(result.data.billcard.body){
                            this.props.cardTable.setTableData(this.state.tableId, result.data.billcard.body[this.state.tableId]);
                        }
                        this.props.form.setAllFormValue({['audit']: result.data.billcard.head[this.state.formId]});
                        this.state.tableStatus = 'add';
                        this.setState(this.state, ()=>{
                            this.buttonStatus('add');
                        });
                    }
                }
            }
        });
    }

    // ??????????????????
    onEditIconEve(node){
        this.onSelectTree(node.refpk);
        this.state.tableStatus = 'edit';
        this.setState(this.state, ()=>{
            this.buttonStatus('edit');
        });
    }

    // ??????????????????
    onDelIconEve(node){
        if(!node || !node.refpk){
            toast({ color: 'danger', content: this.lang['10140ES-000006'] });/* ?????????????????? ?????????????????????*/
            return;
        }
        promptBox({
            color: 'info',               
            title: this.lang['10140ES-000007'],                /* ?????????????????? ??????*/
            content: this.lang['10140ES-000008'],             /* ?????????????????? ?????????????????????????????????*/
            beSureBtnClick: () => {
                let pk_elementsystem = node.nodeData.pk_elementsystem;
                let paramData = {
                    pk_elementsystem : pk_elementsystem,
                    ts : node.nodeData.ts
                };
                ajax({
                    url: urls.elesysDel,
                    data: paramData,
                    success:(result)=>{
                        let elesys = this.props.syncTree.getSelectNode(this.state.treeId);
                        this.onRefresh(()=>{
                            toast({title:this.lang['10140ES-000009'], color:'success'});/* ?????????????????? ???????????????*/
                            if(elesys && elesys.refpk && elesys.refpk!==node.refpk){
                                this.onSelectTree(elesys.refpk);
                            }else{
                                this.onSelectTree();
                            }
                        });
                    }
                });
            }
        });
    }

    //????????????????????????
	getTableHead = () => {
		let {button} = this.props;
		let { createButtonApp } = button;
        let {tableStatus, tableId} = this.state;
        if(tableStatus && (tableStatus==='add' || tableStatus==='edit')){
            return (
                <div className="shoulder-definition-area">
                    <div className="definition-icons">
                        {createButtonApp({
                            area: 'pageCard',//??????????????????????????????
                            onButtonClick: this.onButtonClick.bind(this)
                        })}
                        {this.props.cardTable.createBrowseIcons(tableId, {
                            iconArr: ['close', 'open', 'max','setCol'],
                            maxDestAreaId: 'nc-bill-card'
                        })}
                    </div>	
                </div>
            )
        }else{
            return '';
        }
	}

    render(){
        if(!this.lang) return ''; // ?????????????????????????????????????????????setmeta??????setstate??????render
        var {treeId, formId, tableId} = this.state;
        const {form,button,modal,DragWidthCom,syncTree,cardTable,BillHeadInfo} =this.props;
        const {createForm} = form;//?????????????????????????????????
        const {createSyncTree} = syncTree;//???????????????
        const {createCardTable } = cardTable;
        let {createModal} = modal;  //?????????
        let {createButtonApp} = button;
        const {createBillHeadInfo} = BillHeadInfo;
        let leftDom = <div className="tree-area">
                        {createSyncTree({
                            treeId: treeId,
                            needSearch: true,
                            searchType:'filtration',//???????????????
                            needEdit: true,
                            onSelectEve: this.onSelectTree.bind(this),//??????
                            onMouseEnterEve:this.onMouseEnterEve.bind(this), //????????????????????????
                            clickAddIconEve: this.onAddIconEve.bind(this), //???????????? ??????
                            clickEditIconEve: this.onEditIconEve.bind(this), //???????????? ??????
                            clickDelIconEve: this.onDelIconEve.bind(this), // ???????????? ??????
                            showModal: false, //???????????????????????????
                        })}
                    </div>;
        let rightDom = <div><div className="card-area">
                        {createForm(formId, {
                            
                        })}
                       </div>
                       {/* <div className="nc-bill-table-area">
                        {createCardTable(tableId, {
                            tableHead: this.getTableHead.bind(this),
                            isAddRow: false,
                            showCheck:true,
                            showIndex:true,
                            hideAdd:true,
                            hideModelSave:true,
                        })}
                       </div> */}
                       </div>;
        return (
            <div className="nc-bill-tree-card">
                {/* ?????? header*/}
                <NCDiv areaCode={NCDiv.config.HEADER} className="header" >
                    {/* ??????????????? ?????? title*/}
                    <div className='header-title-search-area'>{createBillHeadInfo({title :this.lang['10140ES-000001'], initShowBackBtn:false})}</div>
                    {/* ????????? btn-group*/}
                    <div className=" btn-group">
                        {createButtonApp({
                            area: 'btn-group',
                            buttonLimit: 3,
                            onButtonClick: this.onButtonClick.bind(this),
                            popContainer: document.querySelector(' btn-group')
                        })}
                    </div>
                </NCDiv>
                {/* ???????????? */}
                <div className="tree-card">
                    <DragWidthCom
                        leftDom={leftDom}     //????????????dom
                        rightDom={rightDom}     //????????????dom
                        defLeftWid='20%'      // ???????????????????????????px/?????????
                    />
                </div>
            </div>
        );
    }
}

ElementSystem = createPage({
    billinfo:{
        billtype: 'card',
        pagecode: '10140ES_elementsys',
        headcode: 'elementsys',
        bodycode: 'eletypes'
    }
})(ElementSystem);
// ????????????
ReactDOM.render(<ElementSystem/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65