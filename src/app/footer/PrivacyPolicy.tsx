import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import fill from "@/app/shared/fill";
import { useTranslation } from "@/app/shared/TranslationContext";

export default function PrivacyPolicy() {
  const { t } = useTranslation();
  return (
    <>
      <Typography sx={{ mb: 2 }}>
        {fill(t.privacy.playwire, {
          link: (
            <Link href="https://www.playwire.com/privacy-policy">
              https://www.playwire.com/privacy-policy
            </Link>
          ),
        })}
      </Typography>
      <Typography sx={{ mb: 2 }}>
        <Link href="http://www.playwire.com">
          <Box
            component="img"
            src="https://www.playwire.com/hubfs/Powered-by-Playwire-Badges/Ads-Powered-by-playwire-2021-standalone-large-300px.png"
            alt="Playwire"
            width="200"
            loading="lazy"
            sx={{ display: "block", mx: "auto" }}
          />
        </Link>
      </Typography>
      <Typography sx={{ mb: 2, textAlign: "center" }}>
        <Link href="https://www.playwire.com/contact-direct-sales">
          {t.privacy.advertise}
        </Link>
      </Typography>
    </>
  );
}
