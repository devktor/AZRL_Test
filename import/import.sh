#!/bin/bash

tempDir="./temp"
dataDir="./data"
filePath="pdf/Baza-intrebari-Principiile-zborului.pdf"
fileName=$(basename -- "$filePath")
fileName="${fileName%.*}"
textFilePath="$tempDir/$fileName.txt"
xmlFilePath="$dataDir/$fileName.xml"

NEWLINE=$'\\n'
TAB='    '

mkdir -p $tempDir;
mkdir -p $dataDir

if ! (pdftotext -layout $filePath $textFilePath); then
    echo "failed to convert pdf to text";
    exit 1;
fi

xmlContent="<questions>";
questionCount=0

qEnding="$NEWLINE${TAB}${TAB}</answers>$NEWLINE${TAB}</question>$NEWLINE";

while read line
do
    echo -n "."
    line=$(echo $line| sed 's/&/\&amp;/g; s/</\&lt;/g; s/>/\&gt;/g; s/"/\&quot;/g; s/'"'"'/\&#39;/g')
    if [[ $line =~ ^?[0-9]+\. ]]; then
        if [[ $questionCount > 0 ]]; then
            xmlContent+=$qEnding;
        fi
        questionCount=$((questionCount + 1))
        xmlContent+="$NEWLINE${TAB}<question>$NEWLINE${TAB}${TAB}<text>$line</text>$NEWLINE${TAB}${TAB}<answers>";
    else
        if [[ $line =~ ^[a-z]\. ]]; then
            xmlContent+="$NEWLINE${TAB}${TAB}${TAB}<answer>$line</answer>"
        fi
    fi

done < $textFilePath
echo ""
xmlContent+=$qEnding
xmlContent+="</questions>"

echo -ne "${xmlContent}" >$xmlFilePath
