//QU837z42+7Lz8vao0glIDwysdMp0drQsG34zd9GYXEEb5nC/W4UVfdRgATyM7R4q
import TreeNodeCom from '../treenodecom';
import ReferLoader from "../ReferLoader/index";
import {tableId} from '../../list/constants'
import {ajax} from 'nc-lightapp-front';

//这个是管控范围弹出框页面
export function menue(key){
    if(key === 'resa_RelLiabilityCenter'){
        //关联利润中心
        return reldataMenue.call(this,queryLiabilityBookData)
    }else if(key === 'resa_RelFinanceOrg'){
        //关联财务组织
        return reldataMenue.call(this,queryFinanceOrg)
    }else if(key === 'resa_RelFactory'){
        //关联工厂查询
        return reldataMenue.call(this,queryrelFactory)
    }else if(key === 'resa_RelProjectOrg'){
        //关联项目组织
        return reldataMenue.call(this,queryProjectOrg)
    }
}

///////////////////////////一下为弹出框内容//////////////////////////////////////

//关联内容弹出框内容
function reldataMenue(queryFN){
    var source = this.source;
    var controlContent = '';
    if(source == 'card'){
        controlContent=this.props.form.getAllFormValue(this.formId).rows[0].values.caname.value;
    }else{
        controlContent=this.props.cardTable.getValByKeyAndIndex(this.tableId,this.index,'caname').value;
    }
    return <TreeNodeCom _this={this} controlContent={controlContent} queryRuleData={queryFN} {...this.props}/>
}

//关联责任核算账簿弹框内容
function RelLiabilityBookMenue(){
    let selectreferUrl='uapbd/refer/org/SetOfBookGridRef/index.js';
    let queryCondition={
        AppCode: this.props.getSearchParam('c'),
        isDataPowerEnable: 'Y',//使用数据权限
        DataPowerOperationCode: 'fi',//使用权阻
        GridRefActionExt: 'nccloud.web.uapbd.controlarea.action.OrgSqlSqlBuilder'
    }
    return refMenue.call(this,selectreferUrl,queryCondition,"账簿类型");
}

/**
 * 弹出参照组件
 */
function refMenue(selectreferUrl,queryCondition,refTitle){
    return <div style={{marginLeft: '8px',display: 'flex',flexDirection: 'row',alignItems: 'center'}}>
       <span>{refTitle}</span>
        <ReferLoader
            tag='test'
            refcode={selectreferUrl}
            showStar={true}
            // disabled={this.referDisabled}
            isMultiSelectedEnabled={false}
            queryCondition= {{
                ...queryCondition
            }}
            onChange= {(value) => {
                this.selectRefer = {...value}
            }}
        />
    </div>
}

/////////////////////////////一下为查询树的数据/////////////////////////////////


function queryLiabilityBookData(){
    let _this=this.props._this;
    var controlContent = '';
    if(_this.source == 'card'){
        var value = this.props.form.getAllFormValue(_this.formId);
        controlContent=value.rows[0].values.pk_controlarea.value;
    }else{
        controlContent=this.props.cardTable.getValByKeyAndIndex(_this.tableId,_this.index,'pk_controlarea').value;
    }
    
    let data={
        pk_controlarea:controlContent
    }
    ajax({
        url: '/nccloud/web/controlarea/RelProfitCenterQueryAction.do',
        data: data,
        success: (res) => {
          let { success, data } = res;
          let newTree = this.props.syncTree.createTreeData(data.nodes);
          this.props.syncTree.setSyncTreeData('treeId', newTree);
          this.props.syncTree.openNodeByPk('treeId', 'root');
        }
    });
}

function queryFinanceOrg(){
    let _this=this.props._this;
    var controlContent = '';
    if(_this.source == 'card'){
        var value = this.props.form.getAllFormValue(_this.formId);
        controlContent=value.rows[0].values.pk_controlarea.value;
    }else{
        controlContent=this.props.cardTable.getValByKeyAndIndex(_this.tableId,_this.index,'pk_controlarea').value;
    }
    let data={
        pk_controlarea:controlContent
    }
    
    ajax({
        url: '/nccloud/web/controlarea/RelFiOrgQueryAction.do',
        data: data,
        success: (res) => {
          let { success, data } = res;
          let newTree = this.props.syncTree.createTreeData(data.nodes);
          this.props.syncTree.setSyncTreeData('treeId', newTree);
          this.props.syncTree.openNodeByPk('treeId', 'root');
        }
    });
}
//查询工厂的树
function queryrelFactory(){
    let _this=this.props._this;
    var controlContent = '';
    if(_this.source == 'card'){
        var value = this.props.form.getAllFormValue(_this.formId);
        controlContent=value.rows[0].values.pk_controlarea.value;
    }else{
        controlContent=this.props.cardTable.getValByKeyAndIndex(_this.tableId,_this.index,'pk_controlarea').value;
    }
    let data={
        pk_controlarea:controlContent
    }
    
    ajax({
        url: '/nccloud/web/controlarea/RelFactoryQryAction.do',
        data: data,
        success: (res) => {
          let { success, data } = res;
          let newTree = this.props.syncTree.createTreeData(data.nodes);
          this.props.syncTree.setSyncTreeData('treeId', newTree);
          this.props.syncTree.openNodeByPk('treeId', 'root');
        }
    });
}
//查询项目组织的树
function queryProjectOrg(){
    let _this=this.props._this;
    var controlContent = '';
    if(_this.source == 'card'){
        var value = this.props.form.getAllFormValue(_this.formId);
        controlContent=value.rows[0].values.pk_controlarea.value;
    }else{
        controlContent=this.props.cardTable.getValByKeyAndIndex(_this.tableId,_this.index,'pk_controlarea').value;
    }
    let data={
        pk_controlarea:controlContent
    }
    
    ajax({
        url: '/nccloud/web/controlarea/RelProjectOrgQryAction.do',
        data: data,
        success: (res) => {
          let { success, data } = res;
          let newTree = this.props.syncTree.createTreeData(data.nodes);
          this.props.syncTree.setSyncTreeData('treeId', newTree);
          this.props.syncTree.openNodeByPk('treeId', 'root');
        }
    });
}




//QU837z42+7Lz8vao0glIDwysdMp0drQsG34zd9GYXEEb5nC/W4UVfdRgATyM7R4q