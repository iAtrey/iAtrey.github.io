# Atrey Iyer — Personal Website

A personal academic-portfolio website built on the
[Academic Pages](https://github.com/academicpages/academicpages.github.io) Jekyll template
(a fork of [Minimal Mistakes](https://github.com/mmistakes/minimal-mistakes)) and hosted free
on **GitHub Pages**.

## Where the content lives

The site keeps content in structured Markdown files; the template turns them into pages.

| Page | File(s) to edit |
|---|---|
| Home / bio | [`_pages/about.md`](_pages/about.md) |
| Site title, your name, sidebar info & social links | [`_config.yml`](_config.yml) (the `author:` block) |
| Header menu | [`_data/navigation.yml`](_data/navigation.yml) |
| Projects | files in [`_portfolio/`](_portfolio) |
| Publications | files in [`_publications/`](_publications) |
| Tutoring / Teaching | files in [`_teaching/`](_teaching) |
| CV | [`_pages/cv.md`](_pages/cv.md) |

To add a new project/publication, copy an existing file in that folder and edit its front matter.

### A few things to fill in
- **Profile photo:** the sidebar uses `images/profile.png` (currently the template's placeholder
  headshot). Replace that file with your own photo, or change the `avatar:` field in `_config.yml`.
- **Social links:** add your `github`, `linkedin`, etc. usernames in the `author:` block of
  `_config.yml` to make those icons appear in the sidebar. Your email is already set.
- **Publications:** the two entries in `_publications/` use approximate dates — update the
  `date:` and `title:` to the exact details when you have them.

## How to deploy on GitHub Pages

1. Create a GitHub repository named **`<your-username>.github.io`**.
2. Push the contents of this folder to that repo on the `main` branch.
3. **Settings → Pages → Source: "Deploy from a branch"**, branch `main`, folder `/ (root)`.
4. Update the `url` and `repository` fields in [`_config.yml`](_config.yml) to match.
5. Your site goes live at `https://<your-username>.github.io`.

## Run locally (optional)

```bash
bundle install
bundle exec jekyll serve
# then open http://localhost:4000
```
