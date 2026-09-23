# Blinkered dictionary: Catalan

The Catalan word list, and the evidence for every word in it.

Built by [`blinkered-attestation`](https://github.com/blinkered/blinkered-attestation). The rule,
the evidence format and the reasoning live there; what lives here is Catalan.

**36,799 of 46,841 candidates proved (78.6%)**, across 14 independent families, 13 of which a
stranger could check by fetching.

## What is in this repository

```
sources.mjs        which collections attest Catalan, and why those
ATTESTATIONS.tsv   the evidence: every candidate, what saw it, and where
searched.tsv       the harvest: which candidates each fetched page held, as counts
words.txt          what survived, in Blinkered's own format
dropped.tsv        what did not, and how close it came
SATURATION.md      what each family was worth, measured from the evidence
COLLECTIONS.md     every collection read, and where to get it again
status.json        the numbers, whether this ships, and what the list is under
```

`.cache/` holds the downloaded collections and is not tracked. Everything here is regenerable
with `pnpm build`.

## Where the words come from

Candidates come from Blinkered's Catalan list, which lives in
[`blinkered-attestation/candidates/ca`](https://github.com/blinkered/blinkered-attestation/tree/main/candidates/ca).
The dictionaries that built it are demoted to **proposing words worth looking up**. What earns a
word its place here is evidence that it occurs in the world: three independent collections, each
recorded with a locator somebody else can fetch.

The families are Catalan Wikipedia and Wikisource (one Wikimedia family), two Leipzig news
packages (`cat_news_2022_300K` and `cat_newscrawl_2016_1M`, one Leipzig family), Tatoeba, 94
Project Gutenberg texts, 605 Internet Archive books, and nine Catalan-language publishers
harvested directly, each its own family. There is no Catalan Bible on eBible.

`SATURATION.md` says what each family was worth. `COLLECTIONS.md` names every collection read and
where to get it again, which is what makes the downloads disposable.

## What is particular to Catalan

**Wikipedia is enormous and the rest is small.** The Wikipedia is 278 million tokens; the next
biggest collection, the Archive shelf, is 44 million. Three families take the list to 67.2% and
Gutenberg adds ten points more; after that every family adds a hundred words or so. The 5,816
words that came within one family of surviving are mostly inflected verb forms (ABAIXI,
ABANDONARIES, ABATRA), and four in five of them were seen by the Wikipedia and the Archive shelf
and nothing else.

**The Archive shelf needed screening for Spanish, and the legibility floor did not do it.** The
Archive's `language:Catalan` metadata returns Spanish books, bilingual dictionaries and a
Moroccan exam notice alongside Catalan ones. Catalan and Spanish share enough spelling that a
Spanish book can clear the 35% legibility floor against Catalan candidates; one Spanish self-help
title scored 37%. So before the shelf was read, each book was scored by the share of its words
that are Catalan candidates and neither Spanish nor French candidates. Gutenberg's Catalan texts
score 57% and up, Spanish books under 12%. Books under 30% were set aside in the shelf's
`rejected.tsv`: 203 of 808.

**The fold keeps Ç and drops the interpunct.** COL·LEGI folds to COLLEGI, and ABRAÇAR keeps its
cedilla. Every tile in the engine's alphabet appears in some shipped word, Ç in 413 of them.

**What else might leak in.** Of the shipped words, 9,428 are also Spanish candidates and 3,920
English ones. Reading the top four hundred, every shared word is a Catalan word that happens to be
spelled like one elsewhere: POR is fear, CON and MAS are Catalan nouns, NOMBRE is a number. No
publisher stood out: for each of the seven harvested sites that contributed more than a few
hundred words, between 58% and 64% of what it contributed is Catalan-only, which is the profile of
a site writing Catalan.

## Rebuilding

```
pnpm install
pnpm build        # reads whatever collections are in .cache/raw, reuses the record for the rest
pnpm conform      # the list says only what the evidence supports
pnpm saturation   # recomputes the curve and status.json
```

A collection that is not on disk is skipped with a warning and its recorded testimony is reused,
so a rebuild after more books arrive is short rather than a re-read of everything.

## Before this ships

`COMMON_CUT` in `sources.mjs` is carried over from Blinkered's old calibration against a
differently sized list. It has to be re-measured before this list reaches the game, and
`status.json` says `ships: "pending"` until somebody decides otherwise.

## Licensing

Three kinds of thing live here and they do not share terms. The distinction is the project: a
licence that claimed more than we can support would undo the argument the evidence is here to
make. [NOTICE](NOTICE) is the authority; this is the summary.

| | terms | what |
| --- | --- | --- |
| **Code and docs** | [Apache-2.0](LICENSE) | `build.mjs`, `sources.mjs`, `harvest.mjs`, `conform.mjs`, `saturation.mjs`, and the Markdown |
| **The list and its evidence** | [CC0-1.0](https://creativecommons.org/publicdomain/zero/1.0/) | `words.txt`, the evidence, `status.json`, `SATURATION.md`, `COLLECTIONS.md`, `searched.tsv` |
| **The words we could not prove** | `LGPL-2.1-or-later` | `dropped.tsv`, **not ours to license** |

**Why the list is CC0.** A word ships because three independent collections of text were found to
contain it. The record of which collections, and where in them, is a statement of fact about those
texts rather than a copy of them, and nothing a licence governs was taken from the dictionary that
proposed the candidates.

**Why `dropped.tsv` is not.** It is the candidates that failed, and a candidate that failed is a
word we have nothing to say about except that somebody's dictionary proposed it. That makes the
file a subset of that dictionary and it carries that dictionary's terms; here `LGPL-2.1-or-later`.
