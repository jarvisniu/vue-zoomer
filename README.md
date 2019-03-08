# vue-zoomer

Zoom the image or other thing with mouse or touch

# Demo

- [Single Image](https://unpkg.com/vue-zoomer/demo/basic.html)
- [Gallery](https://unpkg.com/vue-zoomer/demo/gallery.html)

# Usage

Install:
```
npm install vue-zoomer
```

Import:
```js
import Vue from 'vue'
import VueZoomer from 'vue-zoomer'
import 'vue-zoomer/dist/vue-zoomer.css'

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

# API

> `out` means the prop is a child -> parent one-way binding. So there must have a `.sync` modifier.

## &lt;v-zoomer&gt; Props

- `maxScale: number` - Maximum scale limit, default is 1;
- `minScale: number` - Minimum scale limit, default is 5;
- `zoomed: out boolean` - Whether zoomed in (scale equals to 1);

## &lt;v-zoomer-gallery&gt; Props

- `list: Array<string> required` - Displaying image urls;
- `v-model(value): number required` - Index of current showing image;

# License

MIT
