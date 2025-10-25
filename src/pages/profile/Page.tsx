import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ProfileView, ProfileEditModal } from "@/features/profile";
import { useCurrentUser } from "@/features/profile/model";
import { ContentWrapper, Breadcrumb } from "@/shared/ui";
import { BreadcrumbItem } from "@/shared/types";

export default function ProfilePage() {
    const { t } = useTranslation();
    const { data: user, isLoading } = useCurrentUser();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const breadcrumb: BreadcrumbItem[] = [
        {
            label: t("navigation.home"),
            icon: "home",
            link: "/dashboard",
        },
        {
            label: t("profile.title"),
            icon: "user",
        },
    ];

    const handleEdit = () => {
        setIsEditModalOpen(true);
    };

    const handleEditSuccess = () => {
        setIsEditModalOpen(false);
    };

    const handleEditCancel = () => {
        setIsEditModalOpen(false);
    };

    if (isLoading) {
        return (
            <div>
                <ContentWrapper>
                    <Breadcrumb breadcrumb={breadcrumb} />
                </ContentWrapper>
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg">{t("common.messages.loading")}</div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div>
                <ContentWrapper>
                    <Breadcrumb breadcrumb={breadcrumb} />
                </ContentWrapper>
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg text-red-500">{t("common.messages.userNotFound")}</div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <ContentWrapper>
                <Breadcrumb breadcrumb={breadcrumb} />
            </ContentWrapper>
            <ProfileView user={user} onEdit={handleEdit} />

            <ProfileEditModal
                open={isEditModalOpen}
                onCancel={handleEditCancel}
                onSuccess={handleEditSuccess}
            />
        </div>
    );
}
