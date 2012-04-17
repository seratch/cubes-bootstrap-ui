#!/bin/sh 
if test "$1" = ""; then
  echo "Please specify the directory to sync."
  exit 1
fi
cd `dirname $0`
echo "Update ${1}?[y/n]"
read a
if test "$a" = "y"; then
  BACKUP_DIR=../bkup/`date +%Y%m%d%H%M%S`
  mkdir -p ${BACKUP_DIR}
  cp -pr $1/ ${BACKUP_DIR}/.
  rm -rf $1/* 
  cp -pr * $1/.
  rm -f $1/sync.sh
  rm -f $1/readme.md
  rm -rf $1/doc
else
  echo "Bye."
  exit 0
fi


