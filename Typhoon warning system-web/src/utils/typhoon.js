import { colorDict } from '../utils/const'
import proj4 from 'proj4'

class Geometry {
    constructor(type = 'Point', coordinates = []) {
        this.type = type
        this.coordinates = coordinates
    }
}

class Feature {
    constructor(properties = {}, geometry) {
        this.type = 'Feature'
        this.properties = properties
        this.geometry = geometry
    }
}

class Geojson {
    constructor(features = []) {
        this.type = 'FeatureCollection'
        this.features = features
    }
}

class Typhoon {
    constructor(map, tfbh) {
        this.map = map
        this.tfbh = tfbh
        this.playFlag = 0
        this.playIndex = 0

        // 1.添加数据源
        map.addSource('source-points-' + tfbh, {
            "type": "geojson",
            "data": new Geojson()
        });
        map.addSource('source-lines-' + tfbh, {
            "type": "geojson",
            "data": new Geojson()
        });
        map.addSource('source-circle-' + tfbh, {
            "type": "geojson",
            "data": new Geojson()
        });
        // 2.添加图层
        // 2.1 风圈图层
        map.addLayer({
            id: 'typhoon-circle-' + this.tfbh,
            source: 'source-circle-' + this.tfbh,
            type: 'fill',
            paint: {
                'fill-color': ['get', 'color'],
                'fill-opacity': 0.2
            }
        });
        map.addLayer({
            id: 'typhoon-circle-line-' + this.tfbh,
            source: 'source-circle-' + this.tfbh,
            type: 'line',
            paint: {
                'line-color': ['get', 'color'],
                'line-width': 2
            }
        });
        // 2.2台风路径图层
        map.addLayer({
            id: 'typhoon-path-live-' + this.tfbh,
            source: 'source-lines-' + this.tfbh,
            type: 'line',
            paint: {
                'line-color': '#6a6a6a',
                'line-width': 2
            }
        });
        map.addLayer({
            id: 'typhoon-path-forc-' + this.tfbh,
            source: 'source-lines-' + this.tfbh,
            type: 'line',
            paint: {
                'line-width': 2,
                'line-dasharray': [2, 2],
                'line-color': [
                    'match',
                    ['get', 'sets'],
                    '中国', '#f5000e',
                    '中国香港', '#6533b5',
                    '中国台湾', '#1f46b0',
                    '韩国', '#41c1f6',
                    '菲律宾', '#000',
                    '美国', '#3187d6',
                    '#f600ad'
                ]
            }
        });
        // 2.3台风实况预报点
        map.addLayer({
            id: 'typhoon-points-live-' + this.tfbh,
            source: 'source-points-' + this.tfbh,
            type: 'circle',
            filter: ['==', 'index', -1],
            paint: {
                'circle-radius': 4,
                'circle-color': ['get', 'color'],
                'circle-stroke-color': '#6a6a6a',
                'circle-stroke-width': 1
            }
        });
        map.addLayer({
            id: 'typhoon-points-forc-' + this.tfbh,
            source: 'source-points-' + this.tfbh,
            type: 'circle',
            filter: ['==', 'index', -1],
            paint: {
                'circle-radius': 4,
                'circle-color': ['get', 'color'],
                'circle-stroke-color': '#6a6a6a',
                'circle-stroke-width': 1
            }
        });

        const liveLayer = 'typhoon-points-live-' + this.tfbh
        const that = this
        map.on('mouseover', liveLayer, e => {
            map.getCanvasContainer().style.cursor = 'pointer'
            const { properties } = e.features[0]
            const dict = [
                {"name":"移向", code: "move_dir", unit: ''},
                {"name":"移速", code: "move_speed", unit: 'm/s'},
                {"name":"压强", code: "pressure", unit: '百帕'},
                {"name":"七级风圈", code: "radius7", unit: '千米'},
                {"name":"十级风圈", code: "radius10", unit: '千米'},
                {"name":"十二级风圈", code: "radius12", unit: '千米'},
                {"name":"移速", code: "speed", unit: 'm/s'},
                {"name":"经过时间", code: "time", unit: ''},
            ]
            const pos = [properties.lng, properties.lat]
            let content = `
                    <h4 class="field-header">${that.typhoonData.name}${that.typhoonData.tfbh}</h4>
                    <div class="field-item"><label class="field-label">中心位置：</label>${pos.join(', ')}</div>
            `
            dict.forEach(d => {
                const {code, name, unit} = d
                let value = properties[code]
                value = value ? value + unit : '/'
                content += `<div class="field-item"><label class="field-label">${name}：</label>${value}</div>`
            })
            this.popup = new mapboxgl.Popup({
                offset: [0, -5],
                anchor: 'bottom',
                className: 'my-popup',
                closeButton: false
            }).setLngLat(pos).setHTML(content).addTo(map);
        });
        map.on('mouseout', liveLayer, e => {
            map.getCanvasContainer().style.cursor = ''
            if(this.popup) this.popup.remove()
        });
        map.on('click', liveLayer, e => {
            const { properties } = e.features[0]
            that.play(properties.index)
        });

        const forcLayer = 'typhoon-points-forc-' + this.tfbh
        map.on('mouseover', forcLayer, e => {
            map.getCanvasContainer().style.cursor = 'pointer'
            const { properties } = e.features[0]
            const dict = [
                {"name":"移向", code: "move_dir", unit: ''},
                {"name":"移速", code: "move_speed", unit: 'm/s'},
                {"name":"压强", code: "pressure", unit: '百帕'},
                {"name":"七级风圈", code: "radius7", unit: '千米'},
                {"name":"十级风圈", code: "radius10", unit: '千米'},
                {"name":"十二级风圈", code: "radius12", unit: '千米'},
                {"name":"移速", code: "speed", unit: 'm/s'},
                {"name":"经过时间", code: "time", unit: ''},
            ]
            const pos = [properties.lng, properties.lat]
            let content = `
                    <h4 class="field-header">${that.typhoonData.name}${that.typhoonData.tfbh}</h4>
                    <div class="field-item"><label class="field-label">中心位置：</label>${pos.join(', ')}</div>
            `
            dict.forEach(d => {
                const {code, name, unit} = d
                let value = properties[code]
                value = value ? value + unit : '/'
                content += `<div class="field-item"><label class="field-label">${name}：</label>${value}</div>`
            })
            this.popup = new mapboxgl.Popup({
                offset: [0, -5],
                anchor: 'bottom',
                className: 'my-popup',
                closeButton: false
            }).setLngLat(pos).setHTML(content).addTo(map);
        });
        map.on('mouseout', forcLayer, e => {
            map.getCanvasContainer().style.cursor = ''
            if(this.popup) this.popup.remove()
        });
        // 4.获取数据，开始动画
        this.getTyphoonData()
    }

