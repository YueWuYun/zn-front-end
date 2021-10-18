/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息
import { CopyHandleData, CopyThisHandleData } from './CMPCopyUtil.js';
import { openBtn } from '../tableButtonClick/openBtn.js';
import { closeBtn } from '../tableButtonClick/closeBtn.js';
import { copylineBtn } from '../tableButtonClick/copylineBtn.js';
import { addlineBtn } from '../tableButtonClick/addlineBtn.js';
import { deletelineBtn } from '../tableButtonClick/deletelineBtn.js';
import { editmoreBtn } from '../tableButtonClick/editmoreBtn.js';
import { copythisBtn } from '../tableButtonClick/copythisBtn.js';
export default function tableButtonClick(props, key, text, record, index) {
    let self = this;
    console.log(key);

    switch (key) {
        //展开
        case 'openBtn':
            openBtn.call(this, record, index);
            break;
        //收起
        case 'closeBtn':
            closeBtn.call(this, record, index);
            break;
        //复制
        case 'copylineBtn':
            copylineBtn.call(this, record, index);
            break;
        //插行
        case 'addlineBtn':
            addlineBtn.call(this, record, index);
            break;
        case 'deletelineBtn':
            deletelineBtn.call(this, record, index);
            break;
        //编辑展开
        case 'editmoreBtn':
            editmoreBtn.call(this, record, index);
            break;
        //粘贴至此
        case 'copythisBtn':
            copythisBtn.call(this, record, index);
            break;

    }
}

/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/