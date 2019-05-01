

function ParseXML(xml, callback){

    xml = $( (xml instanceof String) ? $.parseXML(xml) : xml );

    if(callback instanceof Function){
        callback(xml);
    }

    return xml;
}


function GetXMLNode(xml, nodeName){

    xml = ParseXML(xml);
    return (xml.prop("tagName")||"").toLowerCase() == nodeName ? xml : xml.find(nodeName);

}
