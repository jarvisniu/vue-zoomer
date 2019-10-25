# vue-zoomer

> Zoom the image or other thing with mouse or touch

## Demo

- [Single Image](https://unpkg.com/vue-zoomer/dist/demo/basic.html)
- [Gallery](https://unpkg.com/vue-zoomer/dist/demo/gallery.html)

## Usage

Install:

```bash
npm install vue-zoomer
```

Import:

```js
import Vue from 'vue'
import VueZoomer from 'vue-zoomer'

Vue.use(VueZoomer)
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
- `limitTranslation: boolean` - Whether to limit the content into the container, default is `true`;
- `doubleClickToZoom: boolean` - Whether to zoom in/out the content by double click, default is `true`;

### &lt;v-zoomer&gt; Methods

- `reset()` - Reset the scale and translate to the initial state.
- `zoomIn(scale=2)` - Zoom in.
- `zoomOut(scale=0.5)` - Zoom out.

### &lt;v-zoomer-gallery&gt; Props

- `list: Array<string> required` - Displaying image urls;
- `v-model(value): number required` - Index of current showing image;
- `pivot: 'cursor' | 'image-center'` - The pivot when zoom the image, default is `cursor`, can set to be `image-center`;
- `limitTranslation: boolean` - Whether to limit the image into the container, default is `true`;
- `doubleClickToZoom: boolean` - Whether to zoom in/out the image by double click, default is `true`;

### &lt;v-zoomer-gallery&gt; Methods

- `reset()` - Reset the scale and translate to the initial state.
- `zoomIn(scale=2)` - Zoom in.
- `zoomOut(scale=0.5)` - Zoom out.

## License

MIT
