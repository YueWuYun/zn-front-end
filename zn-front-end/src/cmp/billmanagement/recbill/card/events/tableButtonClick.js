/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/
import { openBtn } from '../tableButtonClick/openBtn.js';
import { copylineBtn } from '../tableButtonClick/copylineBtn.js';
import { addlineBtn } from '../tableButtonClick/addlineBtn.js';
import { deletelineBtn } from '../tableButtonClick/deletelineBtn.js';
import { editmoreBtn } from '../tableButtonClick/editmoreBtn.js';
import { copythisBtn } from '../tableButtonClick/copythisBtn.js';
import { closeBtn } from '../tableButtonClick/closeBtn.js';

export default function tableButtonClick(props, key, text, record, index) {
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
        //增行，插行
        case 'addlineBtn':
            addlineBtn.call(this, record, index);
            break;
        //删行
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