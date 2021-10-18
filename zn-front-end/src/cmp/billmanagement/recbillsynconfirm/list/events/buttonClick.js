/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import {  toast } from 'nc-lightapp-front';
import { addBtn } from '../buttonClick/addBtn.js';
import { deleteBtn } from '../buttonClick/deleteBtn.js';
import { copyBtn } from '../buttonClick/copyBtn.js';
import { querysynbillBtn } from '../buttonClick/querysynbillBtn.js';
import { linkquerybillBtn } from '../buttonClick/linkquerybillBtn.js';
import { querymsgBtn } from '../buttonClick/querymsgBtn.js';
import { queryvoucherBtn } from '../buttonClick/queryvoucherBtn.js';
import { refreshBtn } from '../buttonClick/refreshBtn.js';

export default function buttonClick(props, id) {
    switch (id) {
        case 'addBtn':
            addBtn.call(this);
            break;
        //删除
        case 'deleteBtn':
            deleteBtn.call(this);
            break;
        //复制
        case 'copyBtn':
            copyBtn.call(this);
            break;
        //收款交易类型
        case 'rectradetypeBtn':
            toast({
                color: 'warning',
                content: this.props.MutiInit.getIntl("36070RBMCP") &&
                    this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000010')
            });/* 国际化处理： 功能待开发*/
            break;
        //提交
        case 'submitBtn':
            toast({
                color: 'warning',
                content: this.props.MutiInit.getIntl("36070RBMCP") &&
                    this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000010')
            });/* 国际化处理： 功能待开发*/
            break;
        //收回
        case 'unsubmitBtn':
            toast({
                color: 'warning',
                content: this.props.MutiInit.getIntl("36070RBMCP") &&
                    this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000010')
            });/* 国际化处理： 功能待开发*/
            break;
        //关联结算信息
        case 'linksettleBtn':
            toast({
                color: 'warning',
                content: this.props.MutiInit.getIntl("36070RBMCP") &&
                    this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000010')
            });/* 国际化处理： 功能待开发*/
            break;
        //取消关联
        case 'unlinksettleBtn':
            toast({
                color: 'warning',
                content: this.props.MutiInit.getIntl("36070RBMCP") &&
                    this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000010')
            });/* 国际化处理： 功能待开发*/
            break;
        //联查协同单据---->付款结算单
        case 'querysynbillBtn':
            querysynbillBtn.call(this);
            break;
        //红冲
        case 'redbillBtn':
            toast({
                color: 'warning',
                content: this.props.MutiInit.getIntl("36070RBMCP") &&
                    this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000010')
            });/* 国际化处理： 功能待开发*/
            break;
        //联查单据
        case 'linkquerybillBtn':
            linkquerybillBtn.call(this);
            break;
        //查看审批意见
        case 'querymsgBtn':
            querymsgBtn.call(this);
            break;
        // 联查凭证
        case 'queryvoucherBtn':
            queryvoucherBtn.call(this);
            break;
        //刷新
        case 'refreshBtn':
            refreshBtn.call(this);
            break;

    }


}


/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/