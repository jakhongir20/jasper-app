import { FC, useEffect, useState, useMemo } from "react";
import { Modal, Checkbox, Spin, Alert, Space } from "antd";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useAdminPermissionReadAllAdminPermissionAllGet } from "@/shared/lib/api/generated/user/permissions/permissions";
import { useAdminUserPermissionReadOneAdminUserPermissionGet } from "@/shared/lib/api/generated/user/user-permissions/user-permissions";
import { useAdminUserPermissionSetAdminSetUserPermissionPost } from "@/shared/lib/api/generated/user/users/users";
import { showGlobalToast } from "@/shared/hooks";

interface UserPermissionsModalProps {
  open: boolean;
  onCancel: () => void;
  userId: number;
  userName: string;
}

export const UserPermissionsModal: FC<UserPermissionsModalProps> = ({
  open,
  onCancel,
  userId,
  userName,
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // State for selected permissions
  const [selectedPermissions, setSelectedPermissions] = useState<Set<number>>(
    new Set()
  );
  const [initialPermissions, setInitialPermissions] = useState<Set<number>>(
    new Set()
  );
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch all available permissions
  const {
    data: allPermissionsData,
    isLoading: isLoadingAllPermissions,
    isError: isErrorAllPermissions,
  } = useAdminPermissionReadAllAdminPermissionAllGet(
    { limit: 100, offset: 0 },
    {
      query: {
        enabled: open,
      },
    }
  );

  // Fetch user's current permissions
  const {
    data: userPermissionsData,
    isLoading: isLoadingUserPermissions,
    isError: isErrorUserPermissions,
  } = useAdminUserPermissionReadOneAdminUserPermissionGet(
    { user_id: userId },
    {
      query: {
        enabled: open && !!userId,
      },
    }
  );

  // Update permissions mutation
  const { mutate: updatePermissions, isPending: isUpdating } =
    useAdminUserPermissionSetAdminSetUserPermissionPost({
      mutation: {
        onSuccess: () => {
          showGlobalToast(
            t("common.messages.permissionsUpdatedSuccessfully"),
            "success"
          );
          // Invalidate queries to refetch data
          queryClient.invalidateQueries({
            queryKey: ["/admin/user-permission"],
          });
          onCancel();
        },
        onError: (error: any) => {
          showGlobalToast(
            error?.message || t("common.messages.permissionsUpdateFailed"),
            "error"
          );
        },
      },
    });

  // Initialize selected permissions when data loads
  useEffect(() => {
    if (userPermissionsData && open) {
      const permissionIds = new Set(
        userPermissionsData.map((up) => up.permission.permission_id)
      );
      setSelectedPermissions(permissionIds);
      setInitialPermissions(permissionIds);
      setHasChanges(false);
    }
  }, [userPermissionsData, open]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setSelectedPermissions(new Set());
      setInitialPermissions(new Set());
      setHasChanges(false);
    }
  }, [open]);

  // Check if there are changes
  useEffect(() => {
    const hasChanged =
      selectedPermissions.size !== initialPermissions.size ||
      Array.from(selectedPermissions).some(
        (id) => !initialPermissions.has(id)
      );
    setHasChanges(hasChanged);
  }, [selectedPermissions, initialPermissions]);

  // Handle checkbox change
  const handlePermissionChange = (permissionId: number, checked: boolean) => {
    setSelectedPermissions((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(permissionId);
      } else {
        newSet.delete(permissionId);
      }
      return newSet;
    });
  };

  // Handle save
  const handleSave = () => {
    const permissionsToSet = Array.from(selectedPermissions).map((id) => ({
      permission_id: id,
    }));

    updatePermissions({
      data: {
        user_permissions: permissionsToSet,
      },
      params: {
        user_id: userId,
      },
    });
  };

  // Group permissions by scope
  const groupedPermissions = useMemo(() => {
    if (!allPermissionsData?.results) return {};

    const groups: Record<string, typeof allPermissionsData.results> = {};
    allPermissionsData.results.forEach((permission) => {
      const scope = permission.scope_name || "Other";
      if (!groups[scope]) {
        groups[scope] = [];
      }
      groups[scope].push(permission);
    });
    return groups;
  }, [allPermissionsData]);

  const isLoading = isLoadingAllPermissions || isLoadingUserPermissions;
  const hasError = isErrorAllPermissions || isErrorUserPermissions;
  const isSaveDisabled = !hasChanges || isLoading || isUpdating;

  return (
    <Modal
      title={`${t("common.labels.permissions")} - ${userName}`}
      open={open}
      onCancel={onCancel}
      onOk={handleSave}
      okText={t("common.button.save")}
      cancelText={t("common.button.cancel")}
      okButtonProps={{ disabled: isSaveDisabled, loading: isUpdating }}
      width={700}
      centered
      maskClosable={false}
    >
      <div className="max-h-[60vh] overflow-y-auto py-4">
        {isLoading && (
          <div className="flex justify-center py-8">
            <Spin size="large" />
          </div>
        )}

        {hasError && !isLoading && (
          <Alert
            message={t("common.messages.error")}
            description={t("common.messages.failedToLoadData")}
            type="error"
            showIcon
          />
        )}

        {!isLoading && !hasError && allPermissionsData?.results && (
          <Space direction="vertical" size="large" className="w-full">
            {Object.entries(groupedPermissions).map(([scope, permissions]) => (
              <div key={scope} className="rounded-lg border border-gray-200 p-4">
                <h4 className="mb-3 text-base font-semibold text-gray-800">
                  {scope}
                </h4>
                <Space direction="vertical" size="small" className="w-full">
                  {permissions.map((permission) => (
                    <Checkbox
                      key={permission.permission_id}
                      checked={selectedPermissions.has(
                        permission.permission_id
                      )}
                      onChange={(e) =>
                        handlePermissionChange(
                          permission.permission_id,
                          e.target.checked
                        )
                      }
                      disabled={isUpdating}
                    >
                      <span className="text-sm">
                        {t(`permissions.${permission.action_name}`, permission.action_name)}
                      </span>
                    </Checkbox>
                  ))}
                </Space>
              </div>
            ))}
          </Space>
        )}

        {!isLoading &&
          !hasError &&
          allPermissionsData?.results?.length === 0 && (
            <Alert
              message={t("common.messages.noPermissionsAvailable")}
              type="info"
              showIcon
            />
          )}
      </div>
    </Modal>
  );
};