    getTyphoonData() {
        const url = `https://lzugis.cn/v2/data/complex/${this.tfbh}.json`
        // const url = `./data/${this.tfbh}.json`
        fetch(url).then(res => res.json()).then(res => {
            this.typhoonData = res[0]
            this.addTyphoonName()
            this.dealTyphoonData()
            this.play()
        })
    }


    addTyphoonName() {
        const {lng, lat} = this.typhoonData.points[0]
        const element = document.createElement('div')
        element.classList.add('typhoon-name')
        const {tfbh, name} = this.typhoonData
        element.innerText = [tfbh, name].join('')
        this.nameMarker =  new mapboxgl.Marker({
            element,
            anchor: 'left',
            offset: [0, 15]
        }).setLngLat([lng, lat]).addTo(this.map);
    }

    dealTyphoonData() {
        const points = this.typhoonData.points
        let pointFeatures = []
        let linesFeatures = []
        let circleFeatures = []
        points.forEach((point, index) => {
            // 实况点
            point.index = index
            point.type = 'live'
            point.color = this.getColor(point.power)
            const {lng, lat, forecast} = point
            const geom = new Geometry('Point', [lng, lat])
            const feature = new Feature(point, geom)
            pointFeatures.push(feature)
            // 实况线
            if(index > 0) {
                const coords = []
                for (let i = 0; i <= index; i++) {
                    const _points = points[i]
                    const _lat = _points.lat
                    const _lng = _points.lng
                    coords.push([_lng, _lat])
                }
                const _geom = new Geometry('LineString', coords)
                const _feature = new Feature({
                    index: index,
                    type: 'live'
                }, _geom)
                linesFeatures.push(_feature)
            }

            // 预报点
            if(forecast) {
                forecast.forEach(forc => {
                    const sets = forc.sets
                    const pointsForc = forc.points
                    const coords = [[lng, lat]]
                    pointsForc.forEach(pointForc => {
                        pointForc.index = index
                        pointForc.color = this.getColor(pointForc.power)
                        pointForc.type = 'forc'
                        const coord = [pointForc.lng, pointForc.lat]
                        const geomForc = new Geometry('Point', coord)
                        const featureForc = new Feature(pointForc, geomForc)
                        pointFeatures.push(featureForc)
                        coords.push(coord)
                    })
                    const _geom = new Geometry('LineString', coords)
                    const _feat = new Feature({
                        index: index,
                        type: 'forc',
                        sets: sets
                    }, _geom)
                    linesFeatures.push(_feat)
                })
            }
            const {radius7_quad, radius10_quad, radius12_quad} = point
            if(radius7_quad.ne && radius7_quad.ne > 0) {
                const coords = this.getCircle([lng, lat], radius7_quad)
                const feature = new Feature({
                    color: '#00bab2',
                    index: index
                }, new Geometry('Polygon', [coords]))
                circleFeatures.push(feature)
            }
            if(radius10_quad.ne && radius10_quad.ne > 0) {
                const coords = this.getCircle([lng, lat], radius10_quad)
                const feature = new Feature({
                    color: '#ffff00',
                    index: index
                }, new Geometry('Polygon', [coords]))
                circleFeatures.push(feature)
            }
            if(radius12_quad.ne && radius12_quad.ne > 0) {
                const coords = this.getCircle([lng, lat], radius12_quad)
                const feature = new Feature({
                    color: '#da7341',
                    index: index
                }, new Geometry('Polygon', [coords]))
                circleFeatures.push(feature)
            }
        })
        this.map.getSource('source-points-' + this.tfbh).setData(new Geojson(pointFeatures))
        this.map.getSource('source-lines-' + this.tfbh).setData(new Geojson(linesFeatures))
        this.map.getSource('source-circle-' + this.tfbh).setData(new Geojson(circleFeatures))
    }

