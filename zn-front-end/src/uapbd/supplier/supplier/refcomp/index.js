//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import LinkmanRefer from "./LinkmanRef";

const EMPTY_FUNC = ()=>{}
export const conf = {
    placeholder:'联系人',
    refName:'联系人',
    refType:'grid',
    queryGridUrl:'/nccloud/uapbd/ref/QueryReferLinkman.do',
    columnConfig:[{
            name: [ '编码', '名称' ],
            code: [ 'refcode', 'refname' ]
        }],


}

export default function (props = {}) {
    return <LinkmanRefer {...Object.assign(conf, props)} />
}


//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65