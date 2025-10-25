import React, { FC, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  DatePicker,
  Label,
  RangePicker,
  Select,
  SelectInfinitive,
} from "@/shared/ui";
import { useAppConstants } from "@/shared/hooks";
import { useTranslation } from "react-i18next";
import { RangeSliderFilter } from "@/shared/ui/RangeSliderFilter";
import { uomComparisonTypes } from "@/shared/constants";
import { RangeFilter } from "@/shared/ui/RangeFilter";

type FiltersProps = {
  filters: {
    totalAmountLabel?: string;
    partner?: boolean;
    organization?: boolean;
    paymentType?: boolean;
    status?: boolean;
    totalAmount?: boolean;
    taxAmount?: boolean;
    shippingType?: boolean;
    warehouse?: boolean;
    taxCategory?: boolean;
    accountBalance?: boolean;
    discountCategory?: boolean;
    percent?: boolean;
    date?: boolean;
    registrationDate?: boolean;
    recorder?: boolean;
    partnerGroup?: boolean;
    organizationGroup?: boolean;
    currency?: boolean;
    role?: boolean;
    uom?: boolean;
    manufacturer?: boolean;
    productCategory?: boolean;
    newPrice?: boolean;
    oldPrice?: boolean;
    batchProduct?: boolean;
    product?: boolean;
    expires_at?: boolean;
    courier?: boolean;
    author?: boolean;
    uomCategory?: boolean;
    uomType?: boolean;
    closedAmount?: boolean;
    openAmount?: boolean;
    speciality?: boolean;
    workTime?: boolean;
    salaryAmount?: boolean;
    givenAmount?: boolean;
    debtAmount?: boolean;
    reason?: boolean;
    totalQuantity?: boolean;
    quantity?: boolean;
    baseQuantity?: boolean;
    quantityMaterial?: boolean;
    unitPrice?: boolean;
    expiredDate?: boolean;
    statusOptions?: { value: unknown; label: string }[];
    // Application-specific filters
    applicationStatus?: boolean;
    applicationAuthor?: boolean;
    applicationDate?: boolean;
  };
};

