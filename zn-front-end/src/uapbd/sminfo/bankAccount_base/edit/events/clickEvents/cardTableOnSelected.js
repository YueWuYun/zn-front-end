//giwYIFDmU+MOyFl3cHHL71LUKWooxHxZzolXnd7/6Et5znHVmtWaBAyTMUGbqSCYuDZIW+zEAFCO
//MGX9l1a4Jw==
export  default function(props, moduleId, record, index, status){
        let checkedrows =props.cardTable.getCheckedRows(moduleId);
        props.button.setButtonDisabled(['btnSubDelete'],checkedrows.length == 0);
}
//giwYIFDmU+MOyFl3cHHL71LUKWooxHxZzolXnd7/6Et5znHVmtWaBAyTMUGbqSCYuDZIW+zEAFCO
//MGX9l1a4Jw==