import os
import re
import time
from pyquery import PyQuery as pq


tempDir = "./temp"
filePath = "pdf/Baza-intrebari-Principiile-zborului.pdf"
xmlFilePath = "Baza-intrebari-Principiile-zborului.xml"

if not os.path.exists(tempDir):
    os.makedirs(tempDir)

fileInfo = os.path.splitext(os.path.basename(filePath))
fileName = fileInfo[0]
htmlFilePath = tempDir+"/"+fileName+".html"

#if os.system("pdftohtml -s -noframes  "+filePath+" "+htmlFilePath):
#    print("failed to convert pdf to html")
#    exit(1)


htmlFile = open(htmlFilePath)


def extractAnswers(html):
    html = html.replace("<br/></b>","</b><br/>")
    html = "<div>"+html.replace("<br/>","</div><div>")+"</div>"
    xmlContent = ""
    for div in pq(html).find("div"):
        div = pq(div)
        xmlContent += "\n                <answer";
        if div.find("b"):
            xmlContent += " type=\"correct\""
        xmlContent += ">"+div.text()+"</answer>"
    return "\n        <answers>"+xmlContent+"\n        </answers>"


d = pq(pq(htmlFile.read()).html())

xmlContent = "<questions>"
qEndTag = "\n    </question>"
qCounter = 0
aCounter = 0
txt = ""


for p in d.items('p'):
    line = p.html()
    match = re.search('^<b>(\d+)', line)
    if match:
        qCounter += 1
        if qCounter != int(match.group()[3:]):
            print("failed to parse html")
            exit(1)
        if aCounter > 0:
            xmlContent += extractAnswers(txt)
        txt = pq(line).text()
        aCounter = 0
    else:
        if re.search('^\s*?(?:<b>)?[a-z](\.|\))', line):
            if aCounter == 0:
                if qCounter > 1:
                    xmlContent += qEndTag
                xmlContent += "\n    <question number=\""+str(qCounter)+"\">\n        <text>"+pq(txt).text()+"</text>"
                txt = line
            else:
                txt += "<br/>"+line
            aCounter += 1
        else:
            txt += line

if aCounter:
    xmlContent += extractAnswers(txt)

xmlContent += qEndTag
xmlContent += "</questions>"

print(xmlContent)
xmlFile = open(xmlFilePath, 'w')
xmlFile.write(xmlContent.encode("utf-8"))


