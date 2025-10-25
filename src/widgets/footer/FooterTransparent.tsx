import { cn } from "@/shared/helpers";
import { IconType } from "@/shared/types";
import { Icon } from "@/shared/ui";
import { Layout } from "antd";
import { CSSProperties, FC } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface Props {
  className?: string;
}

const headerStyle: CSSProperties = {
  color: "#fff",
  height: 40,
  lineHeight: "40px",
  background: "transparent",
  padding: "0 64px",
  marginBottom: "28px",
};

const footerLinks = [
  { icon: "shield", textKey: "footer.publicOffer", to: "#" },
  { icon: "circle-question", textKey: "footer.aboutUs", to: "#" },
  { icon: "phone", textKey: "footer.feedback", to: "#" },
];

const socialLinks = [
  { src: "/svg/instagram.svg", alt: t("common.alt.instagram") },
  { src: "/svg/linkedin.svg", alt: t("common.alt.linkedin") },
  { src: "/svg/facebook.svg", alt: t("common.alt.facebook") },
  { src: "/svg/telegram.svg", alt: t("common.alt.telegram") },
];

export const FooterTransparent: FC<Props> = ({ className }) => {
  const { t } = useTranslation();
  return (
    <Layout.Footer style={headerStyle} className={cn(className)}>
      <div className="flex h-full w-full justify-between">
        <div className="flex items-center gap-9">
          {footerLinks.map(({ icon, textKey, to }) => (
            <Link
              key={textKey}
              to={to}
              className="group flex items-center gap-2 hover:text-violet"
            >
              <Icon
                icon={icon as IconType}
                className="transition-300 text-white ease-in-out group-hover:text-violet"
                height={16}
              />
              {t(textKey)}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {socialLinks.map(({ src, alt }) => (
            <Link key={alt} to="#">
              <img src={src} alt={alt} />
            </Link>
          ))}
        </div>
      </div>
    </Layout.Footer>
  );
};
