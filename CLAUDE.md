# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev              # Start dev server on local network (vite --host)
npm run build            # Production build (vite build)
npm run typecheck        # TypeScript type checking (tsc --noEmit)
npm run lint             # ESLint check
npm run lint:fix         # ESLint auto-fix
npm run prettier         # Format all files with Prettier
npm run generate:api     # Regenerate API types from OpenAPI specs (orval)
npm run generate:icon-type  # Regenerate icon type definitions
npm run test             # Run tests (vitest)
npm run test -- --run    # Run tests once without watch mode
```

## Architecture Overview

This is a React 19 + TypeScript CRM application (Jasper CRM) using Vite, built with Feature-Sliced Design architecture.

### Directory Structure

- `src/app/` - Application setup: providers, layouts, routes, i18n
- `src/features/` - Feature modules (auth, admin, dashboard, profile, crm)
- `src/pages/` - Page components mapped to routes
- `src/shared/` - Shared code: UI components, hooks, utilities, API layer
- `src/widgets/` - Composite UI blocks
- `src/types/` - Global TypeScript types

### API Layer

**Generated Types (Orval)**: API types are auto-generated from OpenAPI specs into `src/shared/lib/api/generated/`:
- `gateway/` - Main business API (products, bids, organizations, etc.)
- `user/` - Auth/profile API

Generated types have `Entity` suffix (e.g., `ProductEntity`, `BidEntity`).

**API Services**:
- `apiService` - Gateway API (`src/shared/lib/services/ApiService.ts`)
- `authApiService` - User/Auth API

**Custom Mutators**: `src/shared/lib/api/mutator.ts` and `user-mutator.ts` wrap axios for React Query integration.

### Feature Module Structure

Each feature follows the pattern:
```
features/<domain>/
  ├── model/       # Queries, mutations, types, hooks
  ├── ui/          # UI components
  ├── crud/        # Add/Edit forms
  ├── details/     # Detail views
  └── index.ts     # Public exports
```

### Key Technologies

- **UI**: Ant Design 5 + Tailwind CSS
- **Data Fetching**: TanStack React Query 5
- **Routing**: React Router 7
- **Forms**: Ant Design Form
- **i18n**: react-i18next (Russian, English, Uzbek)
- **HTTP**: Axios
- **SVG Icons**: vite-plugin-svgr (import as `*.svg?react`)

### Path Aliases

`@/` and `~/` both resolve to `src/` directory.

### Environment Variables

Required in `.env`:
- `VITE_API_BASE_URL` - Gateway API URL
- `VITE_API_AUTH_URL` - Auth API URL
- `VITE_STATIC_ASSETS_BASE_URL` - Static assets base URL

## Code Patterns

### Mutations with Cache Invalidation

```typescript
const mutation = useMutation({
  mutationFn: (data) => apiCall(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["tableData"] });
  },
});
```

### Form Field Validation

```typescript
<Form.Item
  name="field_name"
  label={t("common.labels.fieldName")}
  rules={[{ required: true, message: t("common.validation.required") }]}
>
```

### Product Types

Valid product types for the API: `door-window`, `door-deaf`, `doorway`, `window`, `windowsill`, `heated-floor`, `latting`.

### Image Upload

Use `MultipleImageUpload` component. Images are converted to base64 with `preview` property for new uploads. Existing images have `product_image_id` for deletion tracking.

### Localization

Translations are in `src/shared/lib/i18n/locales/`:
- `ru.json` - Russian (primary)
- `en.json` - English
- `uz.json` - Uzbek

Common translation keys:
- `common.labels.*` - Form labels
- `common.placeholder.*` - Input placeholders
- `common.validation.*` - Validation messages
- `common.button.*` - Button text
- `common.messages.*` - Toast/notification messages
- `navigation.*` - Navigation items

### Icons

Available icons are defined in `src/shared/types/icons.ts` (type `IconType`). Use `<Icon icon="icon-name" />` component from `@/shared/ui`. SVG files are in `src/shared/assets/icons/`.

### Admin Routes

Admin module routes are defined in `src/pages/admin/routes.tsx`. Each module needs:
- Entry in `moduleImports` object
- Entry in `modules` array with `name`, `title`, `icon`

### TransactionForm Configuration

Product-specific required fields and sections are configured in `src/features/dashboard/bids/crud/tabs/TransactionForm.tsx`:
- `REQUIRED_FIELDS_BY_PRODUCT_TYPE` - Required fields per product type
- `CONDITIONAL_REQUIREMENTS` - Fields required based on form values
- `ALL_SECTIONS` - Form sections with `allowedProductTypes` filtering

### Service Pattern

Feature services follow a consistent static class pattern:
```typescript
// src/features/admin/colors/model/color.service.ts
export class ColorService {
  static async getAll(): Promise<Color[]> {
    return await apiService.$get<Color[]>("/color/all");
  }

  static async getById(colorId: number): Promise<Color> {
    return await apiService.$get<Color>(`/admin/color?color_id=${colorId}`);
  }

  static async create(payload: CreateColorPayload): Promise<Color> {
    return await apiService.$post<Color>("/admin/color", payload);
  }

  static async update(payload: UpdateColorPayload): Promise<Color> {
    const { color_id, ...data } = payload;
    return await apiService.$put<Color>(`/admin/color?color_id=${color_id}`, data);
  }

