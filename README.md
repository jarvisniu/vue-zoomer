# vue-zoomer

Zoom the image or other thing with mouse or touch

# Demo

https://unpkg.com/vue-zoomer/demo/stand-alone.html

# Usage

Install:
```
npm install vue-zoomer
```

Import:
```js
import Vue from 'vue'
import VueZoomer from 'vue-zoomer'

Vue.use(VueZoomer)
```

Use:
```html
<v-zoomer style="width: 500px; height: 500px; border: solid 1px silver;">
  <img
    src="./assets/landscape-1.jpg"
    style="object-fit: contain; width: 100%; height: 100%;"
  >
</v-zoomer>
```

# API: Props

> `out` means the prop is a child -> parent one-way binding.
> So it must be uses with a `.sync` modifier.

- `maxScale: number` - Maximum scale limit, default is 1;
- `minScale: number` - Minimum scale limit, default is 5;
- `zoomed: out boolean` - Whether zoomed out (scale equals to 1);

# License

MIT
