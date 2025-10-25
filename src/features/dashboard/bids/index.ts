import i18n from "@/app/i18n";

export * from "@/features/dashboard/bids/crud";
export * from "@/features/dashboard/bids/model";

const t = i18n.t;

export const doorLockOptions = [
  {
    value: "271",
    label: t("bids.doorLock.arte"),
  },
  {
    value: "238",
    label: t("bids.doorLock.doganlar_classic"),
  },
  {
    value: "237",
    label: t("bids.doorLock.doganlar"),
  },
  {
    value: "236",
    label: t("bids.doorLock.khroma"),
  },
  {
    value: "235",
    label: t("bids.doorLock.trodoss"),
  },
  {
    value: "234",
    label: t("bids.doorLock.kallori_sred"),
  },
  {
    value: "233",
    label: t("bids.doorLock.melloni"),
  },
  {
    value: "200",
    label: t("bids.doorLock.barokko"),
  },
];

export const canopyOptions = [
  {
    value: "272",
    label: t("bids.canopy.nobel"),
  },
  {
    value: "232",
    label: t("bids.canopy.stimul"),
  },
  {
    value: "231",
    label: t("bids.canopy.naplivnoy"),
  },
  {
    value: "230",
    label: t("bids.canopy.archi"),
  },
  {
    value: "228",
    label: t("bids.canopy.zuber"),
  },
  {
    value: "205",
    label: t("bids.canopy.agb"),
  },
];

export const doorTypeOptions = [
  {
    value: "ДО",
    label: "ДО",
  },
  {
    value: "ДГ",
    label: "ДГ",
  },
];

export const veenerTypeOptions = [
  {
    value: "Орех",
    label: "Орех",
  },
  {
    value: "Дуб",
    label: "Дуб",
  },
  {
    value: "Ясень",
    label: "Ясень",
  },
];

export const doorwayTypeOptions = [
  {
    value: 1,
    label: t("bids.doorwayType.p_obraznaya"),
  },
  {
    value: 2,
    label: t("bids.doorwayType.g_obraznaya"),
  },
  {
    value: 3,
    label: t("bids.doorwayType.o_obraznaya"),
  },
];

export const openingSideOptions = [
  {
    value: "1",
    label: t("bids.openingSide.left"),
  },
  {
    value: "2",
    label: t("bids.openingSide.right"),
  },
];

export const openingDirectionOptions = [
  {
    value: "1",
    label: t("bids.openingDirection.outside"),
  },
  {
    value: "2",
    label: t("bids.openingDirection.inside"),
  },
  {
    value: "3",
    label: t("bids.openingDirection.coupe"),
  },
];

// <option value="1">С порогом</option>
// <option value="2">Без порога</option>
// <option value="3">Низкий порог</option>

export const thresholdTypeOptions = [
  {
    value: "1",
    label: t("bids.thresholdType.with_threshold"),
  },
  {
    value: "2",
    label: t("bids.thresholdType.without_threshold"),
  },
  {
    value: "3",
    label: t("bids.thresholdType.low_threshold"),
  },
];

/*
*                             <option value="Лицо">Лицо</option>
                            <option value="Зад">Зад</option>
                            <option value="2-сторон">2-сторон</option>
* */

export const chamferOptions = [
  {
    value: "Лицо",
    label: t("bids.doorFaceType.face"),
  },
  {
    value: "Зад",
    label: t("bids.doorFaceType.back"),
  },
  {
    value: "2-сторон",
    label: t("bids.doorFaceType.double_sided"),
  },
];

//                            <option value="1">1</option>
//                             <option value="50/50">50/50</option>
//                             <option value="70/30">70/30</option>
//                             <option value="75/25">75/25</option>
//                             <option value="4x25">4x25</option>
//                             <option value="2x(20/30)">2x(20/30)</option>

export const sashOptions = [
  {
    value: "1",
    label: "1",
  },
  {
    value: "50/50",
    label: "50/50",
  },
  {
    value: "70/30",
    label: "70/30",
  },
  {
    value: "75/25",
    label: "75/25",
  },
  {
    value: "4x25",
    label: "4x25",
  },
  {
    value: "2x(20/30)",
    label: "2x(20/30)",
  },
];

export const sheathingOptions = [
  {
    value: "По фото",
    label: t("bids.sheathingStyle.by_photo"),
  },
  ...Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString(),
    label: (i + 1).toString(),
  })),
];

export const trimStyleOptions = [
  {
    value: "По фото",
    label: t("bids.trimStyle.by_photo"),
  },
  ...Array.from({ length: 20 }, (_, i) => ({
    value: (i + 1).toString(),
    label: (i + 1).toString(),
  })),
];

export const upTrimStyleOptions = [
  {
    value: "По фото",
    label: t("bids.trimStyle.by_photo"),
  },
  ...Array.from({ length: 20 }, (_, i) => ({
    value: (i + 1).toString(),
    label: (i + 1).toString(),
  })),
];

export const underTrimStyleOptions = [
  {
    value: "По фото",
    label: t("bids.trimStyle.by_photo"),
  },
  ...Array.from({ length: 20 }, (_, i) => ({
    value: (i + 1).toString(),
    label: (i + 1).toString(),
  })),
];

export const crownStyleOptions = [
  {
    value: "По фото",
    label: t("bids.crownStyle.by_photo"),
  },
  ...Array.from({ length: 10 }, (_, i) => ({
    value: (i + 1).toString(),
    label: (i + 1).toString(),
  })),
];
