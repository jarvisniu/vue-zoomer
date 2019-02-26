# vue-zoomer

Zoom the image or other thing with mouse or touch

# Usage

```html
  <div id="app">
    <div style="width: 100vw; height: 100vh;">
      <vue-zoomer style="width: 100%; height: 100%;">
        <img src="./assets/landscape-1.jpg" style="object-fit: contain; width: 100%; height: 100%;">
      </vue-zoomer>
    </div>
  </div>

  <script>
    Vue.use(VueZoomer.default)

    new Vue({
      el: '#app',
    })
  </script>
```

# License

MIT
