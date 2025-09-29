<template>
<div class="map" ref="map"></div>
</template>

<script>
let map;

export default {
  name: "MapComponent",
  mounted() {
    this.pageLoaded()
  },
  props: {
    center: {
      type: Array,
      default: () => [103.75254, 37.06996]
    },
    zoom: {
      type: Number,
      default: () => 3.3
    },
  },
  watch: {
    center() {
      map.flyTo({center: this.center, zoom: this.zoom});
    },
    zoom() {
      map.flyTo({center: this.center, zoom: this.zoom});
    }
  },
  methods: {
    pageLoaded() {
      const dom = this.$refs.map
      const style = {
        name: 'my-style',
        version: 8,
        sources: {
          'amap-vec': {
            type: 'raster',
            "scheme": "xyz",
            "tileSize": 256,
            tiles: [
              'https://webrd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8',
              'https://webrd02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8',
              'https://webrd03.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8',
              'https://webrd04.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8',
            ]
          }
        },
        layers: [
          {
            id: 'amap-vec',
            type: 'raster',
            source: 'amap-vec',
            paint: {
              'raster-opacity': 0.1
            }
          }
        ]
      }
      map = new mapboxgl.Map({
        container: dom, // container ID
        style,
        center: this.center, // starting position [lng, lat]
        zoom: this.zoom, // starting zoom
        doubleClickZoom: true,
        dragPan: true,
        hash: false,
        attribute: false
      });
      map.on('load', () => {
        this.$emit('map-loaded', map)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.map {
  width: 100%;
  height: 100%;
}
</style>