import sys
import csv
import re
import os


filePath = sys.argv[1]

print ("processing file " + filePath)

fileInfo = os.path.splitext(os.path.basename(filePath))
fileName = fileInfo[0]
xmlFilePath = sys.argv[2] if len(sys.argv) > 2  else fileName+".xml"



xmlContent = "<questions>"
qEndTag = "\n        </answers>\n    </question>"
qCounter = 0



with open(filePath, 'rb') as csvFile:
    reader = csv.reader(csvFile, delimiter=',', quotechar='"')
    for col in reader:
        print ".",
#        print(col[0]+"|"+col[1]+"|"+col[2]+"|"+col[3]) # col[-1] gives the last column
        if(col[0]):
            #double check
            if(re.match('^[A-Z]+[0-9]+\.?$', col[0])):
                if(qCounter>0):
                    xmlContent+=qEndTag
                qCounter += 1
                xmlContent += "\n    <question number=\""+str(qCounter)+"\">\n        <text>"+col[2]+"</text>\n        <answers>"
            else:
                print("warnign : Question title - probe failed ["+col[0]+","+col[1]+",...]")
        else:
            if(col[1]):
                if(re.match('^[a-z]+(\.|\))?$', col[1])):
                    xmlContent += "\n                <answer";
                    if (col[3]):
                        if(col[3]=='X' or col[3]=='x'):
                            xmlContent += " type=\"correct\""
                        else:
                            print("warnign: unknown question value")
                    xmlContent += ">"+col[2]+"</answer>"
                else:
                    print("warnign: failed to determine answer tag "+col[0]+"|"+col[1]+"|...")
            else:
                print("warnign: unknown line : "+col[0]+"|"+col[1]+"|...");


xmlContent += qEndTag
xmlContent += "\n</questions>"

xmlFile = open(xmlFilePath, 'w')
xmlFile.write(xmlContent)