const Filter: FC<FiltersProps> = ({ filters }) => {
  const {
    partner = false,
    organization = false,
    status = false,
    date = false,
    registrationDate = false,
    recorder = false,
    paymentType = false,
    totalAmount = false,
    taxAmount = false,
    accountBalance = false,
    taxCategory = false,
    discountCategory = false,
    percent = false,
    partnerGroup = false,
    organizationGroup = false,
    shippingType = false,
    warehouse = false,
    courier = false,
    author = false,
    currency = false,
    role = false,
    uom = false,
    manufacturer = false,
    productCategory = false,
    newPrice = false,
    oldPrice = false,
    batchProduct = false,
    product = false,
    expires_at = false,
    uomCategory = false,
    uomType = false,
    closedAmount = false,
    openAmount = false,
    speciality = false,
    workTime = false,
    salaryAmount = false,
    givenAmount = false,
    debtAmount = false,
    reason = false,
    totalQuantity = false,
    quantity = false,
    baseQuantity = false,
    quantityMaterial = false,
    unitPrice = false,
    expiredDate = false,
    statusOptions = [],
    totalAmountLabel,
    // Application-specific filters
    applicationStatus = false,
    applicationAuthor = false,
    applicationDate = false,
  } = filters;

  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { PAYMENT_TYPES, WORKTIME_TYPES } = useAppConstants();
  const [ranges, setRanges] = useState<{
    [key: string]: [number, number];
  }>({
    percent: [0, 100],
  });

  const handleRangeChange = (
    key: string,
    minValue: number,
    maxValue: number,
  ) => {
    setRanges((prev) => ({
      ...prev,
      [key]: [minValue, maxValue],
    }));
  };

  const updateParam = (key: any, value: any) => {
    setSearchParams({
      ...Object.fromEntries(searchParams),
      [key]: value,
    });
  };

  return (
    <>
      {totalAmount && (
        <RangeFilter
          label={totalAmountLabel ?? t("common.input.amount")}
          value={ranges.totalAmount}
          onChange={(min, max) => handleRangeChange("totalAmount", min, max)}
          maxQueryKey={"totalAmount_max"}
          minQueryKey={"totalAmount_min"}
        />
      )}
      {closedAmount && (
        <RangeFilter
          label={totalAmountLabel ?? t("common.status.closed")}
          value={ranges.closedAmount}
          onChange={(min, max) => handleRangeChange("closedAmount", min, max)}
          maxQueryKey={"closedAmount_max"}
          minQueryKey={"closedAmount_min"}
        />
      )}
      {openAmount && (
        <RangeFilter
          label={totalAmountLabel ?? t("common.table.remainingQuantity")}
          value={ranges.openAmount}
          onChange={(min, max) => handleRangeChange("openAmount", min, max)}
          maxQueryKey={"openAmount_max"}
          minQueryKey={"openAmount_min"}
        />
      )}

      {taxAmount && (
        <RangeFilter
          label={t("common.table.tax")}
          value={ranges.taxAmount}
          onChange={(min, max) => handleRangeChange("taxAmount", min, max)}
          maxQueryKey={"taxAmount_max"}
          minQueryKey={"taxAmount_min"}
        />
      )}

      {percent && (
        <RangeSliderFilter
          label={t("common.input.percentage")}
          min={0}
          max={100}
          value={ranges.percent}
          onChange={(min, max) => handleRangeChange("percent", min, max)}
          maxQueryKey={"percent_max"}
          minQueryKey={"percent_min"}
        />
      )}

      {salaryAmount && (
        <RangeFilter
          label={t("common.table.salary")}
          value={ranges.salaryAmount}
          onChange={(min, max) => handleRangeChange("salaryAmount", min, max)}
          maxQueryKey={"salaryAmount_max"}
          minQueryKey={"salaryAmount_min"}
        />
      )}

      {accountBalance && (
        <RangeFilter
          label={t("common.table.balance")}
          value={ranges.accountBalance}
          onChange={(min, max) => handleRangeChange("accountBalance", min, max)}
          maxQueryKey={"accountBalance_max"}
          minQueryKey={"accountBalance_min"}
        />
      )}
      {givenAmount && (
        <RangeFilter
          label={t("common.table.givenSum")}
          value={ranges.givenAmount}
          onChange={(min, max) => handleRangeChange("givenAmount", min, max)}
          maxQueryKey={"givenAmount_max"}
          minQueryKey={"givenAmount_min"}
        />
      )}

      {debtAmount && (
        <RangeFilter
          label={t("common.table.dept")}
          value={ranges.debtAmount}
          onChange={(min, max) => handleRangeChange("debt", min, max)}
          maxQueryKey={"debtAmount_max"}
          minQueryKey={"debtAmount_min"}
        />
      )}

      {oldPrice && (
        <RangeFilter
          label={t("common.table.oldPrice")}
          value={ranges.oldPrice}
          onChange={(min, max) => handleRangeChange("oldPrice", min, max)}
          maxQueryKey={"oldPrice_max"}
          minQueryKey={"oldPrice_min"}
        />
      )}

      {newPrice && (
        <RangeFilter
          label={t("common.table.newPrice")}
          value={ranges.newPrice}
          onChange={(min, max) => handleRangeChange("newPrice", min, max)}
          maxQueryKey={"newPrice_max"}
          minQueryKey={"newPrice_min"}
        />
      )}
      {totalQuantity && (
        <RangeFilter
          label={t("common.table.availability")}
          value={ranges.totalQuantity}
          onChange={(min, max) => handleRangeChange("totalQuantity", min, max)}
          maxQueryKey={"totalQuantity_max"}
          minQueryKey={"totalQuantity_min"}
        />
      )}
      {quantity && (
        <RangeFilter
          label={t("common.table.products")}
          value={ranges.quantity}
          onChange={(min, max) => handleRangeChange("quantity", min, max)}
          maxQueryKey={"quantity_max"}
          minQueryKey={"quantity_min"}
        />
      )}
      {baseQuantity && (
        <RangeFilter
          label={t("common.table.remaining")}
          value={ranges.baseQuantity}
          onChange={(min, max) => handleRangeChange("baseQuantity", min, max)}
          maxQueryKey={"baseQuantity_max"}
          minQueryKey={"baseQuantity_min"}
        />
      )}

      {unitPrice && (
        <RangeFilter
          label={t("common.table.unitPrice")}
          value={ranges.unitPrice}
          onChange={(min, max) => handleRangeChange("unitPrice", min, max)}
          maxQueryKey={"unitPrice_max"}
          minQueryKey={"unitPrice_min"}
        />
      )}

      {quantityMaterial && (
        <RangeFilter
          label={t("common.table.quantityMaterial")}
          value={ranges.unitPrice}
          onChange={(min, max) =>
            handleRangeChange("quantityMaterial", min, max)
          }
          maxQueryKey={"quantityMaterial_max"}
          minQueryKey={"quantityMaterial_min"}
        />
      )}

      {currency && (
        <Label label={t("common.input.currency")}>
          <SelectInfinitive
            rootClassName="bg-white"
            size="small"
            fetchUrl="/currency/"
            queryKey="currency"
            labelKey={"code"}
            valueKey={"id"}
            value={searchParams.get("currency") || ""}
            renderOption={(item) => <span>{item.code}</span>}
            onSelect={(value) => updateParam("currency", value)}
            placeholder={t("common.input.placeholder.currency")}
            params={{
              isSelected: true,
            }}
          />
        </Label>
      )}

      {taxCategory && (
        <Label label={t("common.table.category")}>
          <SelectInfinitive
            className="w-full"
            rootClassName={"bg-white"}
            size="small"
            fetchUrl={"/tax-category/"}
            queryKey={"category"}
            labelKey={"title"}
            valueKey={"id"}
            placeholder={t("common.input.placeholder.category")}
            value={searchParams.get("category")}
            onSelect={(value) => updateParam("category", value)}
          />
        </Label>
      )}
      {discountCategory && (
        <Label label={t("common.table.category")}>
          <SelectInfinitive
            className="w-full"
            rootClassName={"bg-white"}
            size="small"
            fetchUrl={"/discount-category/"}
            queryKey={"category"}
            labelKey={"title"}
            valueKey={"id"}
            placeholder={t("common.input.placeholder.category")}
            value={searchParams.get("category")}
            onSelect={(value) => updateParam("category", value)}
          />
        </Label>
      )}

      {partner && (
        <Label label={t("common.table.partner")}>
          <SelectInfinitive
            rootClassName="bg-white"
            size="small"
            fetchUrl="/partner/"
            queryKey="partner"
            labelKey="title"
            valueKey="id"
            value={searchParams.get("partner") || ""}
            renderOption={(item) => <span>{item.title}</span>}
            onSelect={(value) => updateParam("partner", value)}
            placeholder={t("common.table.partner")}
          />
        </Label>
      )}

      {organization && (
        <Label label={t("common.table.organization")}>
          <SelectInfinitive
            rootClassName="bg-white"
            size="small"
            fetchUrl="/organization/"
            queryKey="organization"
            labelKey="title"
            valueKey="id"
            value={searchParams.get("organization") || ""}
            renderOption={(item) => <span>{item.title}</span>}
            onSelect={(value) => updateParam("organization", value)}
            placeholder={t("common.table.organization")}
          />
        </Label>
      )}
      {partnerGroup && (
        <Label label={t("common.table.group")}>
          <SelectInfinitive
            rootClassName="bg-white"
            size="small"
            fetchUrl="/partner-group/"
            queryKey="group"
            labelKey="title"
            valueKey="id"
            value={searchParams.get("group") || ""}
            renderOption={(item) => <span>{item.title}</span>}
            onSelect={(value) => updateParam("group", value)}
            placeholder={t("common.table.group")}
          />
        </Label>
      )}

      {organizationGroup && (
        <Label label={t("common.table.group")}>
          <SelectInfinitive
            rootClassName="bg-white"
            size="small"
            fetchUrl="/organization-group/"
            queryKey="group"
            labelKey="title"
            valueKey="id"
            value={searchParams.get("group") || ""}
            renderOption={(item) => <span>{item.title}</span>}
            onSelect={(value) => updateParam("group", value)}
            placeholder={t("common.table.group")}
          />
        </Label>
      )}

      {paymentType && (
        <Label label={t("common.input.paymentType")}>
          <Select
            rootClassName="bg-white"
            queryKey={"paymentType"}
            size="small"
            showSearch={false}
            placeholder={t("common.input.placeholder.paymentType")}
            options={PAYMENT_TYPES}
            defaultValue={Number(searchParams.get("paymentType")) || undefined}
            onSelect={(value) => updateParam("paymentType", value)}
          />
        </Label>
      )}

      {shippingType && (
        <Label label={t("common.input.shippingType")}>
          <SelectInfinitive
            rootClassName="bg-white"
            size="small"
            fetchUrl="/shipping-type/"
            queryKey="shippingType"
            labelKey="title"
            valueKey="id"
            value={searchParams.get("shippingType") || ""}
            renderOption={(item) => <span>{item.title}</span>}
            onSelect={(value) => updateParam("shippingType", value)}
            placeholder={t("common.input.placeholder.shippingType")}
          />
        </Label>
      )}

      {warehouse && (
        <Label label={t("common.table.warehouse")}>
          <SelectInfinitive
            rootClassName="bg-white"
            size="small"
            fetchUrl="/warehouse/"
            queryKey="warehouse"
            labelKey="title"
            valueKey="id"
            value={searchParams.get("warehouse") || ""}
            renderOption={(item) => <span>{item.title}</span>}
            onSelect={(value) => updateParam("warehouse", value)}
            placeholder={t("common.table.warehouse")}
          />
        </Label>
      )}

      {role && (
        <Label label={t("crmModule.staff.form.role.label")}>
          <SelectInfinitive
            rootClassName="bg-white"
            size="small"
            fetchUrl="/permission/"
            queryKey="role"
            labelKey="title"
            valueKey="id"
            value={searchParams.get("role") || ""}
            renderOption={(item) => <span>{item.title}</span>}
            onSelect={(value) => updateParam("role", value)}
            placeholder={t("crmModule.staff.form.role.placeholder")}
          />
        </Label>
      )}
      {product && (
        <Label label={t("common.filter.product.label")}>
          <SelectInfinitive
            rootClassName={"bg-white"}
            size={"small"}
            fetchUrl={"/product/"}
            queryKey={"product"}
            labelKey={"title"}
            valueKey={"id"}
            value={searchParams.get("product")}
            renderOption={(item) => {
              return <span>{item.title}</span>;
            }}
            onSelect={(value) => updateParam("product", value)}
            placeholder={t("common.filter.product.placeholder")}
          />
        </Label>
      )}

      {uom && (
        <Label label={t("common.table.measurement")}>
          <SelectInfinitive
            rootClassName="bg-white"
            size="small"
            fetchUrl="/uom/"
            queryKey="uom"
            labelKey="shortName"
            valueKey="id"
            value={searchParams.get("uom") || ""}
            renderOption={(item) => <span>{item.shortName}</span>}
            onSelect={(value) => updateParam("uom", value)}
            placeholder={t("common.input.placeholder.measurement")}
          />
        </Label>
      )}

      {manufacturer && (
        <Label label={t("permissions.manufacturer")}>
          <SelectInfinitive
            rootClassName="bg-white"
            size="small"
            fetchUrl="/manufacturer/"
            queryKey="manufacturer"
            labelKey="title"
            valueKey="id"
            value={searchParams.get("manufacturer") || ""}
            renderOption={(item) => <span>{item.title}</span>}
            onSelect={(value) => updateParam("manufacturer", value)}
            placeholder={t("common.input.placeholder.manufacturer")}
          />
        </Label>
      )}

      {productCategory && (
        <Label label={t("common.input.category")}>
          <SelectInfinitive
            rootClassName="bg-white"
            size="small"
            fetchUrl="/product-category/"
            queryKey="category"
            labelKey="title"
            valueKey="id"
            value={searchParams.get("category") || ""}
            renderOption={(item) => <span>{item.title}</span>}
            onSelect={(value) => updateParam("category", value)}
            placeholder={t("common.input.placeholder.category")}
          />
        </Label>
      )}

      {batchProduct && (
        <Label label={t("common.table.batch")}>
          <SelectInfinitive
            rootClassName="bg-white"
            size="small"
            fetchUrl="/batch-product/"
            queryKey="batchProduct"
            labelKey={["batch", "batchProduct"]}
            valueKey="id"
            value={searchParams.get("batchProduct") || ""}
            renderOption={(item) => (
              <span>{item.batch || item.batchProduct || "-"}</span>
            )}
            onSelect={(value) => updateParam("batchProduct", value)}
            placeholder={t("common.table.batch")}
          />
        </Label>
      )}

      {speciality && (
        <Label label={t("common.details.specialization")}>
          <SelectInfinitive
            rootClassName="bg-white"
            size="small"
            fetchUrl="/speciality/"
            queryKey="speciality"
            labelKey={"title"}
            valueKey="id"
            value={searchParams.get("speciality") || ""}
            renderOption={(item) => <span>{item.title}</span>}
            onSelect={(value) => updateParam("speciality", value)}
            placeholder={t("crmModule.staff.form.speciality.placeholder")}
          />
        </Label>
      )}

      {workTime && (
        <Label label={t("common.table.workTime")}>
          <Select
            rootClassName="bg-white"
            queryKey={"workTime"}
            size="small"
            showSearch={false}
            placeholder={t("common.input.placeholder.workTime")}
            options={WORKTIME_TYPES}
            defaultValue={Number(searchParams.get("workTime")) || undefined}
            onSelect={(value) => updateParam("workTime", value)}
          />
        </Label>
      )}

      {recorder && (
        <Label label={t("common.table.creator")}>
          <SelectInfinitive
            rootClassName="bg-white"
            size="small"
            fetchUrl="/staff/"
            queryKey="recorder"
            labelKey={["first_name", "last_name"]}
            valueKey="id"
            value={searchParams.get("recorder") || ""}
            renderOption={(item) => (
              <span>
                {item?.first_name} {item?.last_name}
              </span>
            )}
            onSelect={(value) => updateParam("recorder", value)}
            placeholder={t("common.filter.recorder.placeholder")}
          />
        </Label>
      )}

      {courier && (
        <Label label={t("common.table.courier")}>
          <SelectInfinitive
            rootClassName="bg-white"
            size="small"
            fetchUrl="/staff/"
            queryKey="recorder"
            labelKey={["first_name", "last_name"]}
            valueKey="id"
            value={searchParams.get("courier") || ""}
            renderOption={(item) => (
              <span>
                {item?.first_name} {item?.last_name}
              </span>
            )}
            onSelect={(value) => updateParam("courier", value)}
            placeholder={t("common.table.courier")}
          />
        </Label>
      )}

      {author && (
        <Label label={t("common.table.author")}>
          <SelectInfinitive
            rootClassName="bg-white"
            size="small"
            fetchUrl="/staff/"
            queryKey="recorder"
            labelKey={["first_name", "last_name"]}
            valueKey="id"
            value={searchParams.get("author") || ""}
            renderOption={(item) => (
              <span>
                {item?.first_name} {item?.last_name}
              </span>
            )}
            onSelect={(value) => updateParam("author", value)}
            placeholder={t("common.table.author")}
          />
        </Label>
      )}

      {uomCategory && (
        <Label label={t("productServiceModule.uom.form.unit.category.label")}>
          <SelectInfinitive
            rootClassName={"bg-white"}
            size={"small"}
            fetchUrl={"/uom-category/"}
            queryKey={"category"}
            labelKey={"title"}
            valueKey={"id"}
            value={searchParams.get("category")}
            renderOption={(item) => {
              return <span>{item.title}</span>;
            }}
            onSelect={(value) => updateParam("category", value)}
            placeholder={t(
              "productServiceModule.uom.form.unit.category.placeholder",
            )}
          />
        </Label>
      )}

      {reason && (
        <Label label={t("common.input.reason")}>
          <SelectInfinitive
            rootClassName={"bg-white"}
            size={"small"}
            fetchUrl={"/reason/"}
            queryKey={"reason"}
            labelKey={"title"}
            valueKey={"id"}
            value={searchParams.get("reason")}
            renderOption={(item) => {
              return <span>{item.title}</span>;
            }}
            onSelect={(value) => updateParam("reason", value)}
            placeholder={t("common.input.placeholder.reason")}
          />
        </Label>
      )}

      {uomType && (
        <Label label={t("common.details.comparisonType")}>
          <Select
            rootClassName="bg-white"
            queryKey={"type"}
            size="small"
            showSearch={false}
            placeholder={t("common.details.comparisonType")}
            options={uomComparisonTypes}
            defaultValue={Number(searchParams.get("type")) || undefined}
            onSelect={(value) => updateParam("type", value)}
          />
        </Label>
      )}

      {date && (
        <Label label={t("common.table.date")}>
          <DatePicker
            size="small"
            className="bg-gray-800"
            valueName="date"
            placeholder={t("common.table.date")}
            style={{ height: 32 }}
          />
        </Label>
      )}
      {registrationDate && (
        <Label label={t("common.table.registrationDate")}>
          <RangePicker
            from={"registrationDate_from"}
            to={"registrationDate_to"}
          />
        </Label>
      )}
      {expires_at && (
        <Label label={t("common.table.expiryDate")}>
          <RangePicker from={"expires_at_from"} to={"expires_at_to"} />
        </Label>
      )}
      {expiredDate && (
        <Label label={t("common.table.expiryDate")}>
          <RangePicker from={"expiredDate_from"} to={"expiredDate_to"} />
        </Label>
      )}

      {/* Application-specific filters */}
      {applicationStatus && (
        <Label label={t("common.table.status")}>
          <SelectInfinitive
            rootClassName="bg-white"
            size="small"
            fetchUrl="/application-status/"
            queryKey="status"
            labelKey="title"
            valueKey="id"
            value={searchParams.get("status") || ""}
            renderOption={(item) => <span>{item.title}</span>}
            onSelect={(value) => updateParam("status", value)}
            placeholder={t("common.placeholder.status")}
          />
        </Label>
      )}

      {applicationAuthor && (
        <Label label={t("common.table.dealer")}>
          <SelectInfinitive
            rootClassName="bg-white"
            size="small"
            fetchUrl="/staff/"
            queryKey="author"
            labelKey={["first_name", "last_name"]}
            valueKey="id"
            value={searchParams.get("author") || ""}
            renderOption={(item) => (
              <span>
                {item?.first_name} {item?.last_name}
              </span>
            )}
            onSelect={(value) => updateParam("author", value)}
            placeholder={t("common.table.dealer")}
          />
        </Label>
      )}

      {applicationDate && (
        <Label label={t("common.table.date")}>
          <RangePicker from="date_from" to="date_to" />
        </Label>
      )}
    </>
  );
};

export default Filter;
