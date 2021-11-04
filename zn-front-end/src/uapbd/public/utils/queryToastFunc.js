//1QxbrdDNbZey0RvHZaM2jZCIikaxDN5DWka6X/luzloLqN+C/714xEXHmvfTmi3M
import {toast} from 'nc-lightapp-front';

export default function (){
    return (resultLength)=>{
        if (typeof(resultLength) === 'object') {
            if (resultLength && resultLength.length > 0) {
                toast({
                    color: 'success',
                    content: this.state.json['queryToastFunc001'] +resultLength.length+this.state.json['queryToastFunc002']
                });
            } else {
                toast({
                    color: 'warning',
                    content: this.state.json['queryToastFunc003']
                });
            }
        }
        if(typeof(resultLength) === 'undefined'){
            toast({
                color:'success',
                title:this.state.json['queryToastFunc004']
            })
        }
    }
}
//1QxbrdDNbZey0RvHZaM2jZCIikaxDN5DWka6X/luzloLqN+C/714xEXHmvfTmi3M