# live-photo-component

**A small Web Component for playing and recognizing Live Photos.**

`live-photo-component` renders an Apple-style Live Photo from a cover image and
video, then adds browser-side detection for original files:

- Android and vendor Motion Photos stored as one file
- Apple Live Photos exported as an image plus a paired MOV/MP4
- Conventional image/video pairs with matching file names

It has no runtime dependencies, works with plain HTML or any framework, and
keeps detection and video extraction in the browser.

> 中文：一个零运行时依赖的实况照片 Web Component。支持播放现有图片 +
> 视频，也支持在浏览器中识别安卓单文件动态照片与 Apple 双文件实况照片。

> Also known as / 也被称为：LivePhoto Web Component · Live Photo player ·
> Apple Live Photo viewer · Android Motion Photo viewer · 实况照片 / 动态照片组件

![Live Photo preview](demo.gif)

## Download the version that matches your media

There are two npm workflows. `1.2.x` remains backward-compatible with the
`photo` + `video` player API from `1.0.0`, but it adds original-file
recognition. Choose based on how your media reaches the page.

For a simple choice, use the npm tags `manual` and `latest`. Releases
`1.1.0`–`1.1.3` were transitional builds and are deprecated; existing installs
remain available, but new projects should choose one of the two supported
entries below.

| Version | Main capability | Use it when | What your page receives | UI you need to build | How you use it | Install |
| --- | --- | --- | --- | --- | --- | --- |
| [`1.0.0`](https://www.npmjs.com/package/live-photo-component/v/1.0.0) (`manual`) | Plays an existing cover-image and video pair | Your CMS, database, or API already stores a cover image URL and an MP4/MOV URL separately | Two URLs: `photo` and `video` | Only the `<live-photo>` player | Set `<live-photo photo="…" video="…">` | `npm install live-photo-component@manual` |
| [`1.2.x`](https://www.npmjs.com/package/live-photo-component) (`latest`) | Plays existing URL pairs, recognizes original phone Live Photos, and includes a ready-to-use upload UI | Users upload files directly from Android or iPhone; use it for new upload features | Android: one original Motion Photo file. Apple: the original image and paired MOV/MP4 selected together | Nothing for the basic flow: `<live-photo-uploader>` includes picker, status, errors, and preview. Build your own UI only for a custom flow. | Add `<live-photo-uploader>`; use `load()` / `detectAll()` only for advanced custom UI | `npm install live-photo-component@latest` |

### 1. Existing image + video: install `1.0.0`

Use this version if your backend, CMS, or database already gives you two URLs:
one cover image and one video. Supply them through the `photo` and `video`
attributes yourself.

```bash
npm install live-photo-component@1.0.0
```

Source branch: [`manual-photo-video`](https://github.com/Feirobot/live-photo-component/tree/manual-photo-video).

### 2. Original phone Live Photos: install `1.2.x` (recommended for new uploads)

Use the newest version when users upload original files from a phone. It keeps
the manual `photo` + `video` player API, and additionally provides `load()`,
`detect()`, and `detectAll()`:

- **Android / Google / vendor Motion Photos:** one original image file that
  contains its motion video.
- **Apple Live Photos:** select the original image and its matching MOV/MP4
  file together; pairing uses `ContentIdentifier`, with filename matching as a
  fallback.

```bash
npm install live-photo-component@latest
# Equivalent: npm install live-photo-component
# Pin the exact release if you prefer: npm install live-photo-component@1.2.0
```

Source branch: [`main`](https://github.com/Feirobot/live-photo-component/tree/main).

#### Easiest upload UI: one HTML element

For the common “choose files, recognize, and preview” flow, no custom upload
UI or JavaScript is required:

```html
<live-photo-uploader label="Choose a Live Photo" width="720"></live-photo-uploader>
```

The built-in UI provides the button, Android/Apple selection hint, loading
state, recognition error, and `<live-photo>` preview. To upload the recognized
originals to your server after success, listen for one event:

```js
document.querySelector('live-photo-uploader').addEventListener(
  'live-photo-uploader:detected',
  ({ detail }) => {
    // detail.photo, detail.video, detail.protocol, detail.sourceFiles
    console.log('Ready to upload:', detail.sourceFiles);
  }
);
```

The uploader also emits `live-photo-uploader:change` when files are selected
and `live-photo-uploader:error` when recognition fails.

#### Advanced: build your own file picker UI

Use the lower-level API below only when you want full control of the picker,
progress display, and surrounding page design.

### Other maintained branch

[`wordpress-plugin`](https://github.com/Feirobot/live-photo-component/tree/wordpress-plugin)
keeps the legacy WordPress plugin implementation. It is not an npm release
line; use it only for an existing WordPress plugin integration.

## What it does

| Use case | Result |
| --- | --- |
| Existing `photo` + `video` URLs | Renders an interactive `<live-photo>` element |
| Android Motion Photo | Extracts the cover and embedded MP4/MOV locally |
| Apple image + MOV/MP4 | Pairs files using `ContentIdentifier`, then filename as a fallback |
| Multiple source files | Finds every complete Live Photo with `detectAll()` |
| Touch devices | Long-press to play; tap the LIVE badge when long-press is unreliable |

Desktop users can hover the LIVE badge. Video is muted by default, uses
`playsinline`, and the component emits explicit events when detection or
playback fails.

## Install

### From npm

```bash
npm install live-photo-component
```

Then import the element and its stylesheet:

```js
import 'live-photo-component';
import 'live-photo-component/styles.css';
```

The released npm package is available as
[`live-photo-component`](https://www.npmjs.com/package/live-photo-component).
The current `latest` release is `1.2.1` and includes native detection and the
ready-to-use uploader UI.

### From a CDN (no build step)

```html
<link rel="stylesheet" href="https://unpkg.com/live-photo-component@1.2.1/dist/styles.css">
<script src="https://unpkg.com/live-photo-component@1.2.1/dist/live-photo.umd.js"></script>

<live-photo photo="/images/cover.jpg" video="/videos/moment.mp4" muted></live-photo>
```

The UMD build registers both `<live-photo>` and `<live-photo-uploader>`, and it
loads `live-icon.png` from its own folder automatically — the two tags above are
all you need. The stylesheet is not injected by the script, so keep the `<link>`.

**Pin the version in production.** An unversioned URL
(`.../live-photo-component/dist/...`) follows the npm `latest` tag and would pick
up future major releases silently. [jsDelivr](https://www.jsdelivr.com/) serves
the same files and is usually faster in mainland China:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/live-photo-component@1.2.1/dist/styles.css">
<script src="https://cdn.jsdelivr.net/npm/live-photo-component@1.2.1/dist/live-photo.umd.js"></script>
```

For the player-only release, replace `@1.2.1` with `@1.0.0`.

## Play a Live Photo

```html
<live-photo
  photo="/images/cover.jpg"
  video="/videos/moment.mp4"
  width="720"
  radius="12"
  muted>
</live-photo>
```

| Attribute | Default | Description |
| --- | --- | --- |
| `photo` | — | Cover image URL |
| `video` | — | Video URL |
| `width` | `600` | Maximum width; numbers are pixels and CSS lengths also work |
| `muted` | `true` | Mutes the video unless set to `"false"` |
| `autoplay` | `false` | Plays once after the element enters the viewport |
| `radius` | `8` | Corner radius in pixels |
| `loop` | `false` | Loops playback instead of returning to the cover |

```js
const livePhoto = document.querySelector('live-photo');

livePhoto.play();
livePhoto.pause();
console.log(livePhoto.isPlaying());

livePhoto.addEventListener('live-photo:error', ({ detail }) => {
  console.error(detail.code, detail.error);
});
```

## Recognize original files

Use one multiple-file picker. An Android Motion Photo normally needs only one
selected file; an Apple export normally needs both the image and its paired
MOV/MP4 selected together.

```html
<input id="live-input" type="file" multiple
  accept="image/jpeg,image/heic,image/heif,image/avif,video/mp4,video/quicktime,.mov,.heic,.heif,.avif">

<live-photo id="preview" width="720" muted></live-photo>

<script type="module">
  import 'live-photo-component';
  import 'live-photo-component/styles.css';

  const input = document.querySelector('#live-input');
  const preview = document.querySelector('#preview');

  input.addEventListener('change', async () => {
    try {
      const result = await preview.load(input.files);
      console.log(result.protocol, result.confidence, result.match);
    } catch (error) {
      console.error(error.code, error.message);
    }
  });
</script>
```

`load()` detects exactly one Live Photo, assigns temporary object URLs to the
element, and revokes its previous URLs when a new selection is loaded.

For a batch picker, import the class and inspect results without changing a
preview element:

```js
import LivePhotoElement from 'live-photo-component';

const results = await LivePhotoElement.detectAll(fileInput.files);
for (const result of results) {
  console.log(result.protocol, result.photo, result.video);
}
```

### Detection result

```js
{
  kind: 'live-photo',
  protocol: 'google-motion-photo', // or apple-live-photo, samsung-motion-photo…
  photo: Blob,
  video: Blob,
  confidence: 'high',              // high | medium | low
  match: 'embedded-video',         // content-identifier | filename | only-pair
  contentIdentifier: '...',
  sourceFiles: [File]
}
```

## Detection support and limits

| Source format | Detection | Notes |
| --- | --- | --- |
| Google / Android Motion Photo | Yes | Reads the video embedded in the original image file |
| Samsung, HUAWEI, OPPO variants | Yes | Detected from their embedded media and metadata markers |
| Apple HEIC/JPG + MOV | Yes | Prefers a shared `ContentIdentifier` |
| Apple exports renamed after transfer | Usually | Falls back to matching base names |
| A single flattened iOS still image | No | The paired video is absent and cannot be recovered |

Detection is not transcoding. Original Apple HEIC and HEVC/MOV media may not
decode in Chrome on Windows or Android. For a universal published preview,
retain the originals if you need them, but generate a JPEG/WebP cover and an
H.264 MP4 playback derivative on your server.

## Events

| Event | When it fires |
| --- | --- |
| `live-photo:ready` | The element has initialized |
| `live-photo:play` | Video playback starts |
| `live-photo:pause` | Video playback stops |
| `live-photo:detected` | `load()` successfully recognizes a Live Photo |
| `live-photo:error` | Detection, video loading, or playback fails |

`live-photo:error` includes an actionable `detail.code`, such as
`LIVE_PHOTO_NOT_DETECTED`, `PLAYBACK_FAILED`, or `VIDEO_LOAD_FAILED`.

## Frameworks

The component is a standard Custom Element. Import it once in your client
entry point, then use `<live-photo>` in React, Vue, Astro, WordPress, Hugo, or
plain HTML.

```jsx
import 'live-photo-component';
import 'live-photo-component/styles.css';

export function Moment({ photo, video }) {
  return <live-photo photo={photo} video={video} width="100%" muted="true" />;
}
```

For server-rendered React frameworks, import the package only from a client
component or client-side entry point.

## Development

```bash
npm install
npm test
npm run build
npm run demo
```

The demo is served at `http://localhost:3000/demo/` by default.

## Project layout

```text
src/
  live-photo.js            Custom Element and public API
  live-photo-detector.js   Apple and Android file recognition
  styles.css               Component styles
test/
  live-photo-detector.test.js
demo/
  index.html
```

## Links

- [GitHub repository](https://github.com/Feirobot/live-photo-component)
- [Chinese introduction](https://openfilm.cc/zh/posts/live-photos-introduction-zh/)
- [English introduction](https://openfilm.cc/en/posts/live-photos-introduction-en/)
- [Changelog](CHANGELOG.md)

## License

[GPL-2.0-or-later](LICENSE)
