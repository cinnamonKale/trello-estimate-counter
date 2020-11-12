# Trello estimate counter

Because math is hard.

## What it does

It takes the first custom field in a selected board, then adds all the values in
a list together. The custom field is assumed to be for hours estimates.

## Set up

Create a `.env` file with the following keys:

+ REACT_APP_TRELLO_KEY
+ REACT_APP_TRELLO_TOKEN

You can get these from https://trello.com/app-key

## Security

Don't run this on a shared environment like a server. This currently stores your token and key on the client side. Run it locally only.
