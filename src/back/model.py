"""
This code a slight modification of perplexity by hugging face
https://huggingface.co/docs/transformers/perplexity
"""

import re
import torch
from transformers import GPT2LMHeadModel, GPT2TokenizerFast
from collections import OrderedDict

class GPT2PPL:
    def __init__(self, device='cuda'):
        self.device = 'cuda' if device=='cuda' and torch.version.cuda is not None else 'cpu'
        self.model_id = 'gpt2'
        self.model = GPT2LMHeadModel.from_pretrained(self.model_id).to(self.device)
        self.tokenizer = GPT2TokenizerFast.from_pretrained(self.model_id)
        
        # Hyperparameters
        self.max_length = self.model.config.n_positions
        self.stride = 512

    def __call__(self, sentence):
        """
        Takes in a sentence split by full stop
        and print the perplexity of the total sentence
        
        Perplexity is defined as the exponentiated average 
        negative log-likelihood of a sequence.

        Then, split the lines based on full stop 
        and find the perplexity of each sentence 
        and calculates the average perplexity for each sentence.

        Burstiness is the max perplexity of each sentence.
        """
        results = OrderedDict()

        valid_chars = re.findall("[a-zA-Z0-9]+", sentence)
        total_valid_chars = sum([len(x) for x in valid_chars]) # finds len of all the valid characters a sentence

        if total_valid_chars < 100: # the pretrained model needs a reasonable amount of text to calculate perplexity
            return {"status": "Please input more text (min 100 characters)"}, "Please input more text (min 100 characters)"
        
        lines = re.split(r'(?<=[.?!][ \[\(])|(?<=\n)\s*',sentence)
        lines = list(filter(lambda x: (x is not None) and (len(x) > 0), lines))

        perplexity = self.calculate_perplexcity(sentence)
        # print(f"Document Perplexity: {perplexity}")
        results["Document Perplexity"] = perplexity

        offset = ""
        perplexity_per_line = []
        for i, line in enumerate(lines):
            if re.search("[a-zA-Z0-9]+", line) == None:
                continue
            if len(offset) > 0:
                line = offset + line
                offset = ""
            # remove the new line pr space in the first sentence if exists
            if line[0] == "\n" or line[0] == " ":
                line = line[1:]
            if line[-1] == "\n" or line[-1] == " ":
                line = line[:-1]
            elif line[-1] == "[" or line[-1] == "(":
                offset = line[-1]
                line = line[:-1]
            perplexity = self.calculate_perplexcity(line)
            perplexity_per_line.append(perplexity)
        
        # print(f"Perplexity per line: {sum(perplexity_per_line)/len(perplexity_per_line)}")
        results["Perplexity per line"] = sum(perplexity_per_line)/len(perplexity_per_line)

        # print(f"Burstiness: {max(perplexity_per_line)}")
        results["Burstiness"] = max(perplexity_per_line)

        model_output= self.get_results(results["Perplexity per line"])
        results["Model Output"] = model_output
        # print(model_output)

        return results

    def calculate_perplexcity(self, sentence):
        """
        Takes a sentence as input 
        and calulates the perplixty score of this sentence.
        """
        encodings = self.tokenizer(sentence, return_tensors="pt")
        seq_len = encodings.input_ids.size(1)

        nlls = []
        likelihoods = []
        prev_end_loc = 0
        for begin_loc in range(0, seq_len, self.stride):
            end_loc = min(begin_loc + self.max_length, seq_len)
            trg_len = end_loc - prev_end_loc
            input_ids = encodings.input_ids[:, begin_loc:end_loc].to(self.device)
            target_ids = input_ids.clone()
            target_ids[:, :-trg_len] = -100

            with torch.no_grad():
                outputs = self.model(input_ids, labels=target_ids)
                
                # loss is calculated using CrossEntropyLoss which averages over input tokens.
                # Multiply it with trg_len to get the summation instead of average.
                # We will take average over all the tokens to get the true average.
                neg_log_likelihood = outputs.loss * trg_len
                if not torch.isnan(neg_log_likelihood):
                    likelihoods.append(neg_log_likelihood)

            if not torch.isnan(neg_log_likelihood):
                nlls.append(neg_log_likelihood)

            prev_end_loc = end_loc
            if end_loc == seq_len:
                break

        return 0 if len(nlls) == 0 else int(torch.exp(torch.stack(nlls).sum() / end_loc))

    def get_results(self, threshold):
        """
        Takes the average perplexity per line of a given document
        and output a determination if the document was human or AI generated
        based on a predetermined threshold.
        """
        model_output = ""
        if threshold < 60:
            model_output = "The Text was generated by AI."
            return model_output
        elif threshold < 80:
            model_output = "The Text most likely contain parts generated by AI (requires more text for better judgement)."
            return model_output
        else:
            model_output = "The Text was written by Human."
            return model_output
