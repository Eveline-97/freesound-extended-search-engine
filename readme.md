# Freesound extended search engine
<https://evelinevervliet.com/freesound>

I worked on this project on and off in 2023 and 2024 for individual purposes. Since I use Freesound regularly for my compositions, I wanted to more efficiently browse the library making use of pitch and timbral sonic qualities, options that the Freesound API provides. It is not meant to be a full-fledged alternative to Freesound's own search engine but can be used in addition to it. The site also offers limited live jam options.

For the moment, the site does not provide a download option, however there is a link to every audio file's Freesound upload from which it can be downloaded.

Makes use of [g-roma's](https://github.com/g-roma) [JS client for the freesound.org API](https://github.com/g-roma/freesound.js).

**Tonalities with sharps are currently causing errors with Freesound API searches and have therefore been disabled, see [issue #1](https://github.com/Eveline-97/freesound-extended-search-engine/issues/1).**

## Installation

Before use, you need to make a [Freesound account](https://freesound.org/) and request a unique [API key](https://freesound.org/apiv2/apply/) which you'll use for making requests to the Freesound API. Read the Freesound API terms of use [here](https://freesound.org/docs/api/terms_of_use.html).

When making a lot of requests you might encounter an error, this is to do with API limits:
> The usage of the APIv2 is limited to certain usage rates. The standard usage rate is set to 60 requests per minute and 2000 requests per day. [...] If a request is throttled, the APIv2 will return a 429 Too many requests response error with a detail field indicating which rate limit has been exceeded.

I have therefore programmed a limit of 60 sound results per request.

You can either download and run the code on a local server or use [this website](https://evelinevervliet.com/freesound). My site does not store any of the data you type in, so your api key is safe. However, this also means you'll have to resubmit the key with each new session.

## Issues

Feel free to contact me with suggestions for further development or open an issue in this repo.

Still on my **to-do list**:
- [x] Search for loopable files and play all sounds in loop
- [ ] Alternative audio element with better control for individual tracks
- [ ] Improve general UI
- [ ] Multiple page results