# Fira Mono Nerd Font web assets

## Provenance and conversion

These are the **standard** `FiraMonoNerdFont` Regular (400), Medium (500), and
Bold (700) faces, not `FiraMonoNerdFontMono` or `FiraMonoNerdFontPropo`. The
owner supplied the OTF archive extracted at `/tmp/FiraMono`. Its README
identifies Nerd Fonts **3.5.1**, based on Fira Mono **3.206**; the embedded font
version strings confirm both versions. Upstream release:
<https://github.com/ryanoasis/nerd-fonts/releases/tag/v3.5.1>.

Only the container format changed. Google `woff2_compress` **1.0.2** converted
copies of the OTF files; the owner's originals were not modified. No subsetting,
glyph deletion, outline editing, renaming, or feature stripping was performed.
Each face retains **12,372 glyphs** and **12,237 Unicode cmap entries**,
including Nerd Font icons. FontTools 4.65.0 verified equal glyph order and
byte-identical OpenType tables except `head` (WOFF2 checksum/flag
normalization); `cmap`, `CFF `, `hmtx`, `name`, and layout tables are preserved.

Reproduce with `woff2_compress` on copies in a separate working directory:

```sh
for weight in Regular Medium Bold; do
  cp /path/to/FiraMono/FiraMonoNerdFont-$weight.otf .
  woff2_compress FiraMonoNerdFont-$weight.otf
done
```

### SHA-256

| Face    | Input OTF                                                          | Output WOFF2                                                       | Output bytes |
| ------- | ------------------------------------------------------------------ | ------------------------------------------------------------------ | -----------: |
| Regular | `8e517ae013de19f5ac094ec412bd37bae5bc60b25dc8cf9ffa91db9df7d773c1` | `d75de06ed7a441f92a1b65e9b6d77757225ed2fd242045192b1500b4ce254ba0` |      1195328 |
| Medium  | `c08fa15b2ddadfbe42a5b70c18d3bb55be0ef040d3fa72776eee785c880fc28e` | `ed979bd056261d3b4891a28fe5222350a49d922f5737a6db34beddb9f29a834f` |      1191344 |
| Bold    | `a63b9130003d29ae740e4aa3ac74e5ba44ab51d6e4cbd16dac239ee19b48036d` | `16bac0d6c65d895ee6427403a175b182c9d7d34aad552900b12b977b7a6dca8e` |      1197192 |

## Licensing and icon provenance

- `LICENSE` and `UPSTREAM-README.md` are verbatim copies from the supplied
  archive, including Mozilla/Telefonica's copyright and the complete icon-source
  attribution/version/license table. Embedded notices are also preserved.
- `NERD-FONTS-LICENSE` is the verbatim
  [Nerd Fonts 3.5.1 root license](https://github.com/ryanoasis/nerd-fonts/blob/v3.5.1/LICENSE).
  It explicitly places patched fonts and folders with explicit OFL files under
  SIL OFL 1.1. The supplied Fira Mono license has no Reserved Font Name
  declaration; the
  [release audit](https://github.com/ryanoasis/nerd-fonts/blob/v3.5.1/license-audit.md)
  likewise identifies Fira as `OFL-1.1-no-RFN`. OFL permits embedding,
  conversion, and redistribution with its notices and conditions. These assets
  remain under OFL, not the site's application license.
- This does **not** mean every original icon project is OFL. The archive lists
  MIT, CC BY 4.0, Apache 2.0, and OFL icon sources. Keep its attribution table
  together with the patched font and upstream licensing declaration.
- The archive and audit label Font Logos "unlicensed". Investigation of the
  actual
  [Font Logos v1.3.0 LICENSE](https://github.com/lukas-w/font-logos/blob/v1.3.0/LICENSE)
  found the **Unlicense**, explicitly allowing copying, modification,
  publishing, and redistribution. `FONT-LOGOS-LICENSE` preserves that text
  verbatim. This is not an absent license or a discovered redistribution
  blocker. Logo trademark rights are separate; shipping glyphs does not imply
  endorsement.

This records the upstream distribution terms and the specific ambiguous icon
entry investigated, not a legal audit of every icon's authorship history.

## Integration and size policy

`src/styles/fonts.css` defines the three local faces with `font-display: swap`.
The site imports it through `global.css`; the isolated editor imports only that
font stylesheet, not the site's reset. BaseLayout's existing Regular/Bold
preloads point to these files; Medium loads on demand. Monaco and preview code
use the same family, with programming ligatures explicitly disabled. Monaco
remeasures its font metrics after loading. Editor UI and prose retain their
existing system typography. No font CDN was added; existing editor library CDNs
and Monaco's own UI icon font are unrelated and unchanged.

Font sizes and line heights stay unchanged (site body 19px, code 16px, Monaco
14px/23px). Fira Code's x-height/em was 1053/1950 = 0.54 versus Fira Mono's
527/1000 = 0.527; character advance/em was about 0.615 versus 0.6. These metrics
do not justify a blind 2–3px reduction. Omnews/Inconsolata is outside this
change.

Full glyph preservation costs about **1.2 MB per face**, versus roughly 100 KB
per old Fira Code face. The existing two preloads now total about 2.39 MB. This
is an explicit full-font tradeoff, not a subset optimized for Latin text.

Run `npm run test:fonts` for asset hashes and integration guards, and
`npm run test:editor` against the running site for browser regressions.
