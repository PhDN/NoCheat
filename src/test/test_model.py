"""
Purpose: Test the model's classification output on a given text file.

usage: python3 test_model.py --test_file <file_name>.txt
                             --device <(optional)'cuda' or 'cpu'>

This script takes a text test file, 
and output the model.GPT2PPL's classification result, 
perplexity, perplixty per line, and burstiness score.

This script optionally takes a device argument to run
the model using cpu or gpu (cuda).

Warning: The model takes ~1-2 minute to classify a document using cpu.
""" 

import argparse
import sys
from src.back.model import GPT2PPL

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--test_file", type=str, required=True)
    parser.add_argument("--device",
                        type=str,
                        choices=['cuda', 'cpu'],
                        required=False)
    args = parser.parse_args()

    # initialize the model
    model = GPT2PPL(device=args.device)
    # open text file in read mode
    text_file = open(args.test_file, 'r')
    # read whole file to a string
    text = text_file.read()
    # close file
    text_file.close()
    # classify on given text file, prints output in shell
    model(text)