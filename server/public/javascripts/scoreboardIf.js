var ElementTypes = Object.freeze ({ET_NONE:0,
                                  ET_RECT:101,
                                  ET_TEXTBOX:110,
                                  ET_TIMER:111});
var BoardRequestType = Object.freeze ({BRT_NONE:0, BRT_VALUE:1, BRT_CMD:2, BRT_DATA:3, BRT_QUERY:4});
var BoardTimerCmd = Object.freeze ({TIMER_NO_CMD:0, TIMER_SET:1, TIMER_START:2, TIMER_PAUSE:3, TIMER_STOP:4, TIMER_RESET:5, TIMER_CLEAR:6});
var TimerDisplayMode = Object.freeze ({DM_NONE:0, DM_HHMMSS:1, DM_MMSS:2});
var TimerPrecision = Object.freeze ({TP_NONE:0, TP_SECONDS:1, TP_TENTHS:2, TP_HUNDREDTHS:3});


var BoardRequest = function () {
    this.requestor = "";
    this.request_type = BoardRequestType.BRT_VALUE;     //VALUE, CMD, or DATA
    this.element_type = ElementTypes.ET_NONE;           //Element type involved: TEXTBOX, TIMER, RECT
    this.uuid = "";
    
    //case of request_type == BRT_VALUE
    this.value_type = 'TEXT';                           //the type of the value: text, date
    this.value = "";                                    //Text value
    
    //fields applying to query
    this.query_name = "";
    this.query_qualifier1 = "";
    this.query_qualifier2 = "";

    //case of request_type == BRT_CMD and element_type == ET_TIMER
    this.timer_request = BoardTimerCmd.TIMER_NO_CMD;
    this.timer_ticks = -1;
    this.timer_display_mode = TimerDisplayMode.DM_NONE;
    this.timer_precision = TimerPrecision.TP_NONE;
    this.timer_fraction_threshold = -1;
}

var BoardResponse = function() {
    this.requestor = "";
    this.request_type = BoardRequestType.BRT_VALUE;     //VALUE, CMD, or DATA
    this.element_type = ElementTypes.ET_NONE;           //Element type involved: TEXTBOX, TIMER, RECT
    this.uuid = "";
    
    this.query_result1 = [];
    
}

function sendToScoreboard (message) {
        
    return new Promise (function (resolve, reject) {
        var text = null;
        var response = null;
        var parser = document.createElement('a');
        parser.href = document.baseURI;
        var api_page = String.format ("http://{0}:{1}/api/scoreboardIf", parser.hostname, parser.port);
    //    var api_page = String.format ("http://{0}:{1}/api/actions", parser.hostname, parser.port);
        var Httpreq = new XMLHttpRequest(); // a new request
        Httpreq.onreadystatechange = function() {
            if (Httpreq.readyState == 4) {
                text = Httpreq.responseText;
                response = JSON.parse (text);
//                alert (response + response.length);
                resolve (response);
            }
        };
        //last argument is true for asynchronous
        Httpreq.open("POST",api_page,true);
        Httpreq.setRequestHeader("Content-Type", "application/json");
        var tmp = JSON.stringify(message);
        Httpreq.send(tmp);
    });
}

function CreateBoardRequest () {
    return new BoardRequest();
}
function CreateBoardResponse () {
    return new BoardResponse();
}


module.exports.ElementTypes = ElementTypes;
module.exports.BoardRequestType = BoardRequestType;
module.exports.BoardTimerCmd = BoardTimerCmd;
module.exports.TimerDisplayMode = TimerDisplayMode;
module.exports.TimerDisplayMode = TimerDisplayMode;
module.exports.TimerPrecision = TimerPrecision;
module.exports.BoardRequest = CreateBoardRequest;
module.exports.BoardResponse = BoardResponse;
