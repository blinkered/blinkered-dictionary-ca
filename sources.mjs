/**
 * The collections that attest Catalan, and where each comes from.
 *
 * Catalan has a 46,841-word candidate list against a 1.4GB Wikipedia, one of the largest for a
 * language its size. Expect the ceiling to be set by the small families rather than by volume.
 *
 * Every URL here was probed before it was written down. A collection that 404s does not fail
 * loudly — the build skips it with a warning and reports a healthy number over fewer families.
 *
 * There is no Catalan Bible on eBible, so this language has no religious family.
 */
import { createReadStream, existsSync, readFileSync, readdirSync } from 'node:fs'
import { createInterface } from 'node:readline'
import {
  fileDocuments,
  gutenbergBody,
  harvestDocuments,
  leipzigLocators,
  leipzigSentences,
  tatoebaDocuments,
  wikiDocuments,
} from '@blinkered/attestation'

export const LANGUAGE = 'ca'

const CACHE = new URL('.cache/raw/', import.meta.url).pathname

/** A Leipzig package, with its sentence-to-URL index resolved up front. */
function leipzig(pkg) {
  const base = `${CACHE}${pkg}/${pkg}`
  const locators = leipzigLocators(
    readFileSync(`${base}-inv_so.txt`, 'utf8'),
    readFileSync(`${base}-sources.txt`, 'utf8'),
  )
  const lines = createInterface({
    input: createReadStream(`${base}-sentences.txt`),
    crlfDelay: Infinity,
  })
  return leipzigSentences(lines, locators)
}

// News only. The Leipzig Wikipedia packages are deliberately absent: they are Wikipedia text
// wearing a Leipzig label, so including one would corroborate `wiki:ca` while looking
// like another family. That is the exact failure the three-families rule exists to catch.
const LEIPZIG = [
  'cat_news_2022_300K',
  'cat_newscrawl_2016_1M',
]

const ALL = [
  {
    id: 'wiki:ca',
    what: 'Catalan Wikipedia — modern encyclopedic prose',
    needs: `${CACHE}cawiki.xml.bz2`,
    documents: () => wikiDocuments(`${CACHE}cawiki.xml.bz2`),
  },
  {
    id: 'wikisource:ca',
    what: 'Catalan Wikisource — same Wikimedia family, so it corroborates rather than counts',
    needs: `${CACHE}cawikisource.xml.bz2`,
    documents: () => wikiDocuments(`${CACHE}cawikisource.xml.bz2`),
  },
  ...LEIPZIG.map((pkg) => ({
    id: `lz:${pkg}`,
    from: `https://downloads.wortschatz-leipzig.de/corpora/${pkg}.tar.gz`,
    what: `Leipzig ${pkg} — modern news, cited by the page each sentence came from`,
    needs: `${CACHE}${pkg}`,
    documents: () => leipzig(pkg),
  })),
  {
    id: 'tat',
    from: 'https://downloads.tatoeba.org/exports/per_language/cat/cat_sentences.tsv.bz2',
    what: 'Tatoeba Catalan — contemporary and conversational',
    needs: `${CACHE}cat_sentences.tsv`,
    documents: () => tatoebaDocuments(`${CACHE}cat_sentences.tsv`),
  },
  {
    id: 'gut',
    from: 'https://www.gutenberg.org/cache/epub/feeds/pg_catalog.csv',
    what: 'Project Gutenberg Catalan',
    needs: `${CACHE}gutenberg-ca`,
    documents: () => {
      const dir = `${CACHE}gutenberg-ca`
      const books = readdirSync(dir)
        .filter((file) => file.endsWith('.txt'))
        .map((file) => ({ locator: file.replace('.txt', ''), path: `${dir}/${file}` }))
      return fileDocuments(books, async (path) => gutenbergBody(readFileSync(path, 'utf8')))
    },
  },
  {
    id: 'ia',
    // Scanned books are OCR, and OCR fails in a way that looks like text. Clean Gutenberg scores
    // a median 52% known words and never below 36%; the worst of these scored 1%, an English
    // book read as Cyrillic. Below this floor a book is not legible enough to attest anything.
    legible: 0.35,
    // The floor is not enough here. Catalan and Spanish share enough spelling that a Spanish
    // book clears it: one Spanish self-help title scored 37% against these candidates. So the
    // shelf was screened before it was read, by the share of a book's words that are Catalan
    // candidates and neither Spanish nor French ones; Gutenberg's Catalan scores 57% and up,
    // Spanish books under 12% and Spanish-Catalan dictionaries between the two. A book under
    // 30% was moved to `rejected.tsv`: 50 of the first 165.
    what: 'Internet Archive Catalan books — literature, and the register a newspaper never reaches',
    needs: `${CACHE}archive-ca`,
    from: 'https://archive.org/search?query=mediatype%3Atexts+AND+%28language%3A%22Catalan%22+OR+language%3A%22cat%22%29',
    documents: () => {
      const dir = `${CACHE}archive-ca`
      // A locator names the text, not the item: the catalogue page holds no word of the book.
      const named = new Map(
        readFileSync(`${dir}/files.tsv`, 'utf8')
          .split('\n')
          .filter(Boolean)
          .map((line) => line.split('\t')),
      )
      const books = readdirSync(dir)
        .filter((file) => file.endsWith('.txt'))
        .map((file) => file.replace('.txt', ''))
        .filter((id) => named.has(id))
        // Percent-encoded: two thirds of Archive filenames contain spaces, and the evidence
        // format spends spaces as separators.
        .map((id) => ({
          locator: `${id}/${encodeURIComponent(named.get(id))}`,
          path: `${dir}/${id}.txt`,
        }))
      return fileDocuments(books, async (path) => readFileSync(path, 'utf8'))
    },
  },
]

export const SOURCES = ALL.filter((source) => {
  if (source.needs === undefined || existsSync(source.needs)) return true
  process.stderr.write(`  (skipping ${source.id}: ${source.needs} is not in .cache/raw)\n`)
  return false
})

/**
 * Catalan publishers, for the harvest.
 *
 * Chosen because they publish in Catalan rather than because they are large. A harvester
 * reads whatever it fetches and has no idea what language it is in, and most of what Barcelona
 * publishes is in Spanish; a bilingual paper's Spanish edition would attest Spanish forms that
 * happen to be Catalan candidates. So these are Catalan-language outlets, and the first group is
 * literary for the register the dailies never reach; it goes first because an interrupted
 * harvest keeps what it reached first.
 */
export const DOMAINS = [
  'escriptors.cat', 'visat.cat', 'vilaweb.cat', 'ara.cat',
  'naciodigital.cat', '3cat.cat', 'elnacional.cat', 'directe.cat',
  'eltemps.cat', 'social.cat',
]

export const HARVEST = existsSync(new URL('searched.tsv', import.meta.url).pathname)
  ? () => harvestDocuments(new URL('searched.tsv', import.meta.url).pathname)
  : undefined

/** Carried over from Blinkered's calibration; must be re-measured before anything ships. */
export const COMMON_CUT = 17000
