from model import GPT2PPL

# initialize the model
model = GPT2PPL()

# print("Please enter your sentence: (Press Enter twice to start processing)")
# contents = []
# while True:
#     line = input()
#     if len(line) == 0:
#         break
#     contents.append(line)
# sentence = "\n".join(contents)

# open text file in read mode
text_file = open('test.txt', 'r')
# read whole file to a string
text = text_file.read()
# close file
text_file.close()

model(text)