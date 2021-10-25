#!/bin/bash

proccess_line () {
    echo "\n"
    echo $1
    echo "\n"
}

proccess_line
cat hosts.txt | parallel -P 10 proccess_line {} 

