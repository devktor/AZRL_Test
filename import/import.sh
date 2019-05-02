#!/bin/bash

tempDir="./temp"
dataDir="./data"

filePath=$1;
fileName=$(basename -- "$filePath")
fileName="${fileName%.*}"
textFilePath="$tempDir/$fileName.txt"
xmlFilePath=${2:-"$fileName.xml"} 

NEWLINE=$'\\n'
TAB='    '

SerializeAnswers () {
    str="\\\\n${TAB}${TAB}<answers>"
    answers=$1
    for i in "${answers[@]}"
    do :
        str+="\\\\n${TAB}${TAB}${TAB}<answer>$i</answer>"
    done
    str+="\\\\n${TAB}${TAB}</answers>"
    echo -ne "$str"
}


SerializeQuestionText () {
    echo -ne "\\\\n${TAB}${TAB}<text>$1</text>"
}

echo "source file $filePath"
echo "destination file $xmlFilePath"

mkdir -p $tempDir;
mkdir -p $dataDir

if ! (pdftotext -layout $filePath $textFilePath); then
    echo "failed to convert pdf to text";
    exit 1;
fi

xmlContent="<questions>";
questionCount=0

qEnding="$NEWLINE${TAB}</question>";


answers=()
question=""

while read line
do
    echo -n "."
    line=$(echo $line| sed 's/&/\&amp;/g; s/</\&lt;/g; s/>/\&gt;/g; s/"/\&quot;/g; s/'"'"'/\&#39;/g' | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' -e 's/\n//')

    if [ ${#line} -eq 0 ]; then
        continue
    fi

    if [[ $line =~ ^?[0-9]+\. ]]; then
        question=$line
        #flush previous answers
        if [ ${#answers[@]} -gt 0 ]; then
            xmlContent+=$(SerializeAnswers "${answers[@]}")
            xmlContent+=$qEnding;
        fi
        answers=()
    else
        if [[ $line =~ ^[[:space:]]*[a-z](\.|\)) ]]; then
            line=${line:3:${#line}}
            answers+=("$line")
            if [ ${#question} -gt 0 ]; then
                xmlContent+="$NEWLINE${TAB}<question>$(SerializeQuestionText "$question")";
                question=""
            fi
        else
            size=${#answers[@]}
            if [ $size -gt 0 ]; then
                answers[${#answers[@]}-1]+=" $line" 
            else
                if [ ${#question} -gt 0 ]; then
                    question="$question $line"
                fi
            fi
        fi
    fi
done < $textFilePath

if [ ${#answers[@]} ]; then
    xmlContent+=$(SerializeAnswers "${answers[@]}")
fi

xmlContent+=$qEnding
xmlContent+="$NEWLINE</questions>"

echo ""

echo -ne "${xmlContent}" >$xmlFilePath