    getColor(power) {
        for (let i = 0; i < colorDict.length; i++) {
            const data = colorDict[i]
            const [min, max] = data.ranges
            if(power >= min && power <= max) {
                return data.color
            }
        }
        return '#ffffff'
    }

    getCircle(center, radiusData) {
        if(!radiusData.ne) return
        center = proj4(proj4('EPSG:4326'), proj4('EPSG:3857'), center);
        let latlngs = [];
        let _angInterval = 6;
        let _pointNums = 360 / (_angInterval * 4);
        let quadrant = {
            // 逆时针算角度
            '0': 'ne',
            '1': 'nw',
            '2': 'sw',
            '3': 'se'
        };
        for (let i = 0; i < 4; i++) {
            let _r = parseFloat(radiusData[quadrant[i]]) * 1000; // 单位是km
            if (!_r) _r = 0;
            for (let j = i * _pointNums; j <= (i + 1) * _pointNums; j++) {
                let _ang = _angInterval * j;
                let x = center[0] + _r * Math.cos((_ang * Math.PI) / 180);
                let y = center[1] + _r * Math.sin((_ang * Math.PI) / 180);
                const coord = proj4(proj4('EPSG:3857'), proj4('EPSG:4326'), [x, y]);
                latlngs.push(coord);
            }
        }
        return latlngs
    }

