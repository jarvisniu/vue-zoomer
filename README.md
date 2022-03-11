# vue-zoomer

> Zoom the image or other thing with mouse or touch

## For Vue 3

This library has released a Vue 3 beta version [here](https://github.com/jarvisniu/vue-zoomer/tree/next).

## Demo

- [Single Image](https://unpkg.com/vue-zoomer/dist/demo/basic.html) -
  [(src)](https://github.com/jarvisniu/vue-zoomer/blob/master/demo/basic/app.vue)
- [Gallery](https://unpkg.com/vue-zoomer/dist/demo/gallery.html) -
  [(src)](https://github.com/jarvisniu/vue-zoomer/blob/master/demo/gallery/app.vue)

## Usage

Install:

```bash
npm install vue-zoomer
```

Import and register globally:

```js
import Vue from 'vue'
import VueZoomer from 'vue-zoomer'

Vue.use(VueZoomer)
```

Import and register locally (after `v0.3.10`):

```html
<!-- page1.vue -->
<script>
import VueZoomer from 'vue-zoomer'

export default {
  components: {
    VZoomer: VueZoomer.Zoomer,
    VZoomerGallery: VueZoomer.Gallery,
  },
}
</script>
```

You can also import the source files (after `v0.3.10`), rather than
the minified umd bundle, for better debugging experience:
```js
import VueZoomer from 'vue-zoomer/src'
```

Single usage:

```html
<v-zoomer style="width: 500px; height: 500px; border: solid 1px silver;">
  <img
    src="./assets/landscape-1.jpg"
    style="object-fit: contain; width: 100%; height: 100%;"
  >
</v-zoomer>
```

Gallery usage:

```html
<v-zoomer-gallery
  style="width: 100vw; height: 100vh;"
  :list="['a.jpg', 'b.jpg', 'c.jpg']"
  v-model="selIndex"
></v-zoomer-gallery>
```

## API

### &lt;v-zoomer&gt; Props

- `maxScale: number` - Maximum scale limit, default is 5;
- `minScale: number` - Minimum scale limit, default is 1;
- `zoomed: out boolean` - Whether zoomed in (scale equals to 1). `out` means the prop is a child to parent one-way binding. So there must have a `.sync` modifier.
- `pivot: 'cursor' | 'image-center'` - The pivot when zoom the content, default is `cursor`, can set to be `image-center`;
- `zoomingElastic: boolean` - Whether to use the elastic effect when reaching the max/min zooming bounds, default is `true`;
- `limitTranslation: boolean` - Whether to limit the content into the container, default is `true`;
- `doubleClickToZoom: boolean` - Whether to zoom in/out the content by double click, default is `true`;
- `mouseWheelToZoom: boolean` - Whether to zoom in/out the content by mouse wheel, default is `true`;

### &lt;v-zoomer&gt; Methods

- `reset()` - Reset the scale and translate to the initial state.
- `zoomIn(scale=2)` - Zoom in.
- `zoomOut(scale=0.5)` - Zoom out.

### &lt;v-zoomer-gallery&gt; Props

- `list: Array<string> required` - Displaying image urls;
- `v-model(value): number required` - Index of current showing image;
- `pivot: 'cursor' | 'image-center'` - Same as above;
- `zoomingElastic: boolean` - Same as above;
- `limitTranslation: boolean` - Same as above;
- `doubleClickToZoom: boolean` - Same as above;
- `mouseWheelToZoom: boolean` - Same as above;

### &lt;v-zoomer-gallery&gt; Methods

- `reset()` - Reset the scale and translate to the initial state.
- `zoomIn(scale=2)` - Zoom in.
- `zoomOut(scale=0.5)` - Zoom out.

## License

MIT
