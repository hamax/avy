#!/bin/bash

# Add this directory to the python path, so you can import avy.py

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
export PYTHONPATH=$DIR:$PYTHONPATH
