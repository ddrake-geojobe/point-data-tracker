import MapView from "@arcgis/core/views/MapView.js";
import WebMap from "@arcgis/core/WebMap.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";

export async function createMap(featureLayerUrl) {
  const container = document.createElement("div");
  container.id = "map-container";

  const pointsLayer = new FeatureLayer({
    url: featureLayerUrl,
    definitionExpression: "1=1", // load all features
  });

  await pointsLayer.load();

  const webMap = new WebMap({
    basemap: "topo-vector",
    layers: [ pointsLayer ],
  });

  const view = new MapView({
    container,
    map: webMap,
  });

  view.when(() => {
    pointsLayer.when(async () => {

      let featureSet = await pointsLayer.queryFeatures({
        where: "1=1",
        returnGeometry: true,
      });

      let featureGeoms = featureSet.features.map(f => f.geometry);

      view.goTo(featureGeoms);

    });
  });

  return { container, pointsLayer };
}