  static async delete(colorId: number): Promise<void> {
    return await apiService.$delete(`/admin/color?color_id=${colorId}`);
  }
}
```

### API Methods

When editing entities, prefer PATCH over PUT for partial updates:
```typescript
// In service files, use $patch for updates
static async update(id: number, payload: UpdatePayload): Promise<Entity> {
  return await apiService.$patch<Entity>(`/admin/entity?entity_id=${id}`, payload);
}
```

### Form Edit Pattern

For edit forms, track initial values to avoid sending unchanged data:
```typescript
const initialValue = useRef<string | null>(null);

useEffect(() => {
  if (data && open) {
    initialValue.current = data.field;
    form.setFieldsValue({ field: data.field });
  }
}, [data, open]);

const handleSave = () => {
  const changed = values.field !== initialValue.current;
  const payload = { ...baseFields };
  if (changed) payload.field = values.field;
  mutate(payload);
};
```

### Generated API Files

Files in `src/shared/lib/api/generated/` are auto-generated by Orval. Manual edits (like changing PUT to PATCH) will be overwritten on `npm run generate:api`. For permanent changes, create wrapper functions in feature service files.

### Route Protection & Lazy Loading

HOCs from `@/shared/hocs`:
- `AdminProtectedPage` - Wraps routes requiring admin role
- `withLazyLoad` - Route-level code splitting

```typescript
import { withLazyLoad } from "@/shared/hocs";
element: withLazyLoad(() => import("@/pages/module/Page"))
```

### useTableFetch Hook

Standard hook for paginated table data with URL-synced search params:
```typescript
const { tableData, pagination, isLoading, onPageChange, refetch } = useTableFetch<EntityType>(
  "/admin/entities", // API endpoint
  { status: "active" }, // Initial params (optional)
  ["tab"], // Ignored URL params (optional)
  false, // noResults: true for non-paginated endpoints
  20 // Default page size
);
```

Date params ending with `_from` and `_to` are automatically converted to timestamps.

### useValidationErrors Hook

Handle API validation errors in forms:
```typescript
const { validationErrors, getFieldError, hasFieldError, hasErrors } = useValidationErrors(mutationError);
// For nested fields: getFieldError("transactions.0.factory_mdf")
// For array fields: getArrayFieldError("transactions", 0, "factory_mdf")
```

### SelectInfinitive Component

For dropdowns with paginated API data and infinite scroll:
```typescript
<SelectInfinitive<EntityType>
  fetchUrl="/admin/entities"
  labelKey="name"           // or ["first_name", "last_name"] for composite labels
  valueKey="id"
  queryKey="entities"
  params={{ status: "active" }}
  onSelect={(value, option) => handleSelect(option)}
  onChange={(value) => form.setFieldValue("entity_id", value)}
/>
```

### Toast Notifications

Use `showGlobalToast` from `@/shared/hooks/toastService`:
```typescript
import { showGlobalToast } from "@/shared/hooks/toastService";
showGlobalToast(t("common.messages.success"), "success");
showGlobalToast(t("common.messages.error"), "error");
```

### Reactive Form Data in Tables

When displaying form array data in tables (e.g., transactions list), use `Form.useWatch` for reactivity:
```typescript
const form = Form.useFormInstance<FormType>();
const watchedData = Form.useWatch("fieldName", form) as DataType[] | undefined;
const tableData = watchedData?.length ? watchedData : [];
// Use tableData in TableWrapper instead of form.getFieldValue("fieldName")
```

`form.getFieldValue()` is not reactive and won't trigger re-renders when form data changes asynchronously (e.g., after API load).

### Authentication

Auth token is stored in both cookies (`__token`) and localStorage. Use `useAuth()` hook to check authentication state. The `eventBus` emits `"unauthorized"` on logout for cross-component synchronization.

### Transaction Data Transformation

When loading/saving transaction data, use utilities from `src/features/dashboard/bids/utils/transactionTransform.ts`:
- `transformTransactionDetailToForm` - API response → form values (for edit mode)
- `buildTransactionPayload` - form values → API payload (for save)

These handle field mapping, ID extraction, and type normalization (e.g., sash values must be strings for Radio.Group compatibility).

### Door 2D Visualization

The 2D door editor (`src/features/dashboard/bids/crud/tabs/Door2D/`) provides visual door configuration:
- `Door2DEditor` - Main component with canvas, part selector, sash selector
- `useCategoryProducts` - Fetches products by category section index:
  - `frames=5`, `crowns=7`, `casings=9`
  - Door types: `door-window=2` (ДО дверь), `door-deaf=3` (ДГ дверь)
- `sashOptions.ts` - Sash value mapping (form value "1"-"5" → assignment prefix "one-sash", "two-sash", etc.)

Bidirectional sync between form and 2D editor uses `productIds` prop (form→2D) and `onProductSelect`/`onSashChange` callbacks (2D→form).

The SashSelector is hidden when the "Полотно (дверь)" section is expanded in TransactionForm (controlled via `onDoorSectionToggle` callback).

### Image Assignment Convention

Product images use assignment prefixes for sash-type filtering:
- `one-sash-door`, `one-sash-frame`, `one-sash-crown`
- `two-sash-door`, `two-sash-frame`, `two-sash-crown`
- etc.

Use `getSashType(assignment)` to extract sash type from assignment string.