    play(index) {
        const that = this
        if(index) {
            this.playIndex = index
        }
        if(this.playIndex === this.typhoonData.points.length) {
            that.stop()
        } else {
            // 台风路径点
            this.map.setFilter('typhoon-points-live-' + this.tfbh, [
                'all',
                ['<=', 'index', this.playIndex],
                ['==', 'type', 'live'],
            ]);
            this.map.setFilter('typhoon-points-forc-' + this.tfbh, [
                'all',
                ['==', 'index', this.playIndex],
                ['==', 'type', 'forc']
            ]);
            // 台风路径
            this.map.setFilter('typhoon-path-live-' + this.tfbh, [
                'all',
                ['==', 'index', this.playIndex],
                ['==', 'type', 'live'],
            ]);
            this.map.setFilter('typhoon-path-forc-' + this.tfbh, [
                'all',
                ['==', 'index', this.playIndex],
                ['==', 'type', 'forc']
            ]);
            // 风圈
            this.map.setFilter('typhoon-circle-' + this.tfbh, [
                'all',
                ['==', 'index', this.playIndex]
            ]);
            this.map.setFilter('typhoon-circle-line-' + this.tfbh, [
                'all',
                ['==', 'index', this.playIndex]
            ])
            if(index) {
                that.stop()
            } else {
                this.playIndex++
                this.playFlag = setTimeout(() => {
                    that.play()
                }, 100)
            }
        }
    }

    stop() {
        window.clearTimeout(this.playFlag)
    }

    remove() {
        this.nameMarker.remove()
        // 移除图层
        this.map.removeLayer('typhoon-points-live-' + this.tfbh)
        this.map.removeLayer('typhoon-points-forc-' + this.tfbh)
        this.map.removeLayer('typhoon-path-live-' + this.tfbh)
        this.map.removeLayer('typhoon-path-forc-' + this.tfbh)
        this.map.removeLayer('typhoon-circle-' + this.tfbh)
        this.map.removeLayer('typhoon-circle-line-' + this.tfbh)
        // 移除数据源
        this.map.removeSource('source-points-' + this.tfbh)
        this.map.removeSource('source-lines-' + this.tfbh)
        this.map.removeSource('source-circle-' + this.tfbh)
        // 清除播放
        this.stop()
        this.playIndex = 0
    }
}

class TyphoonPlayer {
    constructor(map) {
        this.map = map
        this.typhoon = {}
        this.addWarnLines()
    }

    addWarnLines() {
        const lineData = [
            {
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [
                            105,
                            0,

                        ],
                        [
                            113,
                            4.5

                        ],
                        [
                            119,
                            11
                        ],
                        [
                            119,
                            18
                        ],
                        [
                            127,
                            22
                        ],
                        [
                            127,
                            34
                        ]
                    ]
                },
                "properties": {
                    "color": "blue",
                    "dashArray": [1, 0],
                    'label': '24小时警戒线'
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [
                            105,
                            0
                        ],
                        [
                            120,
                            0
                        ],
                        [
                            132,
                            15
                        ],
                        [
                            132,
                            34
                        ]
                    ]
                },
                "properties": {
                    "color": "green",
                    "dashArray": [4, 2],
                    'label': '48小时警戒线'
                }
            }
        ]
        this.map.addSource('source-warn-lines', {
            "type": "geojson",
            "data": new Geojson(lineData)
        });
        this.map.addLayer({
            id: 'layer-warn-lines',
            source: 'source-warn-lines',
            type: 'line',
            paint: {
                'line-color': ['get', 'color'],
                'line-width': 2,
                'line-opacity': 0.8,
                'line-dasharray': ['get', 'dashArray']
            }
        })
        // this.map.addLayer({
        //     id: 'layer-warn-label',
        //     source: 'source-warn-lines',
        //     type: 'symbol',
        //     'layout': {
        //         'text-field': ['get', 'label'],
        //         "text-size": 14,
        //         'text-font': ["Open Sans Regular"],
        //         'symbol-placement': "line",
        //         'symbol-spacing': 500
        //     },
        //     paint: {
        //         "text-color": ['get', 'color'],
        //         'text-halo-color': '#ffffff',
        //         'text-halo-width': 0.2
        //     }
        // })
    }


    /**
     * 添加台风
     * @param tfbh
     */
    addTyphoon(tfbh) {
        if(this.typhoon[tfbh]) this.typhoon[tfbh].remove()
        this.typhoon[tfbh] = new Typhoon(this.map, tfbh)
    }

    /**
     * 移除台风
     * @param tfbh
     */
    dropTyphoon(tfbh) {
        this.typhoon[tfbh].remove()
        delete this.typhoon[tfbh]
    }
}

export default TyphoonPlayer
