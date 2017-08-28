#!/usr/bin/env bash
rm -rf package.zip
GLOBIGNORE=".:.."
shopt -s extglob
zip -r package.zip !(.git|.gitignore|.DS_Store|.idea|package.sh|README.md)
