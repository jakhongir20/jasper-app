# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev          # Start dev server on port 3000
npm run build        # Production build
npm run typecheck    # TypeScript type checking (tsc --noEmit)
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
npm run prettier     # Format all files
npm run generate:api # Regenerate API types from OpenAPI specs (orval)
npm run test         # Run tests (vitest)
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
