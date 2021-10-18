/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { toast } from 'nc-lightapp-front';
import { cachepagecode } from '../buttonClick/cachepagecode.js';
import { addBtn } from '../buttonClick/addBtn.js';
import { deleteBtn } from '../buttonClick/deleteBtn.js';
import { submitAssginBtn } from '../buttonClick/submitAssginBtn.js';
import { copyBtn } from '../buttonClick/copyBtn.js';
import { submitBtn } from '../buttonClick/submitBtn.js';
import { unsubmitBtn } from '../buttonClick/unsubmitBtn.js';
import { linksettleBtn } from '../buttonClick/linksettleBtn.js';
import { queryvoucherBtn } from '../buttonClick/queryvoucherBtn.js';
import { unlinksettleBtn } from '../buttonClick/unlinksettleBtn.js';
import { querysynbillBtn } from '../buttonClick/querysynbillBtn.js';
import { redbillBtn } from '../buttonClick/redbillBtn.js';
import { queryconsumeBtn } from '../buttonClick/queryconsumeBtn.js';
import { annexBtn } from '../buttonClick/annexBtn.js';
import { printBtn } from '../buttonClick/printBtn.js';
import { outputBtn } from '../buttonClick/outputBtn.js';
import { printDetailBtn } from '../buttonClick/printDetailBtn.js';
import { linkquerybillBtn } from '../buttonClick/linkquerybillBtn.js';
import { querymsgBtn } from '../buttonClick/querymsgBtn.js';
import { imageviewBtn } from '../buttonClick/imageviewBtn.js';
import { imagescanBtn } from '../buttonClick/imagescanBtn.js';
import { exportFile } from '../../../../pub/utils/CMPButtonUtil';//导出EXCEL
import { CMPEableSscivm } from '../../../../pub/utils/CMPIVPara';
export default function buttonClick(props, id) {
    cachepagecode.call(this);//设置pagecode为tradecode
    switch (id) {
        //提交指派
        case 'submitAssginBtn':
            submitAssginBtn.call(this);
            break;
        //列表页---新增按钮
        case 'addBtn':
            addBtn.call(this);
            break;
        //列表页---删除按钮
        case 'deleteBtn':
            deleteBtn.call(this);
            break;
        //列表页---复制按钮
        case 'copyBtn':
            copyBtn.call(this);
            break;
        //收款交易类型
        case 'rectradetypeBtn':
            toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000011') });/* 国际化处理： 功能待开发*/
            break;
        //列表页---提交按钮
        case 'submitBtn':
            submitBtn.call(this);
            break;
        //列表页---收回按钮
        case 'unsubmitBtn':
            unsubmitBtn.call(this);
            break;
        //列表页---关联结算信息按钮
        case 'linksettleBtn':
            linksettleBtn.call(this);
            break;
        //列表页---联查凭证按钮
        case 'queryvoucherBtn':
            queryvoucherBtn.call(this);
            break;
        //列表页---取消关联结算信息按钮
        case 'unlinksettleBtn':
            unlinksettleBtn.call(this);
            break;
        //联查协同单据-->付款结算单
        case 'querysynbillBtn':
            querysynbillBtn.call(this);
            break;
        //红冲
        case 'redbillBtn':
            redbillBtn.call(this);
            break;
        //刷新
        case 'refreshBtn':
            this.refresh();
            break;
        //联查计划预算
        case 'queryconsumeBtn':
            queryconsumeBtn.call(this);
            break;
        //附件
        case 'annexBtn':
            annexBtn.call(this);
            break;
        //打印
        case 'printBtn':
            printBtn.call(this);
            break;
        //预览
        case 'viewBtn':
            toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000011') });/* 国际化处理： 功能待开发*/
            break;
        //输出
        case 'outputBtn':
            outputBtn.call(this);
            break;
        //打印清单
        case 'printDetailBtn':
            printDetailBtn.call(this);
            break;
        //联查单据
        case 'linkquerybillBtn':
            linkquerybillBtn.call(this);
            break;
        //联查审批意见
        case 'querymsgBtn':
            querymsgBtn.call(this);
            break;
        //影像查看
        case 'imageviewBtn':

             if(CMPEableSscivm.call(this)){
                return ;
             };
            imageviewBtn.call(this);
            break;
        //影像扫描
        case 'imagescanBtn':

          if(CMPEableSscivm.call(this)){
                return ;
             };
            imagescanBtn.call(this);
            break;
            case 'exportFile': //导出
            exportFile.call(this,props,'table_recbill_01','pk_recbill');
            break;
    }
}



/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/