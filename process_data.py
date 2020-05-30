import json
import os

data_dir = 'api-server/data/'
output_dir='api-server/data_prepared'
for file in os.listdir(data_dir):
    filepath = os.path.join(data_dir, file)
    category = file.split('_')[0]
    if os.path.isfile(filepath):
        with open(filepath) as reader:
            data = json.load(reader)
#         if not all(data.values()):
#             os.remove(filepath)
        new_dicts=[]
        id_=0
        for cpt, reviews in data.items():
            for review in reviews:
                date, uid, lemma, sentence = review
                new_dict={
                "id": id_,
                "date" :date,
                "uid" : uid,
                "lemma" : lemma,
                "sentence":sentence,
                "cpt": cpt,
                "category":category
                }
                id_ += 1

                new_dicts.append(new_dict)
        outputfile = os.path.join(output_dir, file)
        with open(outputfile, "w")as writer:
            json.dump(new_dicts, writer)

