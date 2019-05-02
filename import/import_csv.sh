#!/bin/bash


filePath=$1;
fileName=$(basename -- "$filePath")
fileName="${fileName%.*}"
textFilePath="$tempDir/$fileName.txt"
xmlFilePath=${2:-"$fileName.xml"} 


NL=$'\\n'
TAB='    '

echo "importing file $csvFile"
echo ""

questionNumber=0
qEnding="$NL$TAB$TAB</answers>$NL${TAB}</question>";
xmlContent=""

while IFS=, read -r col1 col2 col3 col4; do
    echo -n "."
    if [ $col1 ]; then
        #double check
        if [[ $col1 =~ ^[A-Z]+[0-9]+\.?$ ]]; then
            if [ $questionNumber -gt 0 ]; then
                xmlContent+=$qEnding;
            fi
            ((questionNumber++))
            xmlContent+="${NL}${TAB}<question number=\"$questionNumber\">${NL}${TAB}${TAB}<text>$col3</text>$NL$TAB$TAB<answers>"
        else
            echo "warnign : Question title - probe failed [$col1,$col2,...]"
        fi

    else
        if [[ $col2 =~ ^[a-z]+(\.|\))?$ ]]; then
            xmlContent+="${NL}${TAB}${TAB}${TAB}<answer"
            if [ "$col4" ]; then
                if [ "$col4" == "X" ]; then
                    xmlContent+=" type=\"correct\"";
                else
                    echo "warnign: failed to determine answer tag $col3|$col4|$col5"
                    exit 1
                fi
            fi
            xmlContent+=">$col3</answer>";
        else
            echo "warnign : Answer - probe failed [$col1,$col2,...]"
        fi
        
    fi
done < $filePath

xmlContent+=$qEnding

echo ""
echo ""

echo -ne "${xmlContent}" >$xmlFilePath
