import "maplibre-gl/dist/maplibre-gl.css";

import { debounce } from "lodash";
import maplibregl from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const LocationPicker = ({ selectedLocation, onConfirm }) => {
  const { t, i18n } = useTranslation();
  const [locationInput, setLocationInput] = useState(
    selectedLocation?.display_name || "",
  );
  const [locationResults, setLocationResults] = useState([]);
  const [isUpdatingFromMap, setIsUpdatingFromMap] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [hasError, setHasError] = useState(false);
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style:
        "https://tiles.basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      center: [
        selectedLocation?.lon || 69.2401,
        selectedLocation?.lat || 41.2995,
      ],
      zoom: 12,
    });

    const navControl = new maplibregl.NavigationControl({ showCompass: false });
    map.current.addControl(navControl, "bottom-right");

    const updateMarkerPosition = debounce(async () => {
      if (!map.current) return;
      const center = map.current.getCenter();
      try {
        setLoadingLocation(true);
        const response = await fetch(
          `https://maps.commeta.io/nominatim/reverse?lat=${center.lat}&lon=${center.lng}&format=json&language=${i18n.language}`,
        );
        const data = await response.json();
        setHasError(!data?.display_name);
        setLocationInput(data?.display_name || t("unknown_location"));
      } catch (error) {
        setHasError(true);
      } finally {
        setLoadingLocation(false);
      }
    }, 500);

    map.current.on("moveend", updateMarkerPosition);

    return () => map.current?.remove();
  }, [i18n.language]);

  const getList = debounce(async () => {
    const response = await fetch(
      `https://maps-dev.commeta.io/nominatim/search?q=${locationInput}&accept-language=${i18n.language}&format=json`,
    );
    const data = await response.json();
    setLocationResults(data);
  }, 500);

  useEffect(() => {
    if (!isUpdatingFromMap) getList();
  }, [locationInput]);

  const handleLocationClick = (name, lat, lon) => {
    setLoadingLocation(true);
    setLocationInput(name);
    setLocationResults([]);
    setIsUpdatingFromMap(true);
    setTimeout(() => setIsUpdatingFromMap(false), 100);
    if (map.current) {
      map.current.flyTo({ center: [lon, lat], zoom: 14, essential: true });
    }
  };

  return (
    <div className="relative w-full">
      <div className="absolute top-0 z-20 flex w-full items-center space-x-4 bg-white px-5 py-4">
        <div className="relative w-full">
          <input
            type="text"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            className="w-full rounded-md bg-gray-100 p-2.5 outline-none"
            placeholder={t("location_create.mapModal.searchPlaceholder")}
            disabled={loadingLocation}
          />
          {locationResults.length > 0 && !isUpdatingFromMap && (
            <div className="absolute left-0 top-12 max-h-60 w-full overflow-y-auto rounded-md border bg-white p-2 shadow-md">
              {locationResults.map((n) => (
                <div
                  key={n.display_name}
                  onClick={() =>
                    handleLocationClick(n.name || n.display_name, n.lat, n.lon)
                  }
                  className="cursor-pointer rounded p-2 hover:bg-gray-200"
                >
                  {n.name || n.display_name}
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          className="rounded-md bg-blue-500 px-4 py-2 text-white"
          onClick={() => onConfirm(locationInput)}
          disabled={loadingLocation}
        >
          {t("confirm")}
        </button>
      </div>
      <div
        ref={mapContainer}
        className="h-[calc(100vh-128px)] w-full rounded-lg border"
      />
    </div>
  );
};

export default LocationPicker;
