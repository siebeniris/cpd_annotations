# Change Point Detection

## Motivation
When automatically summarizing reviews of an entity like a hotel, the usual assumption is that all reviews describe the entity in the same state, so that the “average” opinion of all reviews accurately describes the entity.
However, this is an oversimplification of reality. Let’s assume one hotel constantly gets bad reviews about a pool, until let’s say march. Then, during April and May, the hotel listens to the feedback and renovates the pool, during which time there are complaints about the renovation. Then, starting from June, the reviews about the newly renovated pool are great.
If one created a summary of all reviews on the pool of the last two years in August, it’s likely that they would still call the pool bad, even though it’s now well received.

The task of this thesis is to find a way that automatically detects such points of change that invalidate older reviews in a review stream.

## Data
- Hotel information from **HospitalityNet renovation** page, last update 2020-03-16
https://www.hospitalitynet.org/list/1-10/hotel-renovations.html
- Corresponding hotel information from **trustyou hotel api**
http://api.trustyou.com/data/hotel/v1/clusters/search
- Automatically and manually verify the matching information between trustyou api and hospitalityNet.
- Query hotel reviews from trustyou database. (**418** HOTELS)

## Data preprocessing
- identify language for each review => english only
- sentence tokenization
- expand contractions
- remove repeated characters
- strip the punctuations for each word
- for each sentence, extract lemmas (for later aspect extraction)
    - pos_tag:
        - PRON, NOUN, VERB, ADJ 

## Sentiment Analysis
- training a 2 LSTM-layer model with https://www.kaggle.com/jiashenliu/515k-hotel-reviews-data-in-europe
    - parameters:
        - lstm hidden units: 64
        - max length: 128
        - dropout: 0.2
        - learning rate: 0.001
        - epoch:30
        - batch size: 1024
    - dataset:
        - train: 100000 samples
        - dev: 5000 samples
        - test: 5000 samples
    - test result:
        - accurracy: 94% (threshold for positive: 0.4)

- use this model to infer sentiment for each sentence (sentence-level sentiment analysis)

## Aspect Keywords Extraction
- Given a list of anchor words (aspects)
- Train a Word2Vec model on all the lemmas from all hotel
    - initialized Word2Vec Model (on leamms from one hotel)
        - dim: 200
        - window: 6
        - min count of word: 2
        - workers:8
        - iteration: 200
        - negative sampling: 5
    - training for lemmas of each hotel 
        - epoch: 2
- Using pretrained Word2Vec Model to get the relevant keywords for each aspect using similarity scores and deduplicate

- For each sentence, it could be of the following aspects:
    - atmosphere, beach, entertainment, facility, family, fitness, parking, pool, price, reception, restaurant, room, venue, renovation
  
## Change Point Detection and selection of Reviews

### Change Point Detection using Wild Binary Segmentation

- paper: https://arxiv.org/pdf/1411.0858.pdf
- compared to standard binary segmentation
    - non-parametric
    - works even for very small jump magnitude
- for consistent estimation of the number and locations of multiple change points in data

- Procedures (for each aspect)
    - prepare dataframe for change point detection
        - drop duplicates on sentence
        - sort by date
        - filter data by the aspect
        - aggregate the sentence sentiment scores by each review => get mean sentiment score for each review
        - aggregate the review-level mean sentiment score by date => get mean sentiment score for each day
    - using wild binary segmentation algorithm to detect change points from date-review-level sentiment scores.
        - sample (room-0):
        - ![](https://i.imgur.com/eh5ZHA9.png)
        -  the reviews for **room** in the first time period (from 2015-01-01 to 2018-10-21) are the most positive, then the reviews are the most negative in the second time period (from 2018-10-23 to 2019-04-09), and in the third time period they become more positive (from 2019-04-11 to 2020-03-12).
        - exponentially moving average 
            - reflect the change points detected by wild binary segmentation algorithm
        - ![](https://i.imgur.com/9OFnj0X.png)
        
        
### Selection of the reviews
        
- for each time period, we sample (10 or less) reviews whose sentiment scores are representative of the mean sentiment scores in that time period

- for example, in this case, suppose the mean score in time period 2 is x, the sentiment scores of the sampled reviews in that time period are all lower than x, since the mean sentiment of the reviews compared to the time period 1 is much more negative. On the contrary, suppose that the mean score in time period 3 is y, all the sampled reviews in time period are higher than y, since the mean sentiment of the reviews compared to time period 2 is much more positive.
    